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
import { ExternalAcousticRating, NeighbourBuilding, Space } from './calculator'

const ACOUSTIC_RATING_LEVEL_MINIMUM = 'Mindestanforderungen'
const ACOUSTIC_RATING_LEVEL_ENHANCED = 'Erhoehte Anforderungen'
const ACOUSTIC_RATING_LEVELS = <const>[
  ACOUSTIC_RATING_LEVEL_MINIMUM,
  ACOUSTIC_RATING_LEVEL_ENHANCED,
]
type AcousticRatingLevel = typeof ACOUSTIC_RATING_LEVELS[number]

const ACOUSTIC_RATING_LEVEL_LIMIT_LOW = 52
const ACOUSTIC_RATING_LEVEL_LIMIT_HIGH = 60

const ACOUSTIC_RATING_LEVEL_PERIOD_DAY = 'day'
const ACOUSTIC_RATING_LEVEL_PERIOD_NIGHT = 'night'
const ACOUSTIC_RATING_LEVEL_PERIODS = <const>[
  ACOUSTIC_RATING_LEVEL_PERIOD_DAY,
  ACOUSTIC_RATING_LEVEL_PERIOD_NIGHT,
]
type AcousticRatingPeriod = typeof ACOUSTIC_RATING_LEVEL_PERIODS[number]

const ACOUSTIC_RATING_LEVEL_TYPE_INDOOR = 'indoor'
const ACOUSTIC_RATING_LEVEL_TYPE_OUTDOOR = 'outdoor'
const ACOUSTIC_RATING_LEVEL_TYPES = <const>[
  ACOUSTIC_RATING_LEVEL_TYPE_INDOOR,
  ACOUSTIC_RATING_LEVEL_TYPE_OUTDOOR,
]
type AcousticRatingType = typeof ACOUSTIC_RATING_LEVEL_TYPES[number]

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
    [ACOUSTIC_RATING_LEVEL_PERIOD_DAY]: {
      [ACOUSTIC_RATING_LEVEL_LIMIT_LOW]: 22,
      [ACOUSTIC_RATING_LEVEL_LIMIT_HIGH]: 38,
    },
    [ACOUSTIC_RATING_LEVEL_PERIOD_NIGHT]: {
      [ACOUSTIC_RATING_LEVEL_LIMIT_LOW]: 22,
      [ACOUSTIC_RATING_LEVEL_LIMIT_HIGH]: 30,
    },
  },
  [NOISE_SENSITIVITY_MODERATE]: {
    [ACOUSTIC_RATING_LEVEL_PERIOD_DAY]: {
      [ACOUSTIC_RATING_LEVEL_LIMIT_LOW]: 27,
      [ACOUSTIC_RATING_LEVEL_LIMIT_HIGH]: 33,
    },
    [ACOUSTIC_RATING_LEVEL_PERIOD_NIGHT]: {
      [ACOUSTIC_RATING_LEVEL_LIMIT_LOW]: 27,
      [ACOUSTIC_RATING_LEVEL_LIMIT_HIGH]: 25,
    },
  },
  [NOISE_SENSITIVITY_HIGH]: {
    [ACOUSTIC_RATING_LEVEL_PERIOD_DAY]: {
      [ACOUSTIC_RATING_LEVEL_LIMIT_LOW]: 32,
      [ACOUSTIC_RATING_LEVEL_LIMIT_HIGH]: 28,
    },
    [ACOUSTIC_RATING_LEVEL_PERIOD_NIGHT]: {
      [ACOUSTIC_RATING_LEVEL_LIMIT_LOW]: 32,
      [ACOUSTIC_RATING_LEVEL_LIMIT_HIGH]: 20,
    },
  },
}

class AirborneAcousticRatingToExternal {
  constructor(
    public lrDay: number,
    public lrNight: number,
    public de: number,
  ) {}
}

class AirborneAcousticRatingToInternal {
  constructor(public di1: number, public di2: number) {}
}

