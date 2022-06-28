import {
  NOISE_SENSITIVITY_HIGH,
  NOISE_SENSITIVITY_LOW,
  NOISE_SENSITIVITY_MODERATE,
  NOISE_SENSITIVITY_NONE,
} from './noise-sensitivity'
import {
  NOISE_EXPOSURE_HIGH,
  NOISE_EXPOSURE_LOW,
  NOISE_EXPOSURE_MODERATE,
  NOISE_EXPOSURE_VERY_HIGH,
} from './noise-exposure'
import { Space } from './components'
import { ACOUSTIC_RATING_LEVEL_ENHANCED } from './acoustic-rating-level'

const MAP = {
  [NOISE_SENSITIVITY_LOW]: {
    [NOISE_EXPOSURE_LOW]: 63,
    [NOISE_EXPOSURE_MODERATE]: 58,
    [NOISE_EXPOSURE_HIGH]: 53,
    [NOISE_EXPOSURE_VERY_HIGH]: 48,
  },
  [NOISE_SENSITIVITY_MODERATE]: {
    [NOISE_EXPOSURE_LOW]: 58,
    [NOISE_EXPOSURE_MODERATE]: 53,
    [NOISE_EXPOSURE_HIGH]: 48,
    [NOISE_EXPOSURE_VERY_HIGH]: 43,
  },
  [NOISE_SENSITIVITY_HIGH]: {
    [NOISE_EXPOSURE_LOW]: 53,
    [NOISE_EXPOSURE_MODERATE]: 48,
    [NOISE_EXPOSURE_HIGH]: 43,
    [NOISE_EXPOSURE_VERY_HIGH]: 38,
  },
}

class FootstepAcousticRating {
  constructor(public requirement: number) {}
}
class FootstepAcousticRatingUtil {
  public getFootstepAcousticRating(spaces: Space[]): FootstepAcousticRating {
    if (spaces.length != 2) {
      throw RangeError('There are two spaces required!')
    }

    let topSpace: Space
    let bottomSpace: Space
    if (spaces[0].centerOfGravityZ > spaces[1].centerOfGravityZ) {
      topSpace = spaces[0]
      bottomSpace = spaces[1]
    } else {
      topSpace = spaces[1]
      bottomSpace = spaces[0]
    }

    if (bottomSpace.noiseSensitivity === NOISE_SENSITIVITY_NONE) {
      return new FootstepAcousticRating(null)
    }

    let rating = MAP[bottomSpace.noiseSensitivity][topSpace.footstepNoiseExposure]
    if (bottomSpace.acousticRatingLevel === ACOUSTIC_RATING_LEVEL_ENHANCED) {
      rating -= 4
    }

    if (bottomSpace.operatingState === 'existing') {
      rating -= 2
    }

    if (topSpace.occupancyType === 'Balkon') {
      rating -= 5
    }

    return new FootstepAcousticRating(rating)
  }
}

export { FootstepAcousticRating, FootstepAcousticRatingUtil }
