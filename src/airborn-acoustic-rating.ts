import {
  NOISE_SENSITIVITY_HIGH,
  NOISE_SENSITIVITY_LOW,
  NOISE_SENSITIVITY_MODERATE,
} from './noise-sensitivity'
import {
  NOISE_EXPOSURE_HIGH,
  NOISE_EXPOSURE_LOW,
  NOISE_EXPOSURE_MODERATE,
  NOISE_EXPOSURE_VERY_HIGH,
} from './noise-exposure'
import { ExternalAcousticRating } from './calculator'

const ACOUSTIC_RATING_LEVEL_MINIMUM = 'Mindestanforderungen'
const ACOUSTIC_RATING_LEVEL_ENHANCED = 'Erhoehte Anforderungen'
const ACOUSTIC_RATING_LEVELS = <const>[
  ACOUSTIC_RATING_LEVEL_MINIMUM,
  ACOUSTIC_RATING_LEVEL_ENHANCED,
]

type AcousticRatingLevel = typeof ACOUSTIC_RATING_LEVELS[number]

const ACOUSTIC_RATING_LEVEL_PERIOD_DAY = 'day'
const ACOUSTIC_RATING_LEVEL_PERIOD_NIGHT = 'night'
const ACOUSTIC_RATING_LEVEL_LOW = 52
const ACOUSTIC_RATING_LEVEL_HIGH = 60

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
      [ACOUSTIC_RATING_LEVEL_LOW]: 22,
      [ACOUSTIC_RATING_LEVEL_HIGH]: 38,
    },
    [ACOUSTIC_RATING_LEVEL_PERIOD_NIGHT]: {
      [ACOUSTIC_RATING_LEVEL_LOW]: 22,
      [ACOUSTIC_RATING_LEVEL_HIGH]: 30,
    },
  },
  [NOISE_SENSITIVITY_MODERATE]: {
    [ACOUSTIC_RATING_LEVEL_PERIOD_DAY]: {
      [ACOUSTIC_RATING_LEVEL_LOW]: 27,
      [ACOUSTIC_RATING_LEVEL_HIGH]: 33,
    },
    [ACOUSTIC_RATING_LEVEL_PERIOD_NIGHT]: {
      [ACOUSTIC_RATING_LEVEL_LOW]: 27,
      [ACOUSTIC_RATING_LEVEL_HIGH]: 25,
    },
  },
  [NOISE_SENSITIVITY_HIGH]: {
    [ACOUSTIC_RATING_LEVEL_PERIOD_DAY]: {
      [ACOUSTIC_RATING_LEVEL_LOW]: 32,
      [ACOUSTIC_RATING_LEVEL_HIGH]: 28,
    },
    [ACOUSTIC_RATING_LEVEL_PERIOD_NIGHT]: {
      [ACOUSTIC_RATING_LEVEL_LOW]: 32,
      [ACOUSTIC_RATING_LEVEL_HIGH]: 20,
    },
  },
}

class AirborneAcousticRating {
  constructor(public lrDay: number, public lrNight: number) {}
}

class AirborneAcousticRatingUtil {
  public getAirborneAcousticRatingTowardsExternalSources(
    noiseSensitivity,
    externalAcousticRating: ExternalAcousticRating,
    acousticRatingLevel,
  ) {
    let lrDay = AirborneAcousticRatingUtil.getOutdoorAcousticRating(
      ACOUSTIC_RATING_LEVEL_PERIOD_DAY,
      noiseSensitivity,
      externalAcousticRating.day,
    )
    let lrNight = AirborneAcousticRatingUtil.getOutdoorAcousticRating(
      ACOUSTIC_RATING_LEVEL_PERIOD_NIGHT,
      noiseSensitivity,
      externalAcousticRating.night,
    )

    if (acousticRatingLevel === ACOUSTIC_RATING_LEVEL_ENHANCED) {
      lrDay += 3
      lrNight += 3
    }

    return new AirborneAcousticRating(lrDay, lrNight)
  }

  private static getOutdoorAcousticRating(
    period,
    noiseSensitivity,
    externalAcousticRating,
  ) {
    const noiseSensitivityMap = OUTDOOR_MAP[noiseSensitivity][period]
    if (externalAcousticRating <= ACOUSTIC_RATING_LEVEL_HIGH) {
      return noiseSensitivityMap[ACOUSTIC_RATING_LEVEL_LOW]
    }
    return noiseSensitivityMap[ACOUSTIC_RATING_LEVEL_HIGH]
  }
}

export {
  ACOUSTIC_RATING_LEVEL_MINIMUM,
  ACOUSTIC_RATING_LEVEL_ENHANCED,
  ACOUSTIC_RATING_LEVELS,
  AcousticRatingLevel,
  AirborneAcousticRating,
  AirborneAcousticRatingUtil,
}
