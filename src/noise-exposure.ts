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
}

export {
  NOISE_EXPOSURE_LOW,
  NOISE_EXPOSURE_MODERATE,
  NOISE_EXPOSURE_HIGH,
  NOISE_EXPOSURE_VERY_HIGH,
  NoiseExposure,
  NoiseExposureUtil,
}
