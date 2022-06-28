import { AirborneAcousticRatingToExternal, AirborneAcousticRatingToInternal } from './airborn-acoustic-rating'
import { FootstepAcousticRating } from './footstep-acoustic-rating'
import { NoiseSensitivity } from './noise-sensitivity'
import { NoiseExposure } from './noise-exposure'
import { AcousticRatingLevel } from './acoustic-rating-level'
import { ExternalAcousticRating } from './external-acoustic-rating'

type CelestialDirection = null | 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW'
type OperatingState = 'new' | 'temporary' | 'existing' | 'demolish'
type Name = 'Wand' | 'Decke' | 'Flachdach' | 'Steildach' | 'Bodenplatte'

const PREDEFINED_TYPE_FLOOR = 'FLOOR'
const PREDEFINED_TYPE_BASESLAB = 'BASESLAB'
const PREDEFINED_TYPE_ROOF = 'ROOF'
const ALL_PREDEFINED_TYPES = <const>[PREDEFINED_TYPE_FLOOR, PREDEFINED_TYPE_BASESLAB, PREDEFINED_TYPE_ROOF]
type PredefinedType = typeof ALL_PREDEFINED_TYPES[number]

type OccupancyType =
  | 'Werkstatt'
  | 'Empfang'
  | 'Warteraum'
  | 'Grossraumbüro'
  | 'Kantine'
  | 'Restaurant'
  | 'Bad'
  | 'WC'
  | 'Verkauf'
  | 'Labor'
  | 'Korridor'
  | 'Wohnen'
  | 'Schlafen'
  | 'Studio'
  | 'Schulzimmer'
  | 'Wohnküche'
  | 'Büroraum'
  | 'Hotelzimmer'
  | 'Spitalzimmer'
  | 'Ruheräume'
  | 'Therapieraum'
  | 'Lesezimmer'
  | 'Studierzimmer'
  | 'Balkon'
  | 'Attika'
  | 'Terrasse'

abstract class Component {
  constructor(public id: string, public parentIds: string[]) {}
}

class Surface extends Component {
  externalAcousticRating: ExternalAcousticRating
  airborneAcousticRatingToExternal: AirborneAcousticRatingToExternal
  airborneAcousticRatingToInternal: AirborneAcousticRatingToInternal
  footstepAcousticRating: FootstepAcousticRating
  constructor(
    public id: string,
    public parentIds: string[],
    public isExternal: boolean,
    public celestialDirection: CelestialDirection,
  ) {
    super(id, parentIds)
  }
}

class Wall extends Surface {}

class Slab extends Surface {
  constructor(
    public id: string,
    public parentIds: string[],
    public isExternal: boolean,
    public celestialDirection: CelestialDirection,
    public predefinedType: PredefinedType,
  ) {
    super(id, parentIds, isExternal, celestialDirection)
  }
}

class Door extends Surface {}

class Roof extends Surface {}

class FlatRoof extends Surface {}

class NeighbourBuilding extends Component {
  noiseSensitivity: NoiseSensitivity
  airborneNoiseExposure: NoiseExposure
  constructor(public id: string, public parentIds: string[], public occupancyType: OccupancyType) {
    super(id, parentIds)
  }
}

class Space extends NeighbourBuilding {
  footstepNoiseExposure: NoiseExposure
  acousticRatingLevel: AcousticRatingLevel
  operatingState: OperatingState
  constructor(
    public id: string,
    public parentIds: string[],
    public occupancyType: OccupancyType,
    public centerOfGravityZ: number,
  ) {
    super(id, parentIds, occupancyType)
  }
}

class Building extends Component {
  constructor(public id: string, public parentIds: string[], public name: Name, public operatingState: OperatingState) {
    super(id, parentIds)
  }
}

class Zone extends Building {
  constructor(
    public id: string,
    public parentIds: string[],
    public name: Name,
    public operatingState: OperatingState,
    public acousticRatingLevel: AcousticRatingLevel,
  ) {
    super(id, parentIds, name, operatingState)
  }
}

export {
  PREDEFINED_TYPE_ROOF,
  PREDEFINED_TYPE_BASESLAB,
  PREDEFINED_TYPE_FLOOR,
  ALL_PREDEFINED_TYPES,
  Surface,
  Component,
  Building,
  NeighbourBuilding,
  Door,
  Roof,
  FlatRoof,
  Slab,
  Space,
  Wall,
  Zone,
  CelestialDirection,
  Name,
  OccupancyType,
  PredefinedType,
  OperatingState,
}
