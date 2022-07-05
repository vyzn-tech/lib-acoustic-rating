import { AcousticRatingCalculator } from './calculator'
import { ExternalAcousticRating, ExternalAcousticRatingCollection } from './external-acoustic-rating'

import * as fs from 'fs'
import CsvConverter from './csv-converter'

describe('tests calculation result', () => {
  const externalAcousticRatingCollection: ExternalAcousticRatingCollection = new ExternalAcousticRatingCollection(
    new ExternalAcousticRating(62, 55, 'ctr'),
    new ExternalAcousticRating(62, 55, 'ctr'),
    new ExternalAcousticRating(0, 0, 'c'),
    new ExternalAcousticRating(0, 0, 'c'),
    new ExternalAcousticRating(0, 0, 'c'),
    new ExternalAcousticRating(0, 0, 'c'),
    new ExternalAcousticRating(0, 0, 'c'),
    new ExternalAcousticRating(0, 0, 'c'),
  )
  const inputCSVString = fs.readFileSync('test_assets/input.csv').toString('utf8')
  const validResultJson = fs.readFileSync('test_assets/valid_result.json').toString('utf8')
  const validResultItems = JSON.parse(validResultJson)

  const components = new CsvConverter().convertToComponents(inputCSVString)
  const calculator = new AcousticRatingCalculator(components, externalAcousticRatingCollection)
  const calculationResult = calculator.calculate()

  for (const [index, validResultItem] of validResultItems.entries()) {
    if (true) {
      test('test for id ' + validResultItem.id, () => {
        expect(calculationResult[index]).toEqual(validResultItem)
      })
    }
  }
})
