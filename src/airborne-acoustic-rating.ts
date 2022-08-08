import {
  NOISE_SENSITIVITY_HIGH,
  NOISE_SENSITIVITY_LOW,
  NOISE_SENSITIVITY_MODERATE,
  NoiseSensitivity,
} from './noise-sensitivity'
import {
  NOISE_EXPOSURE_HIGH,
  NOISE_EXPOSURE_LOW,
  NOISE_EXPOSURE_MODERATE,
  NOISE_EXPOSURE_VERY_HIGH,
  NoiseExposure,
  NoiseExposureUtil,
  SPECTRUM_ADJUSTMENT_TYPE_C,
  SpectrumAdjustmentType,
} from './noise-exposure'
import { NeighbourBuilding, Space } from './components'
import { ACOUSTIC_RATING_LEVEL_ENHANCED, AcousticRatingLevel } from './acoustic-rating-level'
import { ExternalAcousticRating } from './external-acoustic-rating'
import { AcousticRatingRequirement } from './acoustic-rating-requirement'

const ACOUSTIC_RATING_LIMIT_LOW = 52
const ACOUSTIC_RATING_LIMIT_HIGH = 60

const ACOUSTIC_RATING_PERIOD_DAY = 'day'
const ACOUSTIC_RATING_PERIOD_NIGHT = 'night'
const ACOUSTIC_RATING_PERIODS = <const>[ACOUSTIC_RATING_PERIOD_DAY, ACOUSTIC_RATING_PERIOD_NIGHT]
type AcousticRatingPeriod = typeof ACOUSTIC_RATING_PERIODS[number]

const ACOUSTIC_RATING_TYPE_INDOOR = 'indoor'
const ACOUSTIC_RATING_TYPE_OUTDOOR = 'outdoor'
const ACOUSTIC_RATING_TYPES = <const>[ACOUSTIC_RATING_TYPE_INDOOR, ACOUSTIC_RATING_TYPE_OUTDOOR]
type AcousticRatingType = typeof ACOUSTIC_RATING_TYPES[number]

const AIRBORNE_ACOUSTIC_RATING_ADDITION_OUTDOOR = 3
const AIRBORNE_ACOUSTIC_RATING_ADDITION_INDOOR = 4

const INDOOR_MAP = {
  [NOISE_SENSITIVITY_LOW]: {
    [NOISE_EXPOSURE_LOW]: 42,
    [NOISE_EXPOSURE_MODERATE]: 47,
    [NOISE_EXPOSURE_HIGH]: 52,
    [NOISE_EXPOSURE_VERY_HIGH]: 57,
  },
  [NOISE_SENSITIVITY_MODERATE]: {
    [NOISE_EXPOSURE_LOW]: 47,
    [NOISE_EXPOSURE_MODERATE]: 52,
    [NOISE_EXPOSURE_HIGH]: 57,
    [NOISE_EXPOSURE_VERY_HIGH]: 62,
  },
  [NOISE_SENSITIVITY_HIGH]: {
    [NOISE_EXPOSURE_LOW]: 52,
    [NOISE_EXPOSURE_MODERATE]: 57,
    [NOISE_EXPOSURE_HIGH]: 62,
    [NOISE_EXPOSURE_VERY_HIGH]: 67,
  },
}

