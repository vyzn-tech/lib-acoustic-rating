const NOISE_EXPOSURE_LOW = 1;
const NOISE_EXPOSURE_MODERATE = 2;
const NOISE_EXPOSURE_HIGH = 3;
const NOISE_EXPOSURE_VERY_HIGH = 4;

const NOISE_EXPOSURE_MAP_SIA181_2020_AIRBORNE = {
  Kellerraum: NOISE_EXPOSURE_LOW,
  Leseraum: NOISE_EXPOSURE_LOW,
  Warteraum: NOISE_EXPOSURE_LOW,
  Lagerraum: NOISE_EXPOSURE_LOW,
  Abstellraum: NOISE_EXPOSURE_LOW,
  Archiv: NOISE_EXPOSURE_LOW,
  Veloraum: NOISE_EXPOSURE_LOW,

  Balkon: NOISE_EXPOSURE_MODERATE,
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
  "Verkaufsraum ohne Beschallung": NOISE_EXPOSURE_MODERATE,
  Wintergarten: NOISE_EXPOSURE_MODERATE,

  Saal: NOISE_EXPOSURE_HIGH,
  Schulzimmer: NOISE_EXPOSURE_HIGH,
  Kinderkrippe: NOISE_EXPOSURE_HIGH,
  Kindergarten: NOISE_EXPOSURE_HIGH,
  Technikraum: NOISE_EXPOSURE_HIGH,
  "Restaurant ohne Beschallung": NOISE_EXPOSURE_HIGH,
  "Verkaufsraum mit Beschallung und dazugehörende Erschliessungsräume":
    NOISE_EXPOSURE_HIGH,
  "Einstellhalle mit gewerblicher Nutzung": NOISE_EXPOSURE_HIGH,

  Gewerbebetrieb: NOISE_EXPOSURE_VERY_HIGH,
  "Restaurant mit Beschallung und dazugehörende Erschliessungsräume":
    NOISE_EXPOSURE_VERY_HIGH,
  Werkstatt: NOISE_EXPOSURE_VERY_HIGH,
  Musikübungsraum: NOISE_EXPOSURE_VERY_HIGH,
  Sporthalle: NOISE_EXPOSURE_VERY_HIGH,
};

const NOISE_EXPOSURE_MAP_SIA181_2006_AIRBORNE = {
  Konferenzraum: NOISE_EXPOSURE_MODERATE,
  Versammlungsraum: NOISE_EXPOSURE_HIGH,
};

const NOISE_EXPOSURE_MAP_SIA181_2020_FOOTSTEP = {
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

  "Verkaufsraum ohne Beschallung": NOISE_EXPOSURE_HIGH,
  Saal: NOISE_EXPOSURE_VERY_HIGH,
  Schulzimmer: NOISE_EXPOSURE_HIGH,
  Kinderkrippe: NOISE_EXPOSURE_HIGH,
  Kindergarten: NOISE_EXPOSURE_HIGH,
  "Restaurant ohne Beschallung": NOISE_EXPOSURE_HIGH,
  "Restaurant mit Beschallung und dazugehörende Erschliessungsräume":
    NOISE_EXPOSURE_HIGH,
  Werkstatt: NOISE_EXPOSURE_HIGH,
  Musikübungsraum: NOISE_EXPOSURE_HIGH,
  Sporthalle: NOISE_EXPOSURE_HIGH,
};

const NOISE_EXPOSURE_MAP_SIA181_2006_FOOTSTEP = {
  Versammlungsraum: NOISE_EXPOSURE_HIGH,
};

function getAirborneNoiseExposure(occupancy: string, custom_mapping: {} = {}) {
  const map = {
    ...NOISE_EXPOSURE_MAP_SIA181_2006_AIRBORNE,
    ...NOISE_EXPOSURE_MAP_SIA181_2020_AIRBORNE,
    ...custom_mapping,
  };

  for (const [key, value] of Object.entries(map)) {
    if (key === occupancy) {
      return value;
    }
  }
}

function getFootstepNoiseExposure(occupancy: string, custom_mapping: {} = {}) {
  const map = {
    ...NOISE_EXPOSURE_MAP_SIA181_2006_FOOTSTEP,
    ...NOISE_EXPOSURE_MAP_SIA181_2020_FOOTSTEP,
    ...custom_mapping,
  };

  for (const [key, value] of Object.entries(map)) {
    if (key === occupancy) {
      return value;
    }
  }
}
