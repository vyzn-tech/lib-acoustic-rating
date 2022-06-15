import { lowerCase } from 'lodash'
import { NOISE_SENSITIVITY_NONE, NoiseSensitivity, NoiseSensitivityUtil } from './noise-sensitivity'
import { NoiseExposure, NoiseExposureUtil } from './noise-exposure'
import {
  AcousticRatingLevel,
  AirborneAcousticRatingToExternal,
  AirborneAcousticRatingToInternal,
  AirborneAcousticRatingUtil,
} from './airborn-acoustic-rating'

type CelestialDirection = null | 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW'
type Status = 'new' | 'temporary' | 'existing' | 'demolish'
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

abstract class Item {
  id: string
  parentIds: string[]
}

class Surface extends Item {
  isExternal: boolean
  celestialDirection: CelestialDirection
  externalAcousticRating: ExternalAcousticRating
  airborneAcousticRatingToExternal: AirborneAcousticRatingToExternal
  airborneAcousticRatingToInternal: AirborneAcousticRatingToInternal
}

class Wall extends Surface {}

class Slab extends Surface {
  predefinedType: PredefinedType
}

class Door extends Surface {}

class Roof extends Surface {}

class FlatRoof extends Surface {}

class NeighbourBuilding extends Item {
  occupancyType: OccupancyType
  noiseSensitivity: NoiseSensitivity
  airborneNoiseExposure: NoiseExposure
  footstepNoiseExposure: NoiseExposure
}

class Space extends NeighbourBuilding {
  centerOfGravityZ: number
}

class Building extends Item {
  name: Name
  status: Status
}

class Zone extends Building {
  acousticRatingLevel: AcousticRatingLevel
}

class OutputItem {
  id: string
  airborneAcousticRatingCReq: number
  airborneAcousticRatingCtrReq: number
  footstepAcousticRatingCReq: number
  footstepAcousticRatingCtrReq: number
}

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

class AcousticRatingCalculator {
  items: Item[]
  externalAcousticRatings: ExternalAcousticRatingCollection
  noiseSensitivityUtil = new NoiseSensitivityUtil()
  noiseExposureUtil = new NoiseExposureUtil()
  airborneAcousticRatingUtil = new AirborneAcousticRatingUtil()

  constructor(items: Item[], externalAcousticRatings: ExternalAcousticRatingCollection) {
    this.items = items
    this.externalAcousticRatings = externalAcousticRatings
  }

  calculate(): string {
    this.setExternalAcousticRating()
    this.determineNoiseSensitivityAndExposure()
    this.determineAcousticRatingToExternalSources()
    this.determineAcousticRatingToInternalSources()
    console.log(this.items.filter((item) => item instanceof Surface))
    return 'tests are working'
  }

  setExternalAcousticRating() {
    for (const item of this.items) {
      if (item instanceof Surface && item.hasOwnProperty('celestialDirection')) {
        for (const key in this.externalAcousticRatings) {
          if (key === lowerCase(item.celestialDirection)) {
            item.externalAcousticRating = this.externalAcousticRatings[key]
          }
        }
      }
    }
  }

  determineNoiseSensitivityAndExposure() {
    for (const item of this.items) {
      if (item instanceof Space || item instanceof NeighbourBuilding) {
        item.noiseSensitivity = this.noiseSensitivityUtil.getNoiseSensitivity(item.occupancyType)
        item.airborneNoiseExposure = this.noiseExposureUtil.getAirborneNoiseExposure(item.occupancyType)
        item.footstepNoiseExposure = this.noiseExposureUtil.getFootstepNoiseExposure(item.occupancyType)
      }
    }
  }

