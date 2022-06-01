const NOISE_SENSITIVITY_NONE = null;
const NOISE_SENSITIVITY_LOW = 1;
const NOISE_SENSITIVITY_MODERATE = 2;
const NOISE_SENSITIVITY_HIGH = 3;

const NOISE_SENSITIVITY_MAP_SIA181_2020 = {
  Abstellraum: NOISE_SENSITIVITY_NONE,
  Lagerraum: NOISE_SENSITIVITY_NONE,
  Keller: NOISE_SENSITIVITY_NONE,
  Heizungsraum: NOISE_SENSITIVITY_NONE,
  Lüftungsraum: NOISE_SENSITIVITY_NONE,
  Haustechnikraum: NOISE_SENSITIVITY_NONE,
  Hobbyraum: NOISE_SENSITIVITY_NONE,
  Einstellhalle: NOISE_SENSITIVITY_NONE,
  Treppenhaus: NOISE_SENSITIVITY_NONE,
  Laubengang: NOISE_SENSITIVITY_NONE,

  Werkstatt: NOISE_SENSITIVITY_LOW,
  Handarbeitsraum: NOISE_SENSITIVITY_LOW,
  Kantine: NOISE_SENSITIVITY_LOW,
  Restaurant: NOISE_SENSITIVITY_LOW,
  "Küche ohne Wohnanteil": NOISE_SENSITIVITY_LOW,
  Bad: NOISE_SENSITIVITY_LOW,
  Dusche: NOISE_SENSITIVITY_LOW,
  WC: NOISE_SENSITIVITY_LOW,
  Verkaufsraum: NOISE_SENSITIVITY_LOW,
  "wohungsinterner Korridor": NOISE_SENSITIVITY_LOW,
  Warteraum: NOISE_SENSITIVITY_LOW,

  Wohnzimmer: NOISE_SENSITIVITY_MODERATE,
  Schlafzimmer: NOISE_SENSITIVITY_MODERATE,
  Studio: NOISE_SENSITIVITY_MODERATE,
  Schulzimmer: NOISE_SENSITIVITY_MODERATE,
  Musikübungsraum: NOISE_SENSITIVITY_MODERATE,
  Wohnküche: NOISE_SENSITIVITY_MODERATE,
  Büroraum: NOISE_SENSITIVITY_MODERATE,
  Empfangsraum: NOISE_SENSITIVITY_MODERATE,
  Hotelzimmer: NOISE_SENSITIVITY_MODERATE,
  "Therapieräume mit hohem Ruhebedarf": NOISE_SENSITIVITY_HIGH,
  Lesezimmer: NOISE_SENSITIVITY_HIGH,
  Studierzimmer: NOISE_SENSITIVITY_HIGH,
};

const NOISE_SENSITIVITY_MAP_SIA181_2006 = {
  Kantine: NOISE_SENSITIVITY_LOW,
  Verkauf: NOISE_SENSITIVITY_LOW,
  Spitalzimmer: NOISE_SENSITIVITY_HIGH,
};

function getNoiseSensitivity(occupancy: string, custom_mapping: {} = {}) {
  const map = {
    ...NOISE_SENSITIVITY_MAP_SIA181_2006,
    ...NOISE_SENSITIVITY_MAP_SIA181_2020,
    ...custom_mapping,
  };

  for (const [key, value] of Object.entries(map)) {
    if (key === occupancy) {
      return value;
    }
  }
}
