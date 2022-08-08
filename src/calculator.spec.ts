import { AcousticRatingCalculator } from './calculator'
import { ExternalAcousticRating, ExternalAcousticRatingCollection } from './external-acoustic-rating'

import * as fs from 'fs'
import CsvConverter from './csv-converter'
import {
  NOISE_EXPOSURE_HIGH,
  NOISE_EXPOSURE_LOW,
  NOISE_EXPOSURE_MODERATE,
  NOISE_EXPOSURE_VERY_HIGH,
  NoiseExposureMap,
  SPECTRUM_ADJUSTMENT_TYPE_C,
  SPECTRUM_ADJUSTMENT_TYPE_CTR,
  SpectrumAdjustmentTypeMap,
} from './noise-exposure'
import {
  NOISE_SENSITIVITY_LOW,
  NOISE_SENSITIVITY_MODERATE,
  NOISE_SENSITIVITY_NONE,
  NoiseSensitivityMap,
} from './noise-sensitivity'

describe('tests calculation result', () => {
  const externalAcousticRatingCollection: ExternalAcousticRatingCollection = new ExternalAcousticRatingCollection(
    new ExternalAcousticRating(62, 55, SPECTRUM_ADJUSTMENT_TYPE_CTR),
    new ExternalAcousticRating(62, 55, SPECTRUM_ADJUSTMENT_TYPE_CTR),
    new ExternalAcousticRating(0, 0, SPECTRUM_ADJUSTMENT_TYPE_C),
    new ExternalAcousticRating(0, 0, SPECTRUM_ADJUSTMENT_TYPE_C),
    new ExternalAcousticRating(0, 0, SPECTRUM_ADJUSTMENT_TYPE_C),
    new ExternalAcousticRating(0, 0, SPECTRUM_ADJUSTMENT_TYPE_C),
    new ExternalAcousticRating(0, 0, SPECTRUM_ADJUSTMENT_TYPE_C),
    new ExternalAcousticRating(0, 0, SPECTRUM_ADJUSTMENT_TYPE_C),
  )
  const inputCSVString = fs.readFileSync('test_assets/input.csv').toString('utf8')
  const validResultJson = fs.readFileSync('test_assets/valid_result.json').toString('utf8')
  const validResultItems = JSON.parse(validResultJson)

  const additionalNoiseSensitivityMap: NoiseSensitivityMap = {
    Terrasse: NOISE_SENSITIVITY_NONE,
    Waschraum: NOISE_SENSITIVITY_NONE,
    Einfahrt: NOISE_SENSITIVITY_NONE,
    Keller: NOISE_SENSITIVITY_NONE,
    Technik: NOISE_SENSITIVITY_NONE,
    Tiefgarage: NOISE_SENSITIVITY_NONE,
    Treppenhaus: NOISE_SENSITIVITY_NONE,
    Gewerbe: NOISE_SENSITIVITY_LOW,
    Bad: NOISE_SENSITIVITY_LOW,
    Wohnen: NOISE_SENSITIVITY_MODERATE,
    Schlafen: NOISE_SENSITIVITY_MODERATE,
  }

  const additionalAirborneNoiseExposureMap: NoiseExposureMap = {
    Keller: NOISE_EXPOSURE_LOW,
    Wohnen: NOISE_EXPOSURE_MODERATE,
    Schlafen: NOISE_EXPOSURE_MODERATE,
    Bad: NOISE_EXPOSURE_MODERATE,
    Tiefgarage: NOISE_EXPOSURE_MODERATE,
    Einfahrt: NOISE_EXPOSURE_MODERATE,
    Terrasse: NOISE_EXPOSURE_MODERATE,
    Treppenhaus: NOISE_EXPOSURE_MODERATE,
    Waschraum: NOISE_EXPOSURE_HIGH,
    Technik: NOISE_EXPOSURE_HIGH,
    Gewerbe: NOISE_EXPOSURE_VERY_HIGH,
  }
  const additionalFootstepNoiseExposureMap: NoiseExposureMap = {
    Keller: NOISE_EXPOSURE_LOW,
    Wohnen: NOISE_EXPOSURE_MODERATE,
    Schlafen: NOISE_EXPOSURE_MODERATE,
    Bad: NOISE_EXPOSURE_MODERATE,
    Tiefgarage: NOISE_EXPOSURE_MODERATE,
    Einfahrt: NOISE_EXPOSURE_MODERATE,
    Treppenhaus: NOISE_EXPOSURE_MODERATE,
    Terrasse: NOISE_EXPOSURE_MODERATE,
    Waschraum: NOISE_EXPOSURE_VERY_HIGH,
    Technik: NOISE_EXPOSURE_LOW,
    Gewerbe: NOISE_EXPOSURE_HIGH,
  }
  const additionalSpectrumAdjustmentTypeMap: SpectrumAdjustmentTypeMap = {
    Keller: SPECTRUM_ADJUSTMENT_TYPE_C,
    Wohnen: SPECTRUM_ADJUSTMENT_TYPE_C,
    Schlafen: SPECTRUM_ADJUSTMENT_TYPE_C,
    Bad: SPECTRUM_ADJUSTMENT_TYPE_C,
    Tiefgarage: SPECTRUM_ADJUSTMENT_TYPE_CTR,
    Einfahrt: SPECTRUM_ADJUSTMENT_TYPE_CTR,
    Terrasse: SPECTRUM_ADJUSTMENT_TYPE_C,
    Treppenhaus: SPECTRUM_ADJUSTMENT_TYPE_C,
    Waschraum: SPECTRUM_ADJUSTMENT_TYPE_CTR,
    Technik: SPECTRUM_ADJUSTMENT_TYPE_C,
    Gewerbe: SPECTRUM_ADJUSTMENT_TYPE_CTR,
  }

  const components = new CsvConverter().convertToComponents(inputCSVString)
  const calculator = new AcousticRatingCalculator(
    components,
    externalAcousticRatingCollection,
    additionalNoiseSensitivityMap,
    additionalAirborneNoiseExposureMap,
    additionalFootstepNoiseExposureMap,
    additionalSpectrumAdjustmentTypeMap,
  )
  const calculationResult = calculator.calculate()

  for (const [index, validResultItem] of validResultItems.entries()) {
    if (true) {
      test('test for id ' + validResultItem.id, () => {
        expect(calculationResult[index]).toEqual(validResultItem)
      })
    }
  }
})