class AirborneAcousticRatingUtil {
  public getAirborneAcousticRatingTowardsExternalSources(
    noiseSensitivity: NoiseSensitivity,
    externalAcousticRating: ExternalAcousticRating,
    acousticRatingLevel: AcousticRatingLevel,
  ): AirborneAcousticRatingToExternal {
    let lrDay = AirborneAcousticRatingUtil.getOutdoorAcousticRating(
      ACOUSTIC_RATING_LEVEL_PERIOD_DAY,
      noiseSensitivity,
      externalAcousticRating,
    )
    let lrNight = AirborneAcousticRatingUtil.getOutdoorAcousticRating(
      ACOUSTIC_RATING_LEVEL_PERIOD_NIGHT,
      noiseSensitivity,
      externalAcousticRating,
    )

    if (acousticRatingLevel === ACOUSTIC_RATING_LEVEL_ENHANCED) {
      lrDay =
        AirborneAcousticRatingUtil.increaseValueIfAcousticRatingLevelEnhanced(
          lrDay,
          acousticRatingLevel,
          ACOUSTIC_RATING_LEVEL_TYPE_OUTDOOR,
        )
      lrNight =
        AirborneAcousticRatingUtil.increaseValueIfAcousticRatingLevelEnhanced(
          lrNight,
          acousticRatingLevel,
          ACOUSTIC_RATING_LEVEL_TYPE_OUTDOOR,
        )
    }

    //@todo figure out why we need "de"
    return new AirborneAcousticRatingToExternal(lrDay, lrNight, 0)
  }

  private static getOutdoorAcousticRating(
    period: AcousticRatingPeriod,
    noiseSensitivity: NoiseSensitivity,
    externalAcousticRating: ExternalAcousticRating,
  ) {
    const noiseSensitivityMap = OUTDOOR_MAP[noiseSensitivity][period]
    if (externalAcousticRating[period] <= ACOUSTIC_RATING_LEVEL_LIMIT_HIGH) {
      return noiseSensitivityMap[ACOUSTIC_RATING_LEVEL_LIMIT_LOW]
    }
    return noiseSensitivityMap[ACOUSTIC_RATING_LEVEL_LIMIT_HIGH]
  }

  public getAirborneAcousticRatingTowardsInternalSources(
    spaces: (Space | NeighbourBuilding)[],
    acousticRatingLevel: AcousticRatingLevel,
  ): AirborneAcousticRatingToInternal {
    if (spaces.length != 2) {
      throw RangeError('There are two spaces required!')
    }

    let di1 = 0
    let di2 = 0
    if (spaces[0].noiseSensitivity && spaces[1].airborneNoiseExposure) {
      di1 = AirborneAcousticRatingUtil.getIndoorAcousticRating(
        spaces[0].noiseSensitivity,
        spaces[1].airborneNoiseExposure,
      )
      di1 =
        AirborneAcousticRatingUtil.increaseValueIfAcousticRatingLevelEnhanced(
          di1,
          acousticRatingLevel,
          ACOUSTIC_RATING_LEVEL_TYPE_INDOOR,
        )
    }

    if (spaces[1].noiseSensitivity && spaces[0].airborneNoiseExposure) {
      di2 = AirborneAcousticRatingUtil.getIndoorAcousticRating(
        spaces[1].noiseSensitivity,
        spaces[0].airborneNoiseExposure,
      )
      di2 =
        AirborneAcousticRatingUtil.increaseValueIfAcousticRatingLevelEnhanced(
          di2,
          acousticRatingLevel,
          ACOUSTIC_RATING_LEVEL_TYPE_INDOOR,
        )
    }

    return new AirborneAcousticRatingToInternal(di1, di2)
  }

  private static getIndoorAcousticRating(
    noiseSensitivity: NoiseSensitivity,
    noiseExposure: NoiseExposure,
  ): number {
    return INDOOR_MAP[noiseSensitivity][noiseExposure]
  }

  private static increaseValueIfAcousticRatingLevelEnhanced(
    value: number,
    acousticRatingLevel: AcousticRatingLevel,
    type: AcousticRatingType,
  ) {
    if (
      type === ACOUSTIC_RATING_LEVEL_TYPE_OUTDOOR &&
      acousticRatingLevel === ACOUSTIC_RATING_LEVEL_ENHANCED
    ) {
      return value + 3
    }
    if (
      type === ACOUSTIC_RATING_LEVEL_TYPE_INDOOR &&
      acousticRatingLevel === ACOUSTIC_RATING_LEVEL_ENHANCED
    ) {
      return value + 4
    }
    return value
  }
}

export {
  ACOUSTIC_RATING_LEVEL_MINIMUM,
  ACOUSTIC_RATING_LEVEL_ENHANCED,
  ACOUSTIC_RATING_LEVELS,
  AcousticRatingLevel,
  AirborneAcousticRatingToExternal,
  AirborneAcousticRatingToInternal,
  AirborneAcousticRatingUtil,
}
