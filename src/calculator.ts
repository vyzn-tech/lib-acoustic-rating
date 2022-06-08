type CelestialDirection =
  | null
  | "N"
  | "NE"
  | "E"
  | "SE"
  | "S"
  | "SW"
  | "W"
  | "NW"
type Status = "new" | "temporary" | "existing" | "demolish"
type Name = "Wand" | "Decke" | "Flachdach" | "Steildach" | "Bodenplatte"
type AcousticRatingLevelReq = "Mindestanforderungen" | "Erhoehte Anforderungen"

const PREDEFINED_TYPE_FLOOR = "FLOOR"
const PREDEFINED_TYPE_BASESLAB = "BASESLAB"
const PREDEFINED_TYPE_ROOF = "ROOF"
const ALL_PREDEFINED_TYPES = <const>[
  PREDEFINED_TYPE_FLOOR,
  PREDEFINED_TYPE_BASESLAB,
  PREDEFINED_TYPE_ROOF,
]
type PredefinedType = typeof ALL_PREDEFINED_TYPES[number]

type OccupancyType =
  | "Werkstatt"
  | "Empfang"
  | "Warteraum"
  | "Grossraumbüro"
  | "Kantine"
  | "Restaurant"
  | "Bad"
  | "WC"
  | "Verkauf"
  | "Labor"
  | "Korridor"
  | "Wohnen"
  | "Schlafen"
  | "Studio"
  | "Schulzimmer"
  | "Wohnküche"
  | "Büroraum"
  | "Hotelzimmer"
  | "Spitalzimmer"
  | "Ruheräume"
  | "Therapieraum"
  | "Lesezimmer"
  | "Studierzimmer"

abstract class IFCItem {
  id: string
  parentIds: string[]
}
class IFCBuilding extends IFCItem {
  status: Status
  name: Name
}

class IFCComponent extends IFCItem {
  isExternal: boolean
  celestialDirection: CelestialDirection
}

class IFCWall extends IFCComponent {}

class IFCSlab extends IFCWall {
  predefinedType: PredefinedType
}

class IFCDoor extends IFCWall {}

class IFCRoof extends IFCWall {}

class IFCSpace extends IFCItem {
  occupancyType: OccupancyType
  centerOfGravityZ: number
}

class IFCZone extends IFCBuilding {
  acousticRatingLevelReq: AcousticRatingLevelReq
}

class OutputComponent {
  id: string
  airborneAcousticRatingCReq: number
  airborneAcousticRatingCtrReq: number
  footstepAcousticRatingCReq: number
  footstepAcousticRatingCtrReq: number
}

class ExternalAcousticRatingItem {
  day: number
  night: number
}

class ExternalAcousticRating {
  N: ExternalAcousticRatingItem
  NE: ExternalAcousticRatingItem
  E: ExternalAcousticRatingItem
  SE: ExternalAcousticRatingItem
  S: ExternalAcousticRatingItem
  SW: ExternalAcousticRatingItem
  W: ExternalAcousticRatingItem
  NW: ExternalAcousticRatingItem
}

class AcousticRatingCalculator {
  ifcItems: IFCItem[]
  externalAcousticRating: ExternalAcousticRating

  constructor(
    ifcItems: IFCItem[],
    externalAcousticRating: ExternalAcousticRating
  ) {
    this.ifcItems = ifcItems
    this.externalAcousticRating = externalAcousticRating
  }

  calculate(): string {
    return "tests are working"
  }
  //
  // calculateAirborneAcousticRatingCReq() {}
  //
  // calculateAirborneAcousticRatingCtrReq() {}
  //
  // calculateFootstepAcousticRatingCReq() {}
  //
  // calculateFootstepAcousticRatingCtrReq() {}
}

// const acousticRatingCalculator = new AcousticRatingCalculator()
// const output = acousticRatingCalculator.calculate()

export {
  AcousticRatingCalculator,
  AcousticRatingLevelReq,
  CelestialDirection,
  IFCComponent,
  IFCItem,
  ExternalAcousticRating,
  ExternalAcousticRatingItem,
  IFCBuilding,
  IFCDoor,
  IFCRoof,
  IFCSlab,
  IFCSpace,
  IFCWall,
  IFCZone,
  Name,
  OccupancyType,
  OutputComponent,
  PREDEFINED_TYPE_ROOF,
  PREDEFINED_TYPE_BASESLAB,
  PREDEFINED_TYPE_FLOOR,
  ALL_PREDEFINED_TYPES,
  PredefinedType,
  Status,
}
