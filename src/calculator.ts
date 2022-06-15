import { lowerCase } from 'lodash'
import {
  NOISE_SENSITIVITY_NONE,
  NoiseSensitivityUtil,
} from './noise-sensitivity'
import { NoiseExposureUtil } from './noise-exposure'
import AirborneAcousticRatingUtil from './airborn-acoustic-rating'

type CelestialDirection =
  | null
  | 'N'
  | 'NE'
  | 'E'
  | 'SE'
  | 'S'
  | 'SW'
  | 'W'
  | 'NW'
type Status = 'new' | 'temporary' | 'existing' | 'demolish'
type Name = 'Wand' | 'Decke' | 'Flachdach' | 'Steildach' | 'Bodenplatte'

const ACOUSTIC_RATING_LEVEL_MINIMUM = 'Mindestanforderungen'
const ACOUSTIC_RATING_LEVEL_ENHANCED = 'Erhoehte Anforderungen'
const ACOUSTIC_RATING_LEVELS = <const>[
  ACOUSTIC_RATING_LEVEL_MINIMUM,
  ACOUSTIC_RATING_LEVEL_ENHANCED,
]

type AcousticRatingLevelReq = typeof ACOUSTIC_RATING_LEVELS[number]

const PREDEFINED_TYPE_FLOOR = 'FLOOR'
const PREDEFINED_TYPE_BASESLAB = 'BASESLAB'
const PREDEFINED_TYPE_ROOF = 'ROOF'
const ALL_PREDEFINED_TYPES = <const>[
  PREDEFINED_TYPE_FLOOR,
  PREDEFINED_TYPE_BASESLAB,
  PREDEFINED_TYPE_ROOF,
]
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

abstract class Item {
  id: string
  parentIds: string[]
}
class Building extends Item {
  name: Name
  status: Status
}

class Surface extends Item {
  isExternal: boolean
  celestialDirection: CelestialDirection
  externalAcousticRatingDay: number
  externalAcousticRatingNight: number
  airborneAcousticRatingExternal: number
  airborneAcousticRatingInternal: number
  decibelSender: number
  decibelReceiver: number
  lrDay: number
  lrNight: number
}

class Wall extends Surface {}

class Slab extends Surface {
  predefinedType: PredefinedType
}

class Door extends Surface {}

class Roof extends Surface {}

class FlatRoof extends Surface {}

class Space extends Item {
  occupancyType: OccupancyType
  noiseSensitivity: number
  airborneNoiseExposure: number
  footstepNoiseExposure: number
  centerOfGravityZ: number
}

class Zone extends Building {
  acousticRatingLevelReq: AcousticRatingLevelReq
}

class OutputComponent {
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

  constructor(
    items: Item[],
    externalAcousticRatings: ExternalAcousticRatingCollection,
  ) {
    this.items = items
    this.externalAcousticRatings = externalAcousticRatings
  }

  calculate(): string {
    this.setExternalAcousticRating()
    this.determineNoiseSensitivityAndExposure()
    this.determineAcousticRatingToExternalSources()
    this.determineAcousticRatingToInternalSources()
    return 'tests are working'
  }

  setExternalAcousticRating() {
    for (const item of this.items) {
      if (
        item instanceof Surface &&
        item.hasOwnProperty('celestialDirection')
      ) {
        for (const key in this.externalAcousticRatings) {
          if (key === lowerCase(item.celestialDirection)) {
            item.externalAcousticRatingDay =
              this.externalAcousticRatings[key].day
            item.externalAcousticRatingNight =
              this.externalAcousticRatings[key].night
          }
        }
      }
    }
  }

  determineNoiseSensitivityAndExposure() {
    for (const item of this.items) {
      if (item instanceof Space) {
        item.noiseSensitivity = this.noiseSensitivityUtil.getNoiseSensitivity(
          item.occupancyType,
        )
        item.airborneNoiseExposure =
          this.noiseExposureUtil.getAirborneNoiseExposure(item.occupancyType)
        item.footstepNoiseExposure =
          this.noiseExposureUtil.getFootstepNoiseExposure(item.occupancyType)
      }
    }
  }

