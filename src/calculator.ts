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
  constructor(public id: string, public parentIds: string[]) {}
}

class Surface extends Item {
  externalAcousticRating: ExternalAcousticRating
  airborneAcousticRatingToExternal: AirborneAcousticRatingToExternal
  airborneAcousticRatingToInternal: AirborneAcousticRatingToInternal
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

class NeighbourBuilding extends Item {
  noiseSensitivity: NoiseSensitivity
  airborneNoiseExposure: NoiseExposure
  footstepNoiseExposure: NoiseExposure
  constructor(public id: string, public parentIds: string[], public occupancyType: OccupancyType) {
    super(id, parentIds)
  }
}

class Space extends NeighbourBuilding {
  constructor(
    public id: string,
    public parentIds: string[],
    public occupancyType: OccupancyType,
    public centerOfGravityZ: number,
  ) {
    super(id, parentIds, occupancyType)
  }
}

class Building extends Item {
  constructor(public id: string, public parentIds: string[], public name: Name, public status: Status) {
    super(id, parentIds)
  }
}

class Zone extends Building {
  constructor(
    public id: string,
    public parentIds: string[],
    public name: Name,
    public status: Status,
    public acousticRatingLevel: AcousticRatingLevel,
  ) {
    super(id, parentIds, name, status)
  }
}

class OutputItem {
  constructor(
    public id: string,
    public airborneAcousticRatingCReq: number,
    public airborneAcousticRatingCtrReq: number,
    public footstepAcousticRatingCReq: number,
    public footstepAcousticRatingCtrReq: number,
    public warning: string,
    public error: string,
  ) {}
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

  public calculate(): OutputItem[] {
    const output: OutputItem[] = []
    this.setExternalAcousticRating()
    this.determineNoiseSensitivityAndExposure()
    this.determineAcousticRatingToExternalSources()
    this.determineAcousticRatingToInternalSources()
    for (const item of this.items) {
      if (item instanceof Surface) {
        output.push(
          new OutputItem(
            item.id,
            AcousticRatingCalculator.getMaxAirborneAcousticRating(item),
            null,
            null,
            null,
            null,
            null,
          ),
        )
      }
    }
    return output
  }

  private setExternalAcousticRating() {
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

  private determineNoiseSensitivityAndExposure() {
    for (const item of this.items) {
      if (item instanceof Space || item instanceof NeighbourBuilding) {
        item.noiseSensitivity = this.noiseSensitivityUtil.getNoiseSensitivity(item.occupancyType)
        item.airborneNoiseExposure = this.noiseExposureUtil.getAirborneNoiseExposure(item.occupancyType)
        item.footstepNoiseExposure = this.noiseExposureUtil.getFootstepNoiseExposure(item.occupancyType)
      }
    }
  }

  private determineAcousticRatingToExternalSources() {
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

  private determineAcousticRatingToInternalSources() {
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
      surface.airborneAcousticRatingToInternal =
        this.airborneAcousticRatingUtil.getAirborneAcousticRatingTowardsInternalSources(
          connectedSpaces,
          acousticRatingLevel,
        )
    }
  }

  private static getMaxAirborneAcousticRating(surface: Surface) {
    let maxInternal = 0
    if (surface.airborneAcousticRatingToInternal) {
      maxInternal = Math.max(surface.airborneAcousticRatingToInternal.di1, surface.airborneAcousticRatingToInternal.di2)
    }

    let maxExternal = 0
    if (surface.airborneAcousticRatingToExternal) {
      maxExternal = Math.max(
        surface.airborneAcousticRatingToExternal.de,
        surface.airborneAcousticRatingToExternal.lrDay,
        surface.airborneAcousticRatingToExternal.lrNight,
      )
    }

    const maximum = Math.max(maxInternal, maxExternal)
    return maximum > 0 ? maximum : null
  }

  private getFirstInternalConnectedSpace(parentIds: string[]): Space {
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

  private getConnectedSpacesAndNeighbourBuildings(parentIds: string[]): (Space | NeighbourBuilding)[] {
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

  private getAcousticRatingLevelFromParentZone(parentIds: string[]): AcousticRatingLevel {
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
