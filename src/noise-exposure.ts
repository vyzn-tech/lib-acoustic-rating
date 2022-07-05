const NOISE_EXPOSURE_LOW = 1
const NOISE_EXPOSURE_MODERATE = 2
const NOISE_EXPOSURE_HIGH = 3
const NOISE_EXPOSURE_VERY_HIGH = 4

const NOISE_EXPOSURE_LEVELS = <const>[
  NOISE_EXPOSURE_LOW,
  NOISE_EXPOSURE_MODERATE,
  NOISE_EXPOSURE_HIGH,
  NOISE_EXPOSURE_VERY_HIGH,
]
type NoiseExposure = typeof NOISE_EXPOSURE_LEVELS[number]
interface NoiseExposureMap {
  [name: string]: NoiseExposure
}

const SPECTRUM_ADJUSTMENT_TYPE_C = 'c'
const SPECTRUM_ADJUSTMENT_TYPE_CTR = 'ctr'

const SPECTRUM_ADJUSTMENT_TYPES = <const>[SPECTRUM_ADJUSTMENT_TYPE_C, SPECTRUM_ADJUSTMENT_TYPE_CTR]

type SpectrumAdjustmentType = typeof SPECTRUM_ADJUSTMENT_TYPES[number]
interface SpectrumAdjustmentTypeMap {
  [name: string]: SpectrumAdjustmentType
}

const NOISE_EXPOSURE_MAP_SIA181_2020_AIRBORNE: NoiseExposureMap = {
  Kellerraum: NOISE_EXPOSURE_LOW,
  Leseraum: NOISE_EXPOSURE_LOW,
  Warteraum: NOISE_EXPOSURE_LOW,
  Lagerraum: NOISE_EXPOSURE_LOW,
  Abstellraum: NOISE_EXPOSURE_LOW,
  Archiv: NOISE_EXPOSURE_LOW,
  Veloraum: NOISE_EXPOSURE_LOW,

  // @todo sync with VYZN-184 Berechnungen
  // Balkon: NOISE_EXPOSURE_MODERATE,
  Wohnraum: NOISE_EXPOSURE_MODERATE,
  Schlafraum: NOISE_EXPOSURE_MODERATE,
  Küche: NOISE_EXPOSURE_MODERATE,
  Dusche: NOISE_EXPOSURE_MODERATE,
  Bad: NOISE_EXPOSURE_MODERATE,
  WC: NOISE_EXPOSURE_MODERATE,
  Korridor: NOISE_EXPOSURE_MODERATE,
  Einstellhalle: NOISE_EXPOSURE_MODERATE,
  Treppe: NOISE_EXPOSURE_MODERATE,
  Laubengang: NOISE_EXPOSURE_MODERATE,
  Passage: NOISE_EXPOSURE_MODERATE,
  Terrasse: NOISE_EXPOSURE_MODERATE,
  Aufzugsmaschinenraum: NOISE_EXPOSURE_MODERATE,
  Aufzugsschacht: NOISE_EXPOSURE_MODERATE,
  Treppenhaus: NOISE_EXPOSURE_MODERATE,
  Büroraum: NOISE_EXPOSURE_MODERATE,
  Sitzungszimmer: NOISE_EXPOSURE_MODERATE,
  Labor: NOISE_EXPOSURE_MODERATE,
  'Verkaufsraum ohne Beschallung': NOISE_EXPOSURE_MODERATE,
  Wintergarten: NOISE_EXPOSURE_MODERATE,

  Saal: NOISE_EXPOSURE_HIGH,
  Schulzimmer: NOISE_EXPOSURE_HIGH,
  Kinderkrippe: NOISE_EXPOSURE_HIGH,
  Kindergarten: NOISE_EXPOSURE_HIGH,
  Technikraum: NOISE_EXPOSURE_HIGH,
  'Restaurant ohne Beschallung': NOISE_EXPOSURE_HIGH,
  'Verkaufsraum mit Beschallung und dazugehörende Erschliessungsräume': NOISE_EXPOSURE_HIGH,
  'Einstellhalle mit gewerblicher Nutzung': NOISE_EXPOSURE_HIGH,

  Gewerbebetrieb: NOISE_EXPOSURE_VERY_HIGH,
  'Restaurant mit Beschallung und dazugehörende Erschliessungsräume': NOISE_EXPOSURE_VERY_HIGH,
  Werkstatt: NOISE_EXPOSURE_VERY_HIGH,
  Musikübungsraum: NOISE_EXPOSURE_VERY_HIGH,
  Sporthalle: NOISE_EXPOSURE_VERY_HIGH,
}