const OUTDOOR_MAP = {
  [NOISE_SENSITIVITY_LOW]: {
    [ACOUSTIC_RATING_PERIOD_DAY]: {
      [ACOUSTIC_RATING_LIMIT_LOW]: 22,
      [ACOUSTIC_RATING_LIMIT_HIGH]: 38,
    },
    [ACOUSTIC_RATING_PERIOD_NIGHT]: {
      [ACOUSTIC_RATING_LIMIT_LOW]: 22,
      [ACOUSTIC_RATING_LIMIT_HIGH]: 30,
    },
  },
  [NOISE_SENSITIVITY_MODERATE]: {
    [ACOUSTIC_RATING_PERIOD_DAY]: {
      [ACOUSTIC_RATING_LIMIT_LOW]: 27,
      [ACOUSTIC_RATING_LIMIT_HIGH]: 33,
    },
    [ACOUSTIC_RATING_PERIOD_NIGHT]: {
      [ACOUSTIC_RATING_LIMIT_LOW]: 27,
      [ACOUSTIC_RATING_LIMIT_HIGH]: 25,
    },
  },
  [NOISE_SENSITIVITY_HIGH]: {
    [ACOUSTIC_RATING_PERIOD_DAY]: {
      [ACOUSTIC_RATING_LIMIT_LOW]: 32,
      [ACOUSTIC_RATING_LIMIT_HIGH]: 28,
    },
    [ACOUSTIC_RATING_PERIOD_NIGHT]: {
      [ACOUSTIC_RATING_LIMIT_LOW]: 32,
      [ACOUSTIC_RATING_LIMIT_HIGH]: 20,
    },
  },
}

class AirborneAcousticRatingToExternal {
  constructor(public requirementDay: AcousticRatingRequirement, public requirementNight: AcousticRatingRequirement) {}
}

class AirborneAcousticRatingToInternal {
  constructor(
    public requirementDirectionOne: AcousticRatingRequirement,
    public requirementDirectionTwo: AcousticRatingRequirement,
  ) {}
}

class AirborneAcousticRatingUtil {
  noiseExposureUtil: NoiseExposureUtil

  constructor(noiseExposureUtil: NoiseExposureUtil) {
    this.noiseExposureUtil = noiseExposureUtil
  }

  public getAirborneAcousticRatingTowardsExternalSources(
    space: Space,
    externalAcousticRating: ExternalAcousticRating,
  ): AirborneAcousticRatingToExternal {
    const requirementDay = AirborneAcousticRatingUtil.getOutdoorAcousticRatingRequirement(
      ACOUSTIC_RATING_PERIOD_DAY,
      space.noiseSensitivity,
      externalAcousticRating,
    )
    const requirementNight = AirborneAcousticRatingUtil.getOutdoorAcousticRatingRequirement(
      ACOUSTIC_RATING_PERIOD_NIGHT,
      space.noiseSensitivity,
      externalAcousticRating,
    )

    let requirementDayAddition = 0
    let requirementNightAddition = 0

    if (space.acousticRatingLevel === ACOUSTIC_RATING_LEVEL_ENHANCED) {
      requirementDayAddition = AirborneAcousticRatingUtil.getAdditionAccordingAcousticRatingLevel(
        space.acousticRatingLevel,
        ACOUSTIC_RATING_TYPE_OUTDOOR,
      )
      requirementNightAddition = AirborneAcousticRatingUtil.getAdditionAccordingAcousticRatingLevel(
        space.acousticRatingLevel,
        ACOUSTIC_RATING_TYPE_OUTDOOR,
      )
    }

    let spectrumAdjustmentType: SpectrumAdjustmentType = SPECTRUM_ADJUSTMENT_TYPE_C
    if (externalAcousticRating) {
      spectrumAdjustmentType = externalAcousticRating.spectrumAdjustmentType
    }

    return new AirborneAcousticRatingToExternal(
      new AcousticRatingRequirement(requirementDay, spectrumAdjustmentType, requirementDayAddition),
      new AcousticRatingRequirement(requirementNight, spectrumAdjustmentType, requirementNightAddition),
    )
  }

  private static getOutdoorAcousticRatingRequirement(
    period: AcousticRatingPeriod,
    noiseSensitivity: NoiseSensitivity,
    externalAcousticRating: ExternalAcousticRating,
  ) {
    const noiseSensitivityMap = OUTDOOR_MAP[noiseSensitivity][period]
    if (!externalAcousticRating) {
      return noiseSensitivityMap[ACOUSTIC_RATING_LIMIT_LOW]
    }
    if (externalAcousticRating[period] <= ACOUSTIC_RATING_LIMIT_HIGH) {
      return noiseSensitivityMap[ACOUSTIC_RATING_LIMIT_LOW]
    }
    return noiseSensitivityMap[ACOUSTIC_RATING_LIMIT_HIGH]
  }

