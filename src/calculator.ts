import { lowerCase } from 'lodash'
import { NOISE_SENSITIVITY_NONE, NoiseSensitivityMap, NoiseSensitivityUtil } from './noise-sensitivity'
import {
  NoiseExposureMap,
  NoiseExposureUtil,
  SPECTRUM_ADJUSTMENT_TYPE_C,
  SPECTRUM_ADJUSTMENT_TYPE_CTR,
  SpectrumAdjustmentType,
  SpectrumAdjustmentTypeMap,
} from './noise-exposure'
import { AirborneAcousticRatingUtil } from './airborn-acoustic-rating'
import { FootstepAcousticRatingUtil } from './footstep-acoustic-rating'
import { Component, FlatRoof, NeighbourBuilding, Roof, Slab, Space, Surface, Wall, Zone } from './components'
import { ExternalAcousticRatingCollection } from './external-acoustic-rating'

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

class AcousticRatingCalculator {
  items: Component[]
  externalAcousticRatings: ExternalAcousticRatingCollection
  noiseSensitivityUtil: NoiseSensitivityUtil
  noiseExposureUtil: NoiseExposureUtil
  airborneAcousticRatingUtil: AirborneAcousticRatingUtil
  footstepAcousticRatingUtil: FootstepAcousticRatingUtil

  constructor(
    items: Component[],
    externalAcousticRatings: ExternalAcousticRatingCollection,
    additionalNoiseSensitivityMap?: NoiseSensitivityMap,
    additionalAirborneNoiseExposureMap?: NoiseExposureMap,
    additionalFootstepNoiseExposureMap?: NoiseExposureMap,
    additionalSpectrumAdjustmentTypeMap?: SpectrumAdjustmentTypeMap,
  ) {
    this.items = items
    this.externalAcousticRatings = externalAcousticRatings
    this.noiseSensitivityUtil = new NoiseSensitivityUtil(additionalNoiseSensitivityMap)
    this.noiseExposureUtil = new NoiseExposureUtil(
      additionalAirborneNoiseExposureMap,
      additionalFootstepNoiseExposureMap,
      additionalSpectrumAdjustmentTypeMap,
    )
    this.airborneAcousticRatingUtil = new AirborneAcousticRatingUtil(this.noiseExposureUtil)
    this.footstepAcousticRatingUtil = new FootstepAcousticRatingUtil(this.noiseExposureUtil)
  }