const SPECTRUM_ADJUSTMENT_TYPE_MAP_SIA181_2020: SpectrumAdjustmentTypeMap = {
  Kellerraum: SPECTRUM_ADJUSTMENT_TYPE_C,
  Leseraum: SPECTRUM_ADJUSTMENT_TYPE_C,
  Warteraum: SPECTRUM_ADJUSTMENT_TYPE_C,
  Lagerraum: SPECTRUM_ADJUSTMENT_TYPE_C,
  Abstellraum: SPECTRUM_ADJUSTMENT_TYPE_C,
  Archiv: SPECTRUM_ADJUSTMENT_TYPE_C,
  Veloraum: SPECTRUM_ADJUSTMENT_TYPE_C,
  Balkon: SPECTRUM_ADJUSTMENT_TYPE_C,
  Wohnraum: SPECTRUM_ADJUSTMENT_TYPE_C,
  Schlafraum: SPECTRUM_ADJUSTMENT_TYPE_C,
  Küche: SPECTRUM_ADJUSTMENT_TYPE_C,
  Dusche: SPECTRUM_ADJUSTMENT_TYPE_C,
  Bad: SPECTRUM_ADJUSTMENT_TYPE_C,
  WC: SPECTRUM_ADJUSTMENT_TYPE_C,
  Korridor: SPECTRUM_ADJUSTMENT_TYPE_C,
  Einstellhalle: SPECTRUM_ADJUSTMENT_TYPE_CTR,
  Treppe: SPECTRUM_ADJUSTMENT_TYPE_C,
  Laubengang: SPECTRUM_ADJUSTMENT_TYPE_C,
  Passage: SPECTRUM_ADJUSTMENT_TYPE_C,
  Terrasse: SPECTRUM_ADJUSTMENT_TYPE_C,
  Aufzugsmaschinenraum: SPECTRUM_ADJUSTMENT_TYPE_CTR,
  Aufzugsschacht: SPECTRUM_ADJUSTMENT_TYPE_C,
  Treppenhaus: SPECTRUM_ADJUSTMENT_TYPE_C,
  Büroraum: SPECTRUM_ADJUSTMENT_TYPE_C,
  Sitzungszimmer: SPECTRUM_ADJUSTMENT_TYPE_C,
  Labor: SPECTRUM_ADJUSTMENT_TYPE_C,
  'Verkaufsraum ohne Beschallung': SPECTRUM_ADJUSTMENT_TYPE_C,
  Wintergarten: SPECTRUM_ADJUSTMENT_TYPE_C,
  Saal: SPECTRUM_ADJUSTMENT_TYPE_C,
  Schulzimmer: SPECTRUM_ADJUSTMENT_TYPE_C,
  Kinderkrippe: SPECTRUM_ADJUSTMENT_TYPE_C,
  Kindergarten: SPECTRUM_ADJUSTMENT_TYPE_C,
  Technikraum: SPECTRUM_ADJUSTMENT_TYPE_C,
  'Restaurant ohne Beschallung': SPECTRUM_ADJUSTMENT_TYPE_C,
  'Verkaufsraum mit Beschallung und dazugehörende Erschliessungsräume': SPECTRUM_ADJUSTMENT_TYPE_CTR,
  'Einstellhalle mit gewerblicher Nutzung': SPECTRUM_ADJUSTMENT_TYPE_CTR,
  Gewerbebetrieb: SPECTRUM_ADJUSTMENT_TYPE_CTR,
  'Restaurant mit Beschallung und dazugehörende Erschliessungsräume': SPECTRUM_ADJUSTMENT_TYPE_CTR,
  Werkstatt: SPECTRUM_ADJUSTMENT_TYPE_CTR,
  Musikübungsraum: SPECTRUM_ADJUSTMENT_TYPE_CTR,
  Sporthalle: SPECTRUM_ADJUSTMENT_TYPE_C,
}