  public getAirborneAcousticRatingTowardsInternalSources(
    spaces: (Space | NeighbourBuilding)[],
  ): AirborneAcousticRatingToInternal {
    if (spaces.length != 2) {
      throw RangeError('There are two spaces required!')
    }

    const spaceLeft = spaces[0]
    const spaceRight = spaces[1]

    let requirementDirectionLeftToRight = 0
    let requirementDirectionLeftToRightAddition = 0
    let requirementDirectionRightToLeft = 0
    let requirementDirectionRightToLeftAddition = 0

    if (spaceLeft.noiseSensitivity && spaceRight.airborneNoiseExposure && spaceLeft.constructor != NeighbourBuilding) {
      requirementDirectionLeftToRight = AirborneAcousticRatingUtil.getIndoorAcousticRating(
        spaceLeft.noiseSensitivity,
        spaceRight.airborneNoiseExposure,
      )
      if (spaceLeft.constructor == Space) {
        requirementDirectionLeftToRightAddition = AirborneAcousticRatingUtil.getAdditionAccordingAcousticRatingLevel(
          spaceLeft.acousticRatingLevel,
          ACOUSTIC_RATING_TYPE_INDOOR,
        )
      }
    }

    if (spaceRight.noiseSensitivity && spaceLeft.airborneNoiseExposure && spaceRight.constructor != NeighbourBuilding) {
      requirementDirectionRightToLeft = AirborneAcousticRatingUtil.getIndoorAcousticRating(
        spaceRight.noiseSensitivity,
        spaceLeft.airborneNoiseExposure,
      )
      if (spaceRight.constructor == Space) {
        requirementDirectionRightToLeftAddition = AirborneAcousticRatingUtil.getAdditionAccordingAcousticRatingLevel(
          spaceRight.acousticRatingLevel,
          ACOUSTIC_RATING_TYPE_INDOOR,
        )
      }
    }

    return new AirborneAcousticRatingToInternal(
      new AcousticRatingRequirement(
        requirementDirectionLeftToRight,
        this.noiseExposureUtil.getSpectrumAdjustmentType(spaceRight.occupancyType),
        requirementDirectionLeftToRightAddition,
      ),
      new AcousticRatingRequirement(
        requirementDirectionRightToLeft,
        this.noiseExposureUtil.getSpectrumAdjustmentType(spaceLeft.occupancyType),
        requirementDirectionRightToLeftAddition,
      ),
    )
  }

  private static getIndoorAcousticRating(noiseSensitivity: NoiseSensitivity, noiseExposure: NoiseExposure): number {
    return INDOOR_MAP[noiseSensitivity][noiseExposure]
  }

  private static getAdditionAccordingAcousticRatingLevel(
    acousticRatingLevel: AcousticRatingLevel,
    type: AcousticRatingType,
  ) {
    if (type === ACOUSTIC_RATING_TYPE_OUTDOOR && acousticRatingLevel === ACOUSTIC_RATING_LEVEL_ENHANCED) {
      return AIRBORNE_ACOUSTIC_RATING_ADDITION_OUTDOOR
    }
    if (type === ACOUSTIC_RATING_TYPE_INDOOR && acousticRatingLevel === ACOUSTIC_RATING_LEVEL_ENHANCED) {
      return AIRBORNE_ACOUSTIC_RATING_ADDITION_INDOOR
    }
    return 0
  }
}

export { AirborneAcousticRatingToExternal, AirborneAcousticRatingToInternal, AirborneAcousticRatingUtil }