  determineAcousticRatingToExternalSources() {
    function itemFilter(item: Item): item is Surface {
      return (
        (item instanceof Wall || item instanceof Slab || item instanceof FlatRoof || item instanceof Roof) &&
        item.isExternal == true
      )
    }
    const filteredSurfaces: Surface[] = this.items.filter(itemFilter)

    for (const surface of filteredSurfaces) {
      const parentSpace = this.getFirstInternalConnectedSpace(surface.parentIds)
      const acousticRatingLevel = this.getAcousticRatingLevelFromParentZone(surface.parentIds)
      if (!parentSpace || parentSpace.noiseSensitivity === NOISE_SENSITIVITY_NONE) {
        continue
      }

      surface.airborneAcousticRatingToExternal =
        this.airborneAcousticRatingUtil.getAirborneAcousticRatingTowardsExternalSources(
          parentSpace.noiseSensitivity,
          surface.externalAcousticRating,
          acousticRatingLevel,
        )
    }
  }

  determineAcousticRatingToInternalSources() {
    function itemFilter(item: Item): item is Surface {
      return item instanceof Wall || item instanceof Slab || item instanceof FlatRoof || item instanceof Roof
    }
    const filteredSurfaces: Surface[] = this.items.filter(itemFilter)

    for (const surface of filteredSurfaces) {
      if (surface.parentIds.length <= 1) {
        continue
      }
      const connectedSpaces: (Space | NeighbourBuilding)[] = this.getConnectedSpacesAndNeighbourBuildings(
        surface.parentIds,
      )
      const acousticRatingLevel = this.getAcousticRatingLevelFromParentZone(surface.parentIds)
      // console.log(surface.id)
      // console.log(connectedSpaces)
      surface.airborneAcousticRatingToInternal =
        this.airborneAcousticRatingUtil.getAirborneAcousticRatingTowardsInternalSources(
          connectedSpaces,
          acousticRatingLevel,
        )
    }
  }

  getFirstInternalConnectedSpace(parentIds: string[]): Space {
    function itemFilter(item: Item): item is Space {
      return (
        item instanceof Space &&
        item.occupancyType !== 'Balkon' &&
        item.occupancyType !== 'Attika' &&
        item.occupancyType !== 'Terrasse'
      )
    }
    const filteredSpaces: Space[] = this.items.filter(itemFilter)

    for (const parentId of parentIds) {
      for (const space of filteredSpaces) {
        if (space.id === parentId) {
          return space
        }
      }
    }
  }

  getConnectedSpacesAndNeighbourBuildings(parentIds: string[]): (Space | NeighbourBuilding)[] {
    function itemFilter(item: Item): item is Space | NeighbourBuilding {
      return item instanceof Space || item instanceof NeighbourBuilding
    }
    const filteredItems: (Space | NeighbourBuilding)[] = this.items.filter(itemFilter)

    const rooms: (Space | NeighbourBuilding)[] = []
    for (const parentId of parentIds) {
      for (const item of filteredItems) {
        if (item.id === parentId) {
          rooms.push(item)
        }
      }
    }
    return rooms
  }

  getAcousticRatingLevelFromParentZone(parentIds: string[]): AcousticRatingLevel {
    for (const parentId of parentIds) {
      for (const item of this.items) {
        if (item.id === parentId) {
          if (item instanceof Zone) {
            return item.acousticRatingLevel
          }
          if (item.parentIds && item.parentIds.length) {
            return this.getAcousticRatingLevelFromParentZone(item.parentIds)
          }
        }
      }
    }
  }
}

export {
  PREDEFINED_TYPE_ROOF,
  PREDEFINED_TYPE_BASESLAB,
  PREDEFINED_TYPE_FLOOR,
  ALL_PREDEFINED_TYPES,
  AcousticRatingCalculator,
  CelestialDirection,
  Surface,
  Item,
  ExternalAcousticRatingCollection,
  ExternalAcousticRating,
  Building,
  NeighbourBuilding,
  Door,
  Roof,
  FlatRoof,
  Slab,
  Space,
  Wall,
  Zone,
  Name,
  OccupancyType,
  OutputItem,
  PredefinedType,
  Status,
}
