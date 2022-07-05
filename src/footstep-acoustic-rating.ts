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
  NoiseExposureUtil,
} from './noise-exposure'
import { OCCUPANCY_TYPE_BALCONY, OPERATING_STATE_EXISTING, Space } from './components'
import { ACOUSTIC_RATING_LEVEL_ENHANCED } from './acoustic-rating-level'
import { AcousticRatingRequirement } from './acoustic-rating-requirement'

const FOOTSTEP_ACOUSTIC_RATING_REDUCTION_ENHANCED_RATING_LEVEL = 4
const FOOTSTEP_ACOUSTIC_RATING_REDUCTION_EXISTING_BUILDING = 2
const FOOTSTEP_ACOUSTIC_RATING_REDUCTION_BALCONY = 5

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

class FootstepAcousticRatingUtil {
  noiseExposureUtil = new NoiseExposureUtil()

  public getFootstepAcousticRating(spaces: Space[]): AcousticRatingRequirement {
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
      return new AcousticRatingRequirement(null, null, null)
    }

    const requirement: number = MAP[bottomSpace.noiseSensitivity][topSpace.footstepNoiseExposure]
    let reduction = 0
    if (bottomSpace.acousticRatingLevel === ACOUSTIC_RATING_LEVEL_ENHANCED) {
      reduction += FOOTSTEP_ACOUSTIC_RATING_REDUCTION_ENHANCED_RATING_LEVEL
    }

    if (bottomSpace.operatingState === OPERATING_STATE_EXISTING) {
      reduction += FOOTSTEP_ACOUSTIC_RATING_REDUCTION_EXISTING_BUILDING
    }

    if (topSpace.occupancyType === OCCUPANCY_TYPE_BALCONY) {
      reduction += FOOTSTEP_ACOUSTIC_RATING_REDUCTION_BALCONY
    }

    return new AcousticRatingRequirement(
      requirement,
      this.noiseExposureUtil.getSpectrumAdjustmentType(topSpace.occupancyType),
      0,
      reduction,
    )
  }
}

export { FootstepAcousticRatingUtil }
