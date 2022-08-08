import { AirborneAcousticRatingToExternal, AirborneAcousticRatingToInternal } from './airborne-acoustic-rating'
import { NoiseSensitivity } from './noise-sensitivity'
import { NoiseExposure } from './noise-exposure'
import { AcousticRatingLevel } from './acoustic-rating-level'
import { ExternalAcousticRating } from './external-acoustic-rating'
import { AcousticRatingRequirement } from './acoustic-rating-requirement'

type CelestialDirection = null | 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW'

const OPERATING_STATE_NEW = 'new'
const OPERATING_STATE_TEMP = 'temporary'
const OPERATING_STATE_EXISTING = 'existing'
const OPERATING_STATE_DEMOLISH = 'demolish'
const ALL_OPERATING_STATES = <const>[
  OPERATING_STATE_NEW,
  OPERATING_STATE_TEMP,
  OPERATING_STATE_EXISTING,
  OPERATING_STATE_DEMOLISH,
]
type OperatingState = typeof ALL_OPERATING_STATES[number]
type Name = 'Wand' | 'Decke' | 'Flachdach' | 'Steildach' | 'Bodenplatte'

const PREDEFINED_TYPE_FLOOR = 'FLOOR'
const PREDEFINED_TYPE_BASESLAB = 'BASESLAB'
const PREDEFINED_TYPE_ROOF = 'ROOF'
const ALL_PREDEFINED_TYPES = <const>[PREDEFINED_TYPE_FLOOR, PREDEFINED_TYPE_BASESLAB, PREDEFINED_TYPE_ROOF]
type PredefinedType = typeof ALL_PREDEFINED_TYPES[number]

const OCCUPANCY_TYPE_BALCONY = 'Balkon'

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
  footstepAcousticRating: AcousticRatingRequirement
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
  OCCUPANCY_TYPE_BALCONY,
  OccupancyType,
  PredefinedType,
  OPERATING_STATE_NEW,
  OPERATING_STATE_TEMP,
  OPERATING_STATE_EXISTING,
  OPERATING_STATE_DEMOLISH,
  OperatingState,
}
