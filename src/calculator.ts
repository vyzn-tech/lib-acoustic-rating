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

abstract class IFCItem {
  id: string
  parentIds: string[]
}
class IFCBuilding extends IFCItem {
  name: Name
  status: Status
}

class IFCSurface extends IFCItem {
  isExternal: boolean
  celestialDirection: CelestialDirection
  externalAcousticRatingDay: number
  externalAcousticRatingNight: number
  airborneAcousticRatingExternal: number
  airborneAcousticRatingInternal: number
  decibelSender: number
  decibelReceiver: number
}

class IFCWall extends IFCSurface {}

class IFCSlab extends IFCSurface {
  predefinedType: PredefinedType
}

class IFCDoor extends IFCSurface {}

class IFCRoof extends IFCSurface {}

class IFCFlatRoof extends IFCSurface {}

class IFCSpace extends IFCItem {
  occupancyType: OccupancyType
  noiseSensitivity: number
  airborneNoiseExposure: number
  footstepNoiseExposure: number
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
  ifcItems: IFCItem[]
  externalAcousticRatings: ExternalAcousticRatingCollection
  noiseSensitivityUtil = new NoiseSensitivityUtil()
  noiseExposureUtil = new NoiseExposureUtil()
  airborneAcousticRatingUtil = new AirborneAcousticRatingUtil()

  constructor(
    ifcItems: IFCItem[],
    externalAcousticRatings: ExternalAcousticRatingCollection,
  ) {
    this.ifcItems = ifcItems
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
    for (const ifcItem of this.ifcItems) {
      if (
        ifcItem instanceof IFCSurface &&
        ifcItem.hasOwnProperty('celestialDirection')
      ) {
        for (const key in this.externalAcousticRatings) {
          if (key === lowerCase(ifcItem.celestialDirection)) {
            ifcItem.externalAcousticRatingDay =
              this.externalAcousticRatings[key].day
            ifcItem.externalAcousticRatingNight =
              this.externalAcousticRatings[key].night
          }
        }
      }
    }
  }

  determineNoiseSensitivityAndExposure() {
    for (const ifcItem of this.ifcItems) {
      if (ifcItem instanceof IFCSpace) {
        ifcItem.noiseSensitivity =
          this.noiseSensitivityUtil.getNoiseSensitivity(ifcItem.occupancyType)
        ifcItem.airborneNoiseExposure =
          this.noiseExposureUtil.getAirborneNoiseExposure(ifcItem.occupancyType)
        ifcItem.footstepNoiseExposure =
          this.noiseExposureUtil.getFootstepNoiseExposure(ifcItem.occupancyType)
      }
    }
  }

  determineAcousticRatingToExternalSources() {
    for (const ifcItem of this.ifcItems) {
      if (
        ifcItem instanceof IFCWall ||
        ifcItem instanceof IFCSlab ||
        ifcItem instanceof IFCFlatRoof ||
        ifcItem instanceof IFCRoof
      ) {
        const possibleParentRooms = this.filterForIFCSpace(this.ifcItems)
        const parentRoom = this.getFirstParentRoom(
          ifcItem.parentIds,
          possibleParentRooms,
        )
        const acousticRatingLevel = this.getAcousticRatingLevel(
          ifcItem.parentIds,
        )
        // console.log("===================")
        // console.log(ifcItem)
        // console.log(parentRoom)
        if (parentRoom.noiseSensitivity === NOISE_SENSITIVITY_NONE) {
          ifcItem.decibelReceiver = 0
          continue
        }

        let lrDay = this.airborneAcousticRatingUtil.getOutdoorAcousticRatingDay(
          parentRoom.noiseSensitivity,
          ifcItem.externalAcousticRatingDay,
        )
        let lrNight =
          this.airborneAcousticRatingUtil.getOutdoorAcousticRatingNight(
            parentRoom.noiseSensitivity,
            ifcItem.externalAcousticRatingNight,
          )

        // console.log('id: ' + ifcItem.id)
        // console.log('day: ' + lrDay)
        // console.log('night: ' + lrNight)
        if (acousticRatingLevel === ACOUSTIC_RATING_LEVEL_ENHANCED) {
          lrDay += 3
          lrNight += 3
          // console.log('extra: true')
        }
      }
    }
  }

