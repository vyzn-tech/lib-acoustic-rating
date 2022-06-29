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
} from './noise-exposure'
import { Building, NeighbourBuilding, Space } from './components'
import { ACOUSTIC_RATING_LEVEL_ENHANCED, AcousticRatingLevel } from './acoustic-rating-level'
import { ExternalAcousticRating } from './external-acoustic-rating'

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
  constructor(public requirementDay: number, public requirementNight: number) {}
}

class AirborneAcousticRatingToInternal {
  constructor(public requirementDirectionOne: number, public requirementDirectionTwo: number) {}
}

class AirborneAcousticRatingUtil {
  public getAirborneAcousticRatingTowardsExternalSources(
    space: Space,
    externalAcousticRating: ExternalAcousticRating,
  ): AirborneAcousticRatingToExternal {
    let lrDay = AirborneAcousticRatingUtil.getOutdoorAcousticRating(
      ACOUSTIC_RATING_PERIOD_DAY,
      space.noiseSensitivity,
      externalAcousticRating,
    )
    let lrNight = AirborneAcousticRatingUtil.getOutdoorAcousticRating(
      ACOUSTIC_RATING_PERIOD_NIGHT,
      space.noiseSensitivity,
      externalAcousticRating,
    )

    if (space.acousticRatingLevel === ACOUSTIC_RATING_LEVEL_ENHANCED) {
      lrDay = AirborneAcousticRatingUtil.increaseValueIfAcousticRatingLevelEnhanced(
        lrDay,
        space.acousticRatingLevel,
        ACOUSTIC_RATING_TYPE_OUTDOOR,
      )
      lrNight = AirborneAcousticRatingUtil.increaseValueIfAcousticRatingLevelEnhanced(
        lrNight,
        space.acousticRatingLevel,
        ACOUSTIC_RATING_TYPE_OUTDOOR,
      )
    }

    return new AirborneAcousticRatingToExternal(lrDay, lrNight)
  }

  private static getOutdoorAcousticRating(
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

    let di1 = 0
    let di2 = 0

    if (spaceLeft.noiseSensitivity && spaceRight.airborneNoiseExposure && spaceRight.constructor != Building) {
      di1 = AirborneAcousticRatingUtil.getIndoorAcousticRating(
        spaceLeft.noiseSensitivity,
        spaceRight.airborneNoiseExposure,
      )
      if (spaceLeft.constructor == Space) {
        di1 = AirborneAcousticRatingUtil.increaseValueIfAcousticRatingLevelEnhanced(
          di1,
          spaceLeft.acousticRatingLevel,
          ACOUSTIC_RATING_TYPE_INDOOR,
        )
      }
    }

    if (spaceRight.noiseSensitivity && spaceLeft.airborneNoiseExposure && spaceLeft.constructor != Building) {
      di2 = AirborneAcousticRatingUtil.getIndoorAcousticRating(
        spaceRight.noiseSensitivity,
        spaceLeft.airborneNoiseExposure,
      )
      if (spaceRight.constructor == Space) {
        di2 = AirborneAcousticRatingUtil.increaseValueIfAcousticRatingLevelEnhanced(
          di2,
          spaceRight.acousticRatingLevel,
          ACOUSTIC_RATING_TYPE_INDOOR,
        )
      }
    }

    return new AirborneAcousticRatingToInternal(di1, di2)
  }

  private static getIndoorAcousticRating(noiseSensitivity: NoiseSensitivity, noiseExposure: NoiseExposure): number {
    return INDOOR_MAP[noiseSensitivity][noiseExposure]
  }

  private static increaseValueIfAcousticRatingLevelEnhanced(
    value: number,
    acousticRatingLevel: AcousticRatingLevel,
    type: AcousticRatingType,
  ) {
    if (type === ACOUSTIC_RATING_TYPE_OUTDOOR && acousticRatingLevel === ACOUSTIC_RATING_LEVEL_ENHANCED) {
      return value + 3
    }
    if (type === ACOUSTIC_RATING_TYPE_INDOOR && acousticRatingLevel === ACOUSTIC_RATING_LEVEL_ENHANCED) {
      return value + 4
    }
    return value
  }
}

export { AirborneAcousticRatingToExternal, AirborneAcousticRatingToInternal, AirborneAcousticRatingUtil }