  public calculate(): OutputItem[] {
    const output: OutputItem[] = []
    this.setExternalAcousticRating()
    this.setNoiseSensitivityAndExposure()
    this.setAcousticRatingLevels()
    this.setOperationStates()

    this.setAcousticRatingToExternalSources()
    this.setAcousticRatingToInternalSources()
    this.setFootstepRating()

    for (const component of this.items) {
      if (component instanceof Surface) {
        output.push(
          new OutputItem(
            component.id,
            AcousticRatingCalculator.getMaxAirborneAcousticRatingRequirement(component, SPECTRUM_ADJUSTMENT_TYPE_C),
            AcousticRatingCalculator.getMaxAirborneAcousticRatingRequirement(component, SPECTRUM_ADJUSTMENT_TYPE_CTR),
            AcousticRatingCalculator.getMaxFootstepAcousticRatingRequirement(component, SPECTRUM_ADJUSTMENT_TYPE_C),
            AcousticRatingCalculator.getMaxFootstepAcousticRatingRequirement(component, SPECTRUM_ADJUSTMENT_TYPE_CTR),
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

  private setNoiseSensitivityAndExposure() {
    for (const component of this.items) {
      if (component instanceof Space || component instanceof NeighbourBuilding) {
        component.noiseSensitivity = this.noiseSensitivityUtil.getNoiseSensitivity(component.occupancyType)
        component.airborneNoiseExposure = this.noiseExposureUtil.getAirborneNoiseExposure(component.occupancyType)
      }
      if (component instanceof Space) {
        component.footstepNoiseExposure = this.noiseExposureUtil.getFootstepNoiseExposure(component.occupancyType)
      }
    }
  }

  private setAcousticRatingLevels() {
    for (const component of this.items) {
      if (component instanceof Space) {
        if (component.parentIds.length != 1) {
          throw RangeError('Space with more or less than one parentId is invalid!')
        }
        const zone = this.getParentComponent(component.parentIds[0])
        if (zone instanceof Zone) {
          component.acousticRatingLevel = zone.acousticRatingLevel
        } else {
          throw Error('Building with parent other than Zone is invalid!')
        }
      }
    }
  }

  private setOperationStates() {
    for (const component of this.items) {
      if (component instanceof Space) {
        if (component.parentIds.length != 1) {
          throw RangeError('Space with more or less than one parentId is invalid!')
        }
        const zone = this.getParentComponent(component.parentIds[0])
        if (zone instanceof Zone) {
          component.operatingState = zone.operatingState
        } else {
          throw Error('Building with parent other than Zone is invalid!')
        }
      }
    }
  }

  private getParentComponent(id: string): Component {
    for (const component of this.items) {
      if (component.id == id) {
        return component
      }
    }
  }

  private setAcousticRatingToExternalSources() {
    function filter(component: Component): component is Surface {
      return (
        (component instanceof Wall ||
          component instanceof Slab ||
          component instanceof FlatRoof ||
          component instanceof Roof) &&
        component.isExternal == true
      )
    }
    const filteredSurfaces: Surface[] = this.items.filter(filter)

    for (const surface of filteredSurfaces) {
      const parentSpace = this.getInternalConnectedSpace(surface.parentIds)
      if (!parentSpace || parentSpace.noiseSensitivity === NOISE_SENSITIVITY_NONE) {
        continue
      }

      surface.airborneAcousticRatingToExternal =
        this.airborneAcousticRatingUtil.getAirborneAcousticRatingTowardsExternalSources(
          parentSpace,
          surface.externalAcousticRating,
        )
    }
  }

  private setAcousticRatingToInternalSources() {
    function filter(component: Component): component is Surface {
      return (
        component instanceof Wall ||
        component instanceof Slab ||
        component instanceof FlatRoof ||
        component instanceof Roof
      )
    }
    const filteredSurfaces: Surface[] = this.items.filter(filter)

    for (const surface of filteredSurfaces) {
      if (surface.parentIds.length <= 1) {
        continue
      }
      const connectedSpaces: (Space | NeighbourBuilding)[] = this.getConnectedSpacesAndNeighbourBuildings(
        surface.parentIds,
      )

      surface.airborneAcousticRatingToInternal =
        this.airborneAcousticRatingUtil.getAirborneAcousticRatingTowardsInternalSources(connectedSpaces)
    }
  }

  private setFootstepRating() {
    function filter(component: Component): component is Slab | FlatRoof {
      return component instanceof Slab || component instanceof FlatRoof
    }
    const filteredSlabs: (Slab | FlatRoof)[] = this.items.filter(filter)
    for (const filteredSlab of filteredSlabs) {
      if (filteredSlab.parentIds && filteredSlab.parentIds.length == 2) {
        const connectedSpaces = this.getConnectedSpaces(filteredSlab.parentIds)
        filteredSlab.footstepAcousticRating = this.footstepAcousticRatingUtil.getFootstepAcousticRating(connectedSpaces)
      }
    }
  }

  private static getMaxAirborneAcousticRatingRequirement(
    surface: Surface,
    spectrumAdjustmentType: SpectrumAdjustmentType,
  ) {
    const values = []
    if (surface.airborneAcousticRatingToInternal) {
      for (const requirement of Object.values(surface.airborneAcousticRatingToInternal)) {
        if (requirement.spectrumAdjustmentType === spectrumAdjustmentType) {
          values.push(requirement.getValue())
        }
      }
    }

    if (surface.airborneAcousticRatingToExternal) {
      for (const requirement of Object.values(surface.airborneAcousticRatingToExternal)) {
        if (requirement.spectrumAdjustmentType === spectrumAdjustmentType) {
          values.push(requirement.getValue())
        }
      }
    }

    const maximum = Math.max(...values)
    return maximum > 0 ? maximum : null
  }

  private static getMaxFootstepAcousticRatingRequirement(
    surface: Surface,
    spectrumAdjustmentType: SpectrumAdjustmentType,
  ) {
    let value = 0
    if (
      surface.footstepAcousticRating &&
      surface.footstepAcousticRating.spectrumAdjustmentType === spectrumAdjustmentType
    ) {
      value = surface.footstepAcousticRating.getValue()
    }

    return value > 0 ? value : null
  }

  private getInternalConnectedSpace(parentIds: string[]): Space {
    function filter(component: Component): component is Space {
      return (
        component instanceof Space &&
        component.occupancyType !== 'Balkon' &&
        component.occupancyType !== 'Attika' &&
        component.occupancyType !== 'Terrasse'
      )
    }
    const filteredSpaces: Space[] = this.items.filter(filter)

    for (const parentId of parentIds) {
      for (const space of filteredSpaces) {
        if (space.id === parentId) {
          return space
        }
      }
    }
  }

  private getConnectedSpacesAndNeighbourBuildings(parentIds: string[]): (Space | NeighbourBuilding)[] {
    function filter(component: Component): component is Space | NeighbourBuilding {
      return component instanceof Space || component instanceof NeighbourBuilding
    }
    const filteredItems: (Space | NeighbourBuilding)[] = this.items.filter(filter)

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

  private getConnectedSpaces(parentIds: string[]): Space[] {
    function filter(component: Component): component is Space {
      return component instanceof Space
    }
    const filteredItems: Space[] = this.items.filter(filter)

    const rooms: Space[] = []
    for (const parentId of parentIds) {
      for (const component of filteredItems) {
        if (component.id === parentId) {
          rooms.push(component)
        }
      }
    }
    return rooms
  }
}

export { AcousticRatingCalculator, OutputItem }
