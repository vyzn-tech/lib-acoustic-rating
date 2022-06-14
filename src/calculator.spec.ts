import {
  AcousticRatingCalculator,
  ExternalAcousticRating,
  IFCItem,
} from '../src/calculator'

describe('test_test', () => {
  test('just a test for testing tests', () => {
    const ifcItems: IFCItem[] = []
    const externalAcousticRating: ExternalAcousticRating =
      new ExternalAcousticRating()
    const calculator = new AcousticRatingCalculator(
      ifcItems,
      externalAcousticRating,
    )

    expect(calculator.calculate()).toEqual('tests are working')
  })
})