const SPECTRUM_ADJUSTMENT_TYPE_MAP_SEESTRASSE: SpectrumAdjustmentTypeMap = {
  Keller: SPECTRUM_ADJUSTMENT_TYPE_C,
  Wohnen: SPECTRUM_ADJUSTMENT_TYPE_C,
  Schlafen: SPECTRUM_ADJUSTMENT_TYPE_C,
  Bad: SPECTRUM_ADJUSTMENT_TYPE_C,
  Tiefgarage: SPECTRUM_ADJUSTMENT_TYPE_CTR,
  Einfahrt: SPECTRUM_ADJUSTMENT_TYPE_CTR,
  Terrasse: SPECTRUM_ADJUSTMENT_TYPE_C,
  Treppenhaus: SPECTRUM_ADJUSTMENT_TYPE_C,
  Waschraum: SPECTRUM_ADJUSTMENT_TYPE_CTR,
  Technik: SPECTRUM_ADJUSTMENT_TYPE_C,
  Gewerbe: SPECTRUM_ADJUSTMENT_TYPE_CTR,
}

const NOISE_EXPOSURE_MAP_SIA181_2006_AIRBORNE: NoiseExposureMap = {
  Konferenzraum: NOISE_EXPOSURE_MODERATE,
  Versammlungsraum: NOISE_EXPOSURE_HIGH,
}

const NOISE_EXPOSURE_MAP_SIA181_2020_FOOTSTEP: NoiseExposureMap = {
  Kellerraum: NOISE_EXPOSURE_LOW,
  Leseraum: NOISE_EXPOSURE_LOW,
  Warteraum: NOISE_EXPOSURE_LOW,
  Archiv: NOISE_EXPOSURE_LOW,
  Balkon: NOISE_EXPOSURE_LOW,

  Wohnraum: NOISE_EXPOSURE_MODERATE,
  Schlafraum: NOISE_EXPOSURE_MODERATE,
  Küche: NOISE_EXPOSURE_MODERATE,
  Dusche: NOISE_EXPOSURE_MODERATE,
  Bad: NOISE_EXPOSURE_MODERATE,
  WC: NOISE_EXPOSURE_MODERATE,
  Korridor: NOISE_EXPOSURE_MODERATE,
  Einstellhalle: NOISE_EXPOSURE_MODERATE,
  Treppe: NOISE_EXPOSURE_MODERATE,
  Laubengang: NOISE_EXPOSURE_MODERATE,
  Passage: NOISE_EXPOSURE_MODERATE,
  Terrasse: NOISE_EXPOSURE_MODERATE,
  Büroraum: NOISE_EXPOSURE_MODERATE,

  'Verkaufsraum ohne Beschallung': NOISE_EXPOSURE_HIGH,
  Saal: NOISE_EXPOSURE_VERY_HIGH,
  Schulzimmer: NOISE_EXPOSURE_HIGH,
  Kinderkrippe: NOISE_EXPOSURE_HIGH,
  Kindergarten: NOISE_EXPOSURE_HIGH,
  'Restaurant ohne Beschallung': NOISE_EXPOSURE_HIGH,
  'Restaurant mit Beschallung und dazugehörende Erschliessungsräume': NOISE_EXPOSURE_HIGH,
  Werkstatt: NOISE_EXPOSURE_HIGH,
  Musikübungsraum: NOISE_EXPOSURE_HIGH,
  Sporthalle: NOISE_EXPOSURE_HIGH,
}

