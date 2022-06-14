import {
  AcousticRatingCalculator,
  ExternalAcousticRating,
  Item,
} from '../src/calculator'

describe('test_test', () => {
  test('just a test for testing tests', () => {
    const items: Item[] = []
    const externalAcousticRating: ExternalAcousticRating =
      new ExternalAcousticRating()
    const calculator = new AcousticRatingCalculator(
      items,
      externalAcousticRating,
    )

    expect(calculator.calculate()).toEqual('tests are working')
  })
})