  determineAcousticRatingToInternalSources() {
    for (const ifcItem of this.ifcItems) {
      if (
        ifcItem instanceof IFCWall ||
        ifcItem instanceof IFCSlab ||
        ifcItem instanceof IFCFlatRoof ||
        ifcItem instanceof IFCRoof
      ) {
        if (ifcItem.parentIds.length <= 1) {
          ifcItem.decibelSender = 0
          continue
        }
        const possibleParentRooms = this.filterForIFCSpaceAndIFCBuilding(
          this.ifcItems,
        )
        const rooms = this.getParentRooms(
          ifcItem.parentIds,
          possibleParentRooms,
        )
        console.log(rooms)
      }
    }
  }

  filterForIFCZone(items: IFCItem[]): IFCZone[] {
    const filteredItems: IFCZone[] = []
    for (const item of items) {
      if (item instanceof IFCZone) {
        filteredItems.push(item)
      }
    }
    return filteredItems
  }

  filterForIFCSpace(items: IFCItem[]): IFCSpace[] {
    const filteredItems: IFCSpace[] = []
    for (const item of items) {
      if (
        item instanceof IFCSpace &&
        item.occupancyType !== 'Balkon' &&
        item.occupancyType !== 'Attika'
      ) {
        filteredItems.push(item)
      }
    }
    return filteredItems
  }

  filterForIFCSpaceAndIFCBuilding(
    items: IFCItem[],
  ): (IFCSpace | IFCBuilding)[] {
    const filteredItems: (IFCSpace | IFCBuilding)[] = []
    for (const item of items) {
      if (item instanceof IFCSpace || item instanceof IFCBuilding) {
        filteredItems.push(item)
      }
    }
    return filteredItems
  }

  getFirstParentRoom(parentIds: string[], items: IFCSpace[]): IFCSpace {
    for (const parentId of parentIds) {
      for (const ifcItem of items) {
        if (ifcItem.id === parentId) {
          return ifcItem
        }
        if (ifcItem.parentIds && ifcItem.parentIds.length > 0) {
          return this.getFirstParentRoom(ifcItem.parentIds, items)
        }
      }
    }
  }

  getParentRooms(
    parentIds: string[],
    items: (IFCSpace | IFCBuilding)[],
  ): (IFCSpace | IFCBuilding)[] {
    let rooms: (IFCSpace | IFCBuilding)[] = []
    for (const parentId of parentIds) {
      for (const ifcItem of items) {
        if (ifcItem.id === parentId) {
          rooms.push(ifcItem)
        }
        if (ifcItem.parentIds && ifcItem.parentIds.length > 0) {
          rooms = rooms.concat(this.getParentRooms(ifcItem.parentIds, items))
        }
      }
    }
    return rooms
  }

  getAcousticRatingLevel(parentIds: string[]): AcousticRatingLevelReq {
    const filteredItems: IFCZone[] = this.filterForIFCZone(this.ifcItems)
    for (const parentId of parentIds) {
      for (const ifcItem of filteredItems) {
        if (ifcItem.id === parentId) {
          return ifcItem.acousticRatingLevelReq
        }
        if (ifcItem.parentIds && ifcItem.parentIds.length) {
          return this.getAcousticRatingLevel(ifcItem.parentIds)
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
  IFCSurface,
  IFCItem,
  ExternalAcousticRatingCollection,
  ExternalAcousticRating,
  IFCBuilding,
  IFCDoor,
  IFCRoof,
  IFCFlatRoof,
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