const NOISE_EXPOSURE_MAP_SIA181_2006_FOOTSTEP: NoiseExposureMap = {
  Versammlungsraum: NOISE_EXPOSURE_HIGH,
}

const NOISE_EXPOSURE_MAP_SEESTRASSE_AIRBORNE: NoiseExposureMap = {
  Keller: NOISE_EXPOSURE_LOW,

  Wohnen: NOISE_EXPOSURE_MODERATE,
  Schlafen: NOISE_EXPOSURE_MODERATE,
  Bad: NOISE_EXPOSURE_MODERATE,
  Tiefgarage: NOISE_EXPOSURE_MODERATE,
  Einfahrt: NOISE_EXPOSURE_MODERATE,
  Terrasse: NOISE_EXPOSURE_MODERATE,
  Treppenhaus: NOISE_EXPOSURE_MODERATE,

  Waschraum: NOISE_EXPOSURE_HIGH,
  Technik: NOISE_EXPOSURE_HIGH,

  Gewerbe: NOISE_EXPOSURE_VERY_HIGH,
}

const NOISE_EXPOSURE_MAP_SEESTRASSE_FOOTSTEP: NoiseExposureMap = {
  Keller: NOISE_EXPOSURE_LOW,

  Wohnen: NOISE_EXPOSURE_MODERATE,
  Schlafen: NOISE_EXPOSURE_MODERATE,
  Bad: NOISE_EXPOSURE_MODERATE,
  Tiefgarage: NOISE_EXPOSURE_MODERATE,
  Einfahrt: NOISE_EXPOSURE_MODERATE,
  Treppenhaus: NOISE_EXPOSURE_MODERATE,
  Terrasse: NOISE_EXPOSURE_MODERATE,

  Waschraum: NOISE_EXPOSURE_VERY_HIGH,
  Technik: NOISE_EXPOSURE_LOW,
  Gewerbe: NOISE_EXPOSURE_HIGH,
}

class NoiseExposureUtil {
  getAirborneNoiseExposure(occupancy: string): NoiseExposure {
    const map = {
      ...NOISE_EXPOSURE_MAP_SIA181_2006_AIRBORNE,
      ...NOISE_EXPOSURE_MAP_SIA181_2020_AIRBORNE,
      ...NOISE_EXPOSURE_MAP_SEESTRASSE_AIRBORNE,
    }

    for (const [key, value] of Object.entries(map)) {
      if (key === occupancy) {
        return value
      }
    }
  }

  getFootstepNoiseExposure(occupancy: string): NoiseExposure {
    const map = {
      ...NOISE_EXPOSURE_MAP_SIA181_2006_FOOTSTEP,
      ...NOISE_EXPOSURE_MAP_SIA181_2020_FOOTSTEP,
      ...NOISE_EXPOSURE_MAP_SEESTRASSE_FOOTSTEP,
    }

    for (const [key, value] of Object.entries(map)) {
      if (key === occupancy) {
        return value
      }
    }
  }

  getSpectrumAdjustmentType(occupancy: string): SpectrumAdjustmentType {
    const map = {
      ...SPECTRUM_ADJUSTMENT_TYPE_MAP_SIA181_2020,
      ...SPECTRUM_ADJUSTMENT_TYPE_MAP_SEESTRASSE,
    }

    for (const [key, value] of Object.entries(map)) {
      if (key === occupancy) {
        return value
      }
    }
  }
}

export {
  NOISE_EXPOSURE_LOW,
  NOISE_EXPOSURE_MODERATE,
  NOISE_EXPOSURE_HIGH,
  NOISE_EXPOSURE_VERY_HIGH,
  SPECTRUM_ADJUSTMENT_TYPE_C,
  SPECTRUM_ADJUSTMENT_TYPE_CTR,
  NoiseExposure,
  NoiseExposureUtil,
  SpectrumAdjustmentType,
}
