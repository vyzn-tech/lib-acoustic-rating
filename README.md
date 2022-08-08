# lib-acoustic-rating

lib-acoustic-rating is a Javascript library which calculates acoustic rating requirements for IFC-data according to SIA 181.

## Installation

Use the package manager [npm](https://docs.npmjs.com/try-the-latest-stable-version-of-npm) to install lib-acoustic-rating.

```bash
npm install @vyzn-tech/lib-acoustic-rating
```

## Usage

```javascript
import JsonSerializer from '@vyzn-tech/lib-acoustic-rating/dist/json-serializer'
import { AcousticRatingCalculator } from '@vyzn-tech/lib-acoustic-rating/dist/calculator'

const items = new JsonSerializer().deserialize(jsonString)

const calculator = new AcousticRatingCalculator(
  items, //                               required => see Expected Input
  externalAcousticRatings //              required => see External-Acoustic-Ratings
  // additionalNoiseSensitivityMap        optional => see Noise-Sensitivity-Map
  // additionalAirborneNoiseExposureMap   optional => see Airborne-Noise-Exposure-Map
  // additionalFootstepNoiseExposureMap   optional => see Footstep-Noise-Exposure-Map
  // additionalSpectrumAdjustmentTypeMap  optional => see Spectrum-Adjustment-Type-Map
)

console.log(calculator.calculate())
```

## Expected Input

#### Example
```json
[
  {
    "type": "Wall",
    "id": "1",
    "parentIds": [
      "47"
    ],
    "isExternal": true,
    "celestialDirection": "NE"
  },
  {
    "type": "Wall",
    "id": "2",
    "parentIds": [
      "51"
    ],
    "isExternal": true,
    "celestialDirection": "NE"
  },
  {
    "type": "Wall",
    "id": "3",
    "parentIds": [
      "47",
      "54"
    ],
    "isExternal": true,
    "celestialDirection": "NE"
  },
  {
    "type": "Wall",
    "id": "4",
    "parentIds": [
      "48",
      "54"
    ],
    "isExternal": true,
    "celestialDirection": "N"
  },
  {
    "type": "Wall",
    "id": "5",
    "parentIds": [
      "47",
      "52"
    ],
    "isExternal": false,
    "celestialDirection": "N"
  },
  {
    "type": "Wall",
    "id": "6",
    "parentIds": [
      "46",
      "47"
    ],
    "isExternal": false,
    "celestialDirection": "N"
  },
  {
    "type": "Wall",
    "id": "7",
    "parentIds": [
      "47",
      "53"
    ],
    "isExternal": false,
    "celestialDirection": "N"
  },
  {
    "type": "Wall",
    "id": "8",
    "parentIds": [
      "47",
      "55"
    ],
    "isExternal": false,
    "celestialDirection": "N"
  },
  {
    "type": "Wall",
    "id": "9",
    "parentIds": [
      "50",
      "55"
    ],
    "isExternal": false,
    "celestialDirection": "N"
  },
  {
    "type": "Wall",
    "id": "10",
    "parentIds": [
      "46",
      "55"
    ],
    "isExternal": false,
    "celestialDirection": "N"
  },
  {
    "type": "Wall",
    "id": "11",
    "parentIds": [
      "51",
      "50"
    ],
    "isExternal": false,
    "celestialDirection": "N"
  },
  {
    "type": "Wall",
    "id": "12",
    "parentIds": [
      "51",
      "49"
    ],
    "isExternal": false,
    "celestialDirection": "N"
  },
  {
    "type": "Wall",
    "id": "13",
    "parentIds": [
      "51",
      "48"
    ],
    "isExternal": false,
    "celestialDirection": "N"
  },
  {
    "type": "Wall",
    "id": "14",
    "parentIds": [
      "53",
      "49"
    ],
    "isExternal": false,
    "celestialDirection": "N"
  },
  {
    "type": "Wall",
    "id": "15",
    "parentIds": [
      "47",
      "73"
    ],
    "isExternal": false,
    "celestialDirection": "N"
  },
  {
    "type": "Wall",
    "id": "16",
    "parentIds": [
      "55",
      "73"
    ],
    "isExternal": false,
    "celestialDirection": "N"
  },
  {
    "type": "Wall",
    "id": "17",
    "parentIds": [
      "53",
      "73"
    ],
    "isExternal": false,
    "celestialDirection": "N"
  },
  {
    "type": "Wall",
    "id": "18",
    "parentIds": [
      "64",
      "51"
    ],
    "isExternal": false,
    "celestialDirection": "N"
  },
  {
    "type": "Wall",
    "id": "19",
    "parentIds": [
      "57",
      "59"
    ],
    "isExternal": true,
    "celestialDirection": "NE"
  },
  {
    "type": "Slab",
    "id": "20",
    "parentIds": [
      "56",
      "62"
    ],
    "isExternal": false,
    "celestialDirection": "",
    "predefinedType": "FLOOR"
  },
  {
    "type": "Slab",
    "id": "21",
    "parentIds": [
      "58",
      "62"
    ],
    "isExternal": false,
    "celestialDirection": "",
    "predefinedType": "FLOOR"
  },
  {
    "type": "Slab",
    "id": "22",
    "parentIds": [
      "59",
      "62"
    ],
    "isExternal": false,
    "celestialDirection": "",
    "predefinedType": "FLOOR"
  },
  {
    "type": "Slab",
    "id": "23",
    "parentIds": [
      "60",
      "62"
    ],
    "isExternal": false,
    "celestialDirection": "",
    "predefinedType": "FLOOR"
  },
  {
    "type": "Slab",
    "id": "24",
    "parentIds": [
      "55",
      "62"
    ],
    "isExternal": false,
    "celestialDirection": "",
    "predefinedType": "FLOOR"
  },
  {
    "type": "Slab",
    "id": "25",
    "parentIds": [
      "56",
      "63"
    ],
    "isExternal": false,
    "celestialDirection": "",
    "predefinedType": "FLOOR"
  },
  {
    "type": "Slab",
    "id": "26",
    "parentIds": [
      "56",
      "46"
    ],
    "isExternal": false,
    "celestialDirection": "",
    "predefinedType": "FLOOR"
  },
  {
    "type": "Slab",
    "id": "27",
    "parentIds": [
      "48",
      "62"
    ],
    "isExternal": false,
    "celestialDirection": "",
    "predefinedType": "FLOOR"
  },
  {
    "type": "Slab",
    "id": "28",
    "parentIds": [
      "49",
      "62"
    ],
    "isExternal": false,
    "celestialDirection": "",
    "predefinedType": "FLOOR"
  },
  {
    "type": "Slab",
    "id": "29",
    "parentIds": [
      "50",
      "57"
    ],
    "isExternal": false,
    "celestialDirection": "",
    "predefinedType": "FLOOR"
  },
  {
    "type": "FlatRoof",
    "id": "30",
    "parentIds": [
      "46",
      "55"
    ],
    "isExternal": true,
    "celestialDirection": "N"
  },
  {
    "type": "FlatRoof",
    "id": "31",
    "parentIds": [
      "46",
      "52"
    ],
    "isExternal": true,
    "celestialDirection": "N"
  },
  {
    "type": "Slab",
    "id": "32",
    "parentIds": [
      "48",
      "53"
    ],
    "isExternal": false,
    "celestialDirection": "",
    "predefinedType": "FLOOR"
  },
  {
    "type": "Slab",
    "id": "33",
    "parentIds": [
      "47",
      "58"
    ],
    "isExternal": false,
    "celestialDirection": "",
    "predefinedType": "FLOOR"
  },
  {
    "type": "Slab",
    "id": "34",
    "parentIds": [
      "50",
      "63"
    ],
    "isExternal": false,
    "celestialDirection": "",
    "predefinedType": "FLOOR"
  },
  {
    "type": "Slab",
    "id": "35",
    "parentIds": [
      "47",
      "65"
    ],
    "isExternal": false,
    "celestialDirection": "",
    "predefinedType": "FLOOR"
  },
  {
    "type": "Slab",
    "id": "36",
    "parentIds": [
      "47",
      "51"
    ],
    "isExternal": false,
    "celestialDirection": "",
    "predefinedType": "FLOOR"
  },
  {
    "type": "Slab",
    "id": "37",
    "parentIds": [
      "61",
      "58"
    ],
    "isExternal": false,
    "celestialDirection": "",
    "predefinedType": "FLOOR"
  },
  {
    "type": "Slab",
    "id": "38",
    "parentIds": [
      "58",
      "64"
    ],
    "isExternal": false,
    "celestialDirection": "",
    "predefinedType": "FLOOR"
  },
  {
    "type": "Slab",
    "id": "39",
    "parentIds": [
      "58",
      "65"
    ],
    "isExternal": false,
    "celestialDirection": "",
    "predefinedType": "FLOOR"
  },
  {
    "type": "Slab",
    "id": "40",
    "parentIds": [
      "52",
      "57"
    ],
    "isExternal": true,
    "celestialDirection": "",
    "predefinedType": "FLOOR"
  },
  {
    "type": "FlatRoof",
    "id": "41",
    "parentIds": [
      "46",
      "62"
    ],
    "isExternal": true,
    "celestialDirection": "NE"
  },
  {
    "type": "Door",
    "id": "42",
    "parentIds": [
      "1"
    ],
    "isExternal": true,
    "celestialDirection": "N"
  },
  {
    "type": "FlatRoof",
    "id": "43",
    "parentIds": [
      "46"
    ],
    "isExternal": true,
    "celestialDirection": "N"
  },
  {
    "type": "Roof",
    "id": "44",
    "parentIds": [
      "47"
    ],
    "isExternal": true,
    "celestialDirection": "N"
  },
  {
    "type": "Space",
    "id": "45",
    "parentIds": [
      "70"
    ],
    "occupancyType": "Wartungsarbeiten",
    "centerOfGravityZ": 7
  },
  {
    "type": "Space",
    "id": "46",
    "parentIds": [
      "66"
    ],
    "occupancyType": "Terrasse",
    "centerOfGravityZ": 6
  },
  {
    "type": "Space",
    "id": "47",
    "parentIds": [
      "66"
    ],
    "occupancyType": "Wohnen",
    "centerOfGravityZ": 6.5
  },
  {
    "type": "Space",
    "id": "48",
    "parentIds": [
      "66"
    ],
    "occupancyType": "Wohnen",
    "centerOfGravityZ": 6.5
  },
  {
    "type": "Space",
    "id": "49",
    "parentIds": [
      "66"
    ],
    "occupancyType": "Bad",
    "centerOfGravityZ": 6.5
  },
  {
    "type": "Space",
    "id": "50",
    "parentIds": [
      "66"
    ],
    "occupancyType": "Schlafen",
    "centerOfGravityZ": 6.5
  },
  {
    "type": "Space",
    "id": "51",
    "parentIds": [
      "71"
    ],
    "occupancyType": "Treppenhaus",
    "centerOfGravityZ": 6.4
  },
  {
    "type": "Space",
    "id": "52",
    "parentIds": [
      "67"
    ],
    "occupancyType": "Wohnen",
    "centerOfGravityZ": 3.5
  },
  {
    "type": "Space",
    "id": "53",
    "parentIds": [
      "67"
    ],
    "occupancyType": "Bad",
    "centerOfGravityZ": 3.5
  },
  {
    "type": "Space",
    "id": "54",
    "parentIds": [
      "67"
    ],
    "occupancyType": "Terrasse",
    "centerOfGravityZ": 3.5
  },
  {
    "type": "Space",
    "id": "55",
    "parentIds": [
      "67"
    ],
    "occupancyType": "Schlafen",
    "centerOfGravityZ": 3.5
  },
  {
    "type": "Space",
    "id": "56",
    "parentIds": [
      "68"
    ],
    "occupancyType": "Tiefgarage",
    "centerOfGravityZ": -3
  },
  {
    "type": "Space",
    "id": "57",
    "parentIds": [
      "69"
    ],
    "occupancyType": "Einfahrt",
    "centerOfGravityZ": -3
  },
  {
    "type": "Space",
    "id": "58",
    "parentIds": [
      "68"
    ],
    "occupancyType": "Gewerbe",
    "centerOfGravityZ": -3
  },
  {
    "type": "Space",
    "id": "59",
    "parentIds": [
      "68"
    ],
    "occupancyType": "Keller",
    "centerOfGravityZ": -3
  },
  {
    "type": "Space",
    "id": "60",
    "parentIds": [
      "68"
    ],
    "occupancyType": "Technik",
    "centerOfGravityZ": -3
  },
  {
    "type": "Space",
    "id": "61",
    "parentIds": [
      "68"
    ],
    "occupancyType": "Waschraum",
    "centerOfGravityZ": -6
  },
  {
    "type": "Space",
    "id": "62",
    "parentIds": [
      "69"
    ],
    "occupancyType": "Tiefgarage",
    "centerOfGravityZ": -6
  },
  {
    "type": "Space",
    "id": "63",
    "parentIds": [
      "69"
    ],
    "occupancyType": "Gewerbe",
    "centerOfGravityZ": -6
  },
  {
    "type": "Space",
    "id": "64",
    "parentIds": [
      "69"
    ],
    "occupancyType": "Keller",
    "centerOfGravityZ": -6
  },
  {
    "type": "Space",
    "id": "65",
    "parentIds": [
      "69"
    ],
    "occupancyType": "Technik",
    "centerOfGravityZ": -6
  },
  {
    "type": "Zone",
    "id": "66",
    "parentIds": [
      "72"
    ],
    "name": "Nutzungseinheit_1",
    "operatingState": "new",
    "acousticRatingLevel": "Erhoehte Anforderungen"
  },
  {
    "type": "Zone",
    "id": "67",
    "parentIds": [
      "72"
    ],
    "name": "Nutzungseinheit_2",
    "operatingState": "new",
    "acousticRatingLevel": "Erhoehte Anforderungen"
  },
  {
    "type": "Zone",
    "id": "68",
    "parentIds": [
      "72"
    ],
    "name": "Nutzungseinheit_3",
    "operatingState": "new",
    "acousticRatingLevel": "Erhoehte Anforderungen"
  },
  {
    "type": "Zone",
    "id": "69",
    "parentIds": [
      "72"
    ],
    "name": "Nutzungseinheit_4",
    "operatingState": "new",
    "acousticRatingLevel": "Erhoehte Anforderungen"
  },
  {
    "type": "Zone",
    "id": "70",
    "parentIds": [
      "72"
    ],
    "name": "Dach",
    "operatingState": "new",
    "acousticRatingLevel": "Erhoehte Anforderungen"
  },
  {
    "type": "Zone",
    "id": "71",
    "parentIds": [
      "72"
    ],
    "name": "Fluchtweg_1",
    "operatingState": "new",
    "acousticRatingLevel": "Minimale Anforderungen"
  },
  {
    "type": "Building",
    "id": "72",
    "parentIds": [],
    "name": "Bauprojekt",
    "operatingState": "new"
  },
  {
    "type": "NeighbourBuilding",
    "id": "73",
    "parentIds": [],
    "occupancyType": "Wohnen"
  }
]
```

## Components

### Wall
| Key                | Type     | Description                                                                                                                                            |
|--------------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| id                 | string   | IfcGloballyUniqueId                                                                                                                                    |
| parendIds          | string[] | The ID of the parent element (IfcRelation/ IfcRelToGroup)                                                                                              |
| isExternal         | boolean  | Indication whether the element is designed for use in the exterior or not. If `true` it is an external component and faces the outside of the building |
| celestialDirection | [string: CelestrialDirection](#celestialdirection)   |                                                                                                                                                        |

#### Example
```json
{
    "id": 2,
    "parentIds": 1,
    "isExternal": false,
    "celestialDirection": "N"
}
```

### Slab
| Key                | Type                                               | Description                                                                                                                                            |
|--------------------|----------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| id                 | string                                             | IfcGloballyUniqueId                                                                                                                                    |
| parendIds          | string[]                                           | The ID of the parent element (IfcRelation/ IfcRelToGroup)                                                                                              |
| isExternal         | boolean                                            | Indication whether the element is designed for use in the exterior or not. If `true` it is an external component and faces the outside of the building |
| celestialDirection | [string: CelestrialDirection](#celestialdirection) |                                                                                                                                                        |
| predefinedType     | [string: PredefinedType](#predefinedtype)          |                                                                                                                                                        |

#### Example
```json
{
    "id": 2,
    "parentIds": 1,
    "isExternal": false,
    "celestialDirection": "N",
    "predefinedType": "FLOOR"
}
```

### Door
| Key                | Type                                                | Description                                                                                                                                            |
|--------------------|-----------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| id                 | string                                              | IfcGloballyUniqueId                                                                                                                                    |
| parendIds          | string[]                                            | The ID of the parent element (IfcRelation/ IfcRelToGroup)                                                                                              |
| isExternal         | boolean                                             | Indication whether the element is designed for use in the exterior or not. If `true` it is an external component and faces the outside of the building |
| celestialDirection | [string: CelestrialDirection](#celestialdirection)  |                                                                                                                                                        |

#### Example
```json
{
    "id": 2,
    "parentIds": 1,
    "isExternal": false,
    "celestialDirection": "N"
}
```

### Roof
| Key                | Type                                                | Description                                                                                                                                            |
|--------------------|-----------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| id                 | string                                              | IfcGloballyUniqueId                                                                                                                                    |
| parendIds          | string[]                                            | The ID of the parent element (IfcRelation/ IfcRelToGroup)                                                                                              |
| isExternal         | boolean                                             | Indication whether the element is designed for use in the exterior or not. If `true` it is an external component and faces the outside of the building |
| celestialDirection | [string: CelestrialDirection](#celestialdirection)  |                                                                                                                                                        |

#### Example
```json
{
    "id": 2,
    "parentIds": 1,
    "isExternal": false,
    "celestialDirection": "N"
}
```

### FlatRoof
| Key                | Type                                                   | Description                                                                                                                                            |
|--------------------|--------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| id                 | string                                                 | IfcGloballyUniqueId                                                                                                                                    |
| parendIds          | string[]                                               | The ID of the parent element (IfcRelation/ IfcRelToGroup)                                                                                              |
| isExternal         | boolean                                                | Indication whether the element is designed for use in the exterior or not. If `true` it is an external component and faces the outside of the building |
| celestialDirection | [string: CelestrialDirection](#celestialdirection)     |                                                                                                                                                        |

#### Example
```json
{
    "id": 2,
    "parentIds": 1,
    "isExternal": false,
    "celestialDirection": "N"
}
```

### NeighbourBuilding
| Key               | Type                                     | Description                                               |
|-------------------|------------------------------------------|-----------------------------------------------------------|
| id                | string                                   | IfcGloballyUniqueId                                       |
| parendIds         | string[]                                 | The ID of the parent element (IfcRelation/ IfcRelToGroup) |
| occupancyType     | [string: OccupancyType](#occupancytype)  |                                                           |

#### Example
```json
{
    "id": 2,
    "parentIds": 1,
    "occupancyType": "Werkstatt"
}
```

### Space
| Key               | Type                                    | Description                                               |
|-------------------|-----------------------------------------|-----------------------------------------------------------|
| id                | string                                  | IfcGloballyUniqueId                                       |
| parendIds         | string[]                                | The ID of the parent element (IfcRelation/ IfcRelToGroup) |
| occupancyType     | [string: OccupancyType](#occupancytype) |                                                           |
| centerOfGravityZ  | number                                  | Center of gravity of the room volume [m]                  |

#### Example
```json
{
    "id": 2,
    "parentIds": 1,
    "occupancyType": "N",
    "centerOfGravityZ": 15.3
}
```

### Building
| Key                  | Type                                      | Description                                                 |
|----------------------|-------------------------------------------|-------------------------------------------------------------|
| id                   | string                                    | IfcGloballyUniqueId                                         |
| parendIds            | string[]                                  | The ID of the parent element (IfcRelation/ IfcRelToGroup)   |
| operatingState       | [string: OperatingState](#operatingstate) |                                                             |

#### Example
```json
{
    "id": 2,
    "parentIds": 1,
    "operatingState": "N"
}
```

### Zone
| Key                 | Type                                                | Description                                                 |
|---------------------|-----------------------------------------------------|-------------------------------------------------------------|
| id                  | string                                              | IfcGloballyUniqueId                                         |
| parendIds           | string[]                                            | The ID of the parent element (IfcRelation/ IfcRelToGroup)   |
| operatingState      | [string: OperatingState](#operatingstate)           |                                                             |
| name                | string                                              |                                                             |
| acousticRatingLevel | [string: AcousticRatingLevel](#acousticratinglevel) |                                                             |

#### Example
```json
{
    "id": 2,
    "parentIds": 1,
    "operatingState": "new",
    "acousticRatingLevel": "Mindestanforderungen"
}
```

### External-Acoustic-Ratings

| Key  | Description | Type                                                           |
|------|-------------|----------------------------------------------------------------|
| n    | North       | [object: External-Acoustic-Rating](#external-acoustic-rating) |
| ne   | North-East  | [object: External-Acoustic-Rating](#external-acoustic-rating) |
| e    | East        | [object: External-Acoustic-Rating](#external-acoustic-rating) |
| se   | South-East  | [object: External-Acoustic-Rating](#external-acoustic-rating) |
| s    | South       | [object: External-Acoustic-Rating](#external-acoustic-rating) |
| sw   | South-West  | [object: External-Acoustic-Rating](#external-acoustic-rating) |
| w    | West        | [object: External-Acoustic-Rating](#external-acoustic-rating) |
| nw   | North-West  | [object: External-Acoustic-Rating](#external-acoustic-rating) |

### External-Acoustic-Rating
| Key                    | Type                           | Values          |
|------------------------|--------------------------------|-----------------|
| day                    | int                            | -2,147,483,647 to 2,147,483,647 |
| night                  | int                            | -2,147,483,647 to 2,147,483,647 |
| spectrumAdjustmentType | string: SpectrumAdjustmentType | c, ctr |


#### Example
```json
{
  "n": {
    "day": 62,
    "night": 55,
    "spectrumAdjustmentType": "ctr"
  },
  "ne": {
    "day": 62,
    "night": 55,
    "spectrumAdjustmentType": "ctr"
  },
  "e": {
    "day": 0,
    "night": 0,
    "spectrumAdjustmentType": "c"
  },
  "se": {
    "day": 0,
    "night": 0,
    "spectrumAdjustmentType": "c"
  },
  "s": {
    "day": 0,
    "night": 0,
    "spectrumAdjustmentType": "c"
  },
  "sw": {
    "day": 0,
    "night": 0,
    "spectrumAdjustmentType": "c"
  },
  "w": {
    "day": 0,
    "night": 0,
    "spectrumAdjustmentType": "c"
  },
  "nw": {
    "day": 0,
    "night": 0,
    "spectrumAdjustmentType": "c"
  }
}
```

### Noise-Sensitivity-Map
| Key                                     |  Type   | Values                                     |
|-----------------------------------------|---------|--------------------------------------------|
| [string: OccupancyType](#occupancytype) | int    | null = None, 1 = Low, 2 = Medium, 3 = High |

#### Example
```json
{
    "Terrasse": null,
    "Werkstatt": 1,
    "Wohnzimmer": 2,
    "Studierzimmer": 3
}
```

### Airborne-Noise-Exposure-Map
| Key                   |  Type   | Values                                         |
|-----------------------|---------|------------------------------------------------|
| [string: OccupancyType](#occupancytype) | int    | 1 = Low, 2 = Moderate, 3 = High, 4 = Very High |

#### Example
```json
{
    "Terrasse": 4,
    "Werkstatt": 3,
    "Wohnzimmer": 2,
    "Studierzimmer": 1
}
```

### Airborne-Noise-Exposure-Map 
| Key                   |  Type   | Values                                         |
|-----------------------|---------|------------------------------------------------|
| [string: OccupancyType](#occupancytype) | int    | 1 = Low, 2 = Moderate, 3 = High, 4 = Very High |

#### Example
```json
{
    "Terrasse": 4,
    "Werkstatt": 3,
    "Wohnzimmer": 2,
    "Studierzimmer": 1
}
```

### Spectrum-Adjustment-Type-Map
| Key                   | Type                           | Values                          |
|-----------------------|--------------------------------|---------------------------------|
| [string: OccupancyType](#occupancytype) | string: SpectrumAdjustmentType | c, ctr |

#### Example
```json
{
    "Terrasse":"c",
    "Werkstatt": "ctr"
}
```

## Types
### CelestialDirection
The celestial direction.

| Value | Description |
|-------|-------------|
| null  |             |
| N     | North       |
| NE    | North East  |
| E     | East        |
| SE    | South East  |
| S     | South       |
| SW    | South West  |
| W     | West        |
| NW    | North West  |

### PredefinedType
The predefined-type based on IFC.

| Value        | Description |
|--------------|-------------|
| FLOOR        | North       |
| BASESLAB     | North East  |
| ROOF         | East        |

### OccupancyType
The occupancy-type for this object according to SIA 181.

| Value         | Description |
|---------------|-------------|
| Werkstatt     |             |
| Empfang       |             |
| Warteraum     |             |
| Grossraumbüro |             | 
| Kantine       |             | 
| Restaurant    |             | 
| Bad           |             | 
| WC            |             |
| Verkauf       |             | 
| Labor         |             | 
| Korridor      |             | 
| Wohnen        |             | 
| Schlafen      |             | 
| Studio        |             | 
| Schulzimmer   |             |
| Wohnküche     |             | 
| Büroraum      |             | 
| Hotelzimmer   |             | 
| Spitalzimmer  |             | 
| Ruheräume     |             | 
| Therapieraum  |             | 
| Lesezimmer    |             |
| Studierzimmer |             | 
| Balkon        |             | 
| Attika        |             | 
| Terrasse      |             | 

### OperatingState
Status of the element, predominately used in renovation or retrofitting projects.

| Value     | Description                                                              |
|-----------|--------------------------------------------------------------------------|
| new       | element designed as new addition                                         |
| temporary | element will exists only temporary (like a temporary support structure)  |
| existing  | element exists and remains                                               |
| demolish  | element existed but is to be demolished                                  |

### AcousticRatingLevel
The AcousticRatingLevelRequirement for a Zone

| Value                   | Description |
|-------------------------|-------------|
| Mindestanforderungen    |             |
| Erhoehte Anforderungen  |             |


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)