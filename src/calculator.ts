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

abstract class Component {
  constructor(public id: string, public parentIds: string[]) {}
}

class Surface extends Component {
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

class NeighbourBuilding extends Component {
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

class Building extends Component {
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
  items: Component[]
  externalAcousticRatings: ExternalAcousticRatingCollection
  noiseSensitivityUtil = new NoiseSensitivityUtil()
  noiseExposureUtil = new NoiseExposureUtil()
  airborneAcousticRatingUtil = new AirborneAcousticRatingUtil()

  constructor(items: Component[], externalAcousticRatings: ExternalAcousticRatingCollection) {
    this.items = items
    this.externalAcousticRatings = externalAcousticRatings
  }

  public calculate(): OutputItem[] {
    const output: OutputItem[] = []
    this.setExternalAcousticRating()
    this.determineNoiseSensitivityAndExposure()
    this.determineAcousticRatingToExternalSources()
    this.determineAcousticRatingToInternalSources()
    for (const component of this.items) {
      if (component instanceof Surface) {
        output.push(
          new OutputItem(
            component.id,
            AcousticRatingCalculator.getMaxAirborneAcousticRating(component),
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
    for (const component of this.items) {
      if (component instanceof Surface && component.hasOwnProperty('celestialDirection')) {
        for (const key in this.externalAcousticRatings) {
          if (key === lowerCase(component.celestialDirection)) {
            component.externalAcousticRating = this.externalAcousticRatings[key]
          }
        }
      }
    }
  }

  private determineNoiseSensitivityAndExposure() {
    for (const component of this.items) {
      if (component instanceof Space || component instanceof NeighbourBuilding) {
        component.noiseSensitivity = this.noiseSensitivityUtil.getNoiseSensitivity(component.occupancyType)
        component.airborneNoiseExposure = this.noiseExposureUtil.getAirborneNoiseExposure(component.occupancyType)
        component.footstepNoiseExposure = this.noiseExposureUtil.getFootstepNoiseExposure(component.occupancyType)
      }
    }
  }

  private determineAcousticRatingToExternalSources() {
    function itemFilter(component: Component): component is Surface {
      return (
        (component instanceof Wall ||
          component instanceof Slab ||
          component instanceof FlatRoof ||
          component instanceof Roof) &&
        component.isExternal == true
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
    function itemFilter(component: Component): component is Surface {
      return (
        component instanceof Wall ||
        component instanceof Slab ||
        component instanceof FlatRoof ||
        component instanceof Roof
      )
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
    function itemFilter(component: Component): component is Space {
      return (
        component instanceof Space &&
        component.occupancyType !== 'Balkon' &&
        component.occupancyType !== 'Attika' &&
        component.occupancyType !== 'Terrasse'
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
    function itemFilter(component: Component): component is Space | NeighbourBuilding {
      return component instanceof Space || component instanceof NeighbourBuilding
    }
    const filteredItems: (Space | NeighbourBuilding)[] = this.items.filter(itemFilter)

    const rooms: (Space | NeighbourBuilding)[] = []
    for (const parentId of parentIds) {
      for (const component of filteredItems) {
        if (component.id === parentId) {
          rooms.push(component)
        }
      }
    }
    return rooms
  }

  private getAcousticRatingLevelFromParentZone(parentIds: string[]): AcousticRatingLevel {
    for (const parentId of parentIds) {
      for (const component of this.items) {
        if (component.id === parentId) {
          if (component instanceof Zone) {
            return component.acousticRatingLevel
          }
          if (component.parentIds && component.parentIds.length) {
            return this.getAcousticRatingLevelFromParentZone(component.parentIds)
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
  Component,
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