  determineAcousticRatingToExternalSources() {
    for (const item of this.items) {
      if (
        (item instanceof Wall ||
          item instanceof Slab ||
          item instanceof FlatRoof ||
          item instanceof Roof) &&
        item.isExternal == true
      ) {
        const possibleParentRooms = this.filterForSpace(this.items)
        const parentRoom = this.getFirstParentRoom(
          item.parentIds,
          possibleParentRooms,
        )
        const acousticRatingLevel = this.getAcousticRatingLevel(item.parentIds)
        if (parentRoom.noiseSensitivity === NOISE_SENSITIVITY_NONE) {
          item.decibelReceiver = 0
          continue
        }

        let lrDay = this.airborneAcousticRatingUtil.getOutdoorAcousticRatingDay(
          parentRoom.noiseSensitivity,
          item.externalAcousticRatingDay,
        )
        let lrNight =
          this.airborneAcousticRatingUtil.getOutdoorAcousticRatingNight(
            parentRoom.noiseSensitivity,
            item.externalAcousticRatingNight,
          )

        if (acousticRatingLevel === ACOUSTIC_RATING_LEVEL_ENHANCED) {
          lrDay += 3
          lrNight += 3
        }

        item.lrDay = lrDay
        item.lrNight = lrNight
      }
    }
  }

  determineAcousticRatingToInternalSources() {
    for (const item of this.items) {
      if (
        item instanceof Wall ||
        item instanceof Slab ||
        item instanceof FlatRoof ||
        item instanceof Roof
      ) {
        if (item.parentIds.length <= 1) {
          item.decibelSender = 0
          continue
        }
        const possibleParentRooms = this.filterForSpaceAndBuilding(this.items)
        const rooms = this.getParentRooms(item.parentIds, possibleParentRooms)
        console.log(rooms)
      }
    }
  }

  filterForZone(items: Item[]): Zone[] {
    const filteredItems: Zone[] = []
    for (const item of items) {
      if (item instanceof Zone) {
        filteredItems.push(item)
      }
    }
    return filteredItems
  }

  filterForSpace(items: Item[]): Space[] {
    const filteredItems: Space[] = []
    for (const item of items) {
      if (
        item instanceof Space &&
        item.occupancyType !== 'Balkon' &&
        item.occupancyType !== 'Attika'
      ) {
        filteredItems.push(item)
      }
    }
    return filteredItems
  }

  filterForSpaceAndBuilding(items: Item[]): (Space | Building)[] {
    const filteredItems: (Space | Building)[] = []
    for (const item of items) {
      if (item instanceof Space || item instanceof Building) {
        filteredItems.push(item)
      }
    }
    return filteredItems
  }

  getFirstParentRoom(parentIds: string[], items: Space[]): Space {
    for (const parentId of parentIds) {
      for (const item of items) {
        if (item.id === parentId) {
          return item
        }
      }
    }
  }

  getParentRooms(
    parentIds: string[],
    items: (Space | Building)[],
  ): (Space | Building)[] {
    const rooms: (Space | Building)[] = []
    for (const parentId of parentIds) {
      for (const item of items) {
        if (item.id === parentId) {
          rooms.push(item)
        }
      }
    }
    return rooms
  }

  getAcousticRatingLevel(parentIds: string[]): AcousticRatingLevelReq {
    for (const parentId of parentIds) {
      for (const item of this.items) {
        if (item.id === parentId) {
          if (item instanceof Zone) {
            return item.acousticRatingLevelReq
          }
          if (item.parentIds && item.parentIds.length) {
            return this.getAcousticRatingLevel(item.parentIds)
          }
        }
      }
    }
  }

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
  Surface,
  Item,
  ExternalAcousticRatingCollection,
  ExternalAcousticRating,
  Building,
  Door,
  Roof,
  FlatRoof,
  Slab,
  Space,
  Wall,
  Zone,
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
