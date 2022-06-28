class ExternalAcousticRating {
  constructor(public day: number, public night: number) {}
}

class ExternalAcousticRatingCollection {
  constructor(
    public n: ExternalAcousticRating,
    public ne: ExternalAcousticRating,
    public e: ExternalAcousticRating,
    public se: ExternalAcousticRating,
    public s: ExternalAcousticRating,
    public sw: ExternalAcousticRating,
    public w: ExternalAcousticRating,
    public nw: ExternalAcousticRating,
  ) {}
}

export { ExternalAcousticRating, ExternalAcousticRatingCollection }
