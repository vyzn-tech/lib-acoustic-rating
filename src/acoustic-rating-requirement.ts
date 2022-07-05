import { SpectrumAdjustmentType } from './noise-exposure'

class AcousticRatingRequirement {
  constructor(
    private base: number,
    public spectrumAdjustmentType: SpectrumAdjustmentType,
    private addition: number = 0,
    private reduction: number = 0,
  ) {}

  public getValue(): number {
    return this.base + this.addition - this.reduction
  }
}

export { AcousticRatingRequirement }
