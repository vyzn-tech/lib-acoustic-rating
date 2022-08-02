# lib-acoustic-rating

lib-acoustic-rating is a Javascript library which calculates acoustic rating requirements for IFC-data according to SIA 181.

## Installation

Use the package manager [npm](https://docs.npmjs.com/try-the-latest-stable-version-of-npm) to install lib-acoustic-rating.

```bash
npm install @vyzn-tech/lib-acoustic-rating
```

## Usage

```javascript
import CsvConverter from '@vyzn-tech/lib-acoustic-rating/dist/csv-converter'
import { AcousticRatingCalculator } from '@vyzn-tech/lib-acoustic-rating/dist/calculator'

const items = new CsvConverter().convertToComponents(csvString)

const calculator = new AcousticRatingCalculator(
  items,
  externalAcousticRatings,
)

console.log(calculator.calculate())
```

## Expected Input

### CSV-Structure
| Column                  | Description                                                                                                                                                                                                                                                                                                                                                                                     | Supported Values                                                                                                                                                                                                                                      | Example                  | Comment                                                                                |
|-------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------|----------------------------------------------------------------------------------------|
| GUID                    | An IfcGloballyUniqueId holds an encoded string identifier that is used to uniquely identify an IFC object.                                                                                                                                                                                                                                                                                      | 22 character length string "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_$"                                                                                                                                                         | 01$34_67$9_BsbEFbH$JK_M  | GUID(same as original IFC) or UniqueLabel (unique string)                              |
| Entity                  | In an IFC model, project information is represented as a series of IFC entities. Each IFC entity contains a fixed number of IFC attributes as well as any number of additional IFC properties. The IFC schema includes several hundred entities, of which the building element-type entities (such as IfcWall and IfcColumn) represent only 25.                                                 | IfcWall  IfcSlab  IfcRoof  IfcSpace  IfcZone  IfcBuilding                                                                                                                                                                                             | IfcWall                  | ElementType  Could be remapped in an interface to match the request                    |
| PredefinedType          | only required for IfcSlab:  The predefined type based on IFC.                                                                                                                                                                                                                                                                                                                                   | FLOOR  BASESLAB  ROOF                                                                                                                                                                                                                                 | FLOOR                    | See Entity                                                                             |
| ParentIds               | The ID of the parent element (IfcRelation/ IfcRelToGroup)                                                                                                                                                                                                                                                                                                                                       | A value from column “ID” of another row or  null (empty cell)                                                                                                                                                                                         | 01$34_67$9_BsbEFbH$JK_M  | Will be the result of the link service                                                 |
| Name                    | only required for IfcZone and IfcBuilding:  Bezeichnung respektive Name, welcher sich von anderer Nutzungseinheit oder anderen Gebäude unterscheidet                                                                                                                                                                                                                                            | frei (string), beispielsweise Nutzungseinheit_1,  Nutzungseinheit_2,... Dach  Fluchtweg_1, Bauprojekt,  Nachbargebäude                                                                                                                                | Nutzungseinheit_1        | User input - ideally to be inputted on the platform / second option would be IFC input |
| AcousticRatingLevelReq  | only required for IfcZone                                                                                                                                                                                                                                                                                                                                                                       | Mindestanforderungen, Erhöhte Anforderungen                                                                                                                                                                                                           | Mindestanforderungen     | User input                                                                             |
| Status                  | only required for IfcZone and IfcBuilding:  Status of the element, predominately used in renovation or retrofitting projects. The status can be assigned to as "New" - element designed as new addition, "Existing" - element exists and remains, "Demolish" - element existed but is to be demolished, "Temporary" - element will exists only temporary (like a temporary support structure).  | new, existing , temporary                                                                                                                                                                                                                             | new                      | ConstructionType  Missing option “temporary” should be added                           |
| IsExternal              | Indication whether the element is designed for use in the exterior (TRUE) or not (FALSE). If (TRUE) it is an external element and faces the outside of the building                                                                                                                                                                                                                             | TRUE  FALSE                                                                                                                                                                                                                                           | TRUE                     | PositionAgainst  Could be remapped in an interface to match the request                |
| OccupancyType           | Occupancy type for this object. It is defined according to the presiding national code.                                                                                                                                                                                                                                                                                                         | Werkstatt, Empfang,  Warteraum, Großraumbüro, Kantine,  Restaurant, Bad, WC,  Verkauf, Labor, Korridor,  Wohnen, Schlafen,  Studio, Schulzimmer,  Wohnküche, Büroraum,  Hotelzimmer, Spitalzimmer, Ruheräume  Therapieraum, Lesezimmer, Studierzimmer | Wohnküche                | User input - Since that is a national standard the options should be in german         |
| CelestialDirection      | Himmelsrichtung 8 options                                                                                                                                                                                                                                                                                                                                                                       | N, NE, E, SE, S, SW, W, NW                                                                                                                                                                                                                            | SW                       | Orientation  Could be remapped in an interface to match the request                    |
| CenterOfGravityZ        | Gravitationsschwerpunkt des Raumvolumens [m]                                                                                                                                                                                                                                                                                                                                                    | -99.99 to 99.99                                                                                                                                                                                                                                       | 3.43                     | Should be produced by the REF model                                                    |

### Example CSV
|GUID|Entity     |PredefinedType|ParentIds|Name             |AcousticRatingLevelReq|Status  |IsExternal|OccupancyType   |CelestialDirection|CenterOfGravityZ|
|----|-----------|--------------|---------|-----------------|----------------------|--------|----------|----------------|------------------|----------------|
|1   |IfcWall    |              |47       |                 |                      |        |TRUE      |                |NE                |                |
|2   |IfcWall    |              |51       |                 |                      |        |TRUE      |                |NE                |                |
|3   |IfcWall    |              |47,54    |                 |                      |        |TRUE      |                |NE                |                |
|4   |IfcWall    |              |48,54    |                 |                      |        |TRUE      |                |N                 |                |
|5   |IfcWall    |              |47,52    |                 |                      |        |FALSE     |                |N                 |                |
|6   |IfcWall    |              |46,47    |                 |                      |        |FALSE     |                |N                 |                |
|7   |IfcWall    |              |47,53    |                 |                      |        |FALSE     |                |N                 |                |
|8   |IfcWall    |              |47,55    |                 |                      |        |FALSE     |                |N                 |                |
|9   |IfcWall    |              |50,55    |                 |                      |        |FALSE     |                |N                 |                |
|10  |IfcWall    |              |46,55    |                 |                      |        |FALSE     |                |N                 |                |
|11  |IfcWall    |              |51,50    |                 |                      |        |FALSE     |                |N                 |                |
|12  |IfcWall    |              |51,49    |                 |                      |        |FALSE     |                |N                 |                |
|13  |IfcWall    |              |51,48    |                 |                      |        |FALSE     |                |N                 |                |
|14  |IfcWall    |              |53,49    |                 |                      |        |FALSE     |                |N                 |                |
|15  |IfcWall    |              |47,73    |                 |                      |        |FALSE     |                |N                 |                |
|16  |IfcWall    |              |55,73    |                 |                      |        |FALSE     |                |N                 |                |
|17  |IfcWall    |              |53,73    |                 |                      |        |FALSE     |                |N                 |                |
|18  |IfcWall    |              |64,51    |                 |                      |        |FALSE     |                |N                 |                |
|19  |IfcWall    |              |57,59    |                 |                      |        |TRUE      |                |NE                |                |
|20  |IfcSlab    |FLOOR         |56,62    |                 |                      |        |FALSE     |                |                  |                |
|21  |IfcSlab    |FLOOR         |58,62    |                 |                      |        |FALSE     |                |                  |                |
|22  |IfcSlab    |FLOOR         |59,62    |                 |                      |        |FALSE     |                |                  |                |
|23  |IfcSlab    |FLOOR         |60,62    |                 |                      |        |FALSE     |                |                  |                |
|24  |IfcSlab    |FLOOR         |55,62    |                 |                      |        |FALSE     |                |                  |                |
|25  |IfcSlab    |FLOOR         |56,63    |                 |                      |        |FALSE     |                |                  |                |
|26  |IfcSlab    |FLOOR         |56,46    |                 |                      |        |FALSE     |                |                  |                |
|27  |IfcSlab    |              |48,62    |                 |                      |        |FALSE     |                |                  |                |
|28  |IfcSlab    |FLOOR         |49,62    |                 |                      |        |FALSE     |                |                  |                |
|29  |IfcSlab    |FLOOR         |50,57    |                 |                      |        |FALSE     |                |                  |                |
|30  |IfcSlab    |ROOF          |46,55    |                 |                      |        |TRUE      |                |N                 |                |
|31  |IfcSlab    |ROOF          |46,52    |                 |                      |        |TRUE      |                |N                 |                |
|32  |IfcSlab    |FLOOR         |48,53    |                 |                      |        |FALSE     |                |                  |                |
|33  |IfcSlab    |FLOOR         |47,58    |                 |                      |        |FALSE     |                |                  |                |
|34  |IfcSlab    |FLOOR         |50,63    |                 |                      |        |FALSE     |                |                  |                |
|35  |IfcSlab    |FLOOR         |47,65    |                 |                      |        |FALSE     |                |                  |                |
|36  |IfcSlab    |FLOOR         |47,51    |                 |                      |        |FALSE     |                |                  |                |
|37  |IfcSlab    |FLOOR         |61,58    |                 |                      |        |FALSE     |                |                  |                |
|38  |IfcSlab    |FLOOR         |58,64    |                 |                      |        |FALSE     |                |                  |                |
|39  |IfcSlab    |FLOOR         |58,65    |                 |                      |        |FALSE     |                |                  |                |
|40  |IfcSlab    |FLOOR         |52,57    |                 |                      |        |TRUE      |                |                  |                |
|41  |IfcSlab    |ROOF          |46,62    |                 |                      |        |TRUE      |                |NE                |                |
|42  |IfcDoor    |              |1        |                 |                      |        |TRUE      |                |N                 |                |
|43  |IfcSlab    |ROOF          |46       |                 |                      |        |TRUE      |                |N                 |                |
|44  |IfcRoof    |              |47       |                 |                      |        |TRUE      |                |N                 |                |
|45  |IfcSpace   |              |70       |                 |                      |        |          |Wartungsarbeiten|                  |7               |
|46  |IfcSpace   |              |66       |                 |                      |        |          |Terrasse        |                  |6               |
|47  |IfcSpace   |              |66       |                 |                      |        |          |Wohnen          |                  |6.5             |
|48  |IfcSpace   |              |66       |                 |                      |        |          |Wohnen          |                  |6.5             |
|49  |IfcSpace   |              |66       |                 |                      |        |          |Bad             |                  |6.5             |
|50  |IfcSpace   |              |66       |                 |                      |        |          |Schlafen        |                  |6.5             |
|51  |IfcSpace   |              |71       |                 |                      |        |          |Treppenhaus     |                  |6.4             |
|52  |IfcSpace   |              |67       |                 |                      |        |          |Wohnen          |                  |3.5             |
|53  |IfcSpace   |              |67       |                 |                      |        |          |Bad             |                  |3.5             |
|54  |IfcSpace   |              |67       |                 |                      |        |          |Terrasse        |                  |3.5             |
|55  |IfcSpace   |              |67       |                 |                      |        |          |Schlafen        |                  |3.5             |
|56  |IfcSpace   |              |68       |                 |                      |        |          |Tiefgarage      |                  |-3              |
|57  |IfcSpace   |              |69       |                 |                      |        |          |Einfahrt        |                  |-3              |
|58  |IfcSpace   |              |68       |                 |                      |        |          |Gewerbe         |                  |-3              |
|59  |IfcSpace   |              |68       |                 |                      |        |          |Keller          |                  |-3              |
|60  |IfcSpace   |              |68       |                 |                      |        |          |Technik         |                  |-3              |
|61  |IfcSpace   |              |68       |                 |                      |        |          |Waschraum       |                  |-6              |
|62  |IfcSpace   |              |69       |                 |                      |        |          |Tiefgarage      |                  |-6              |
|63  |IfcSpace   |              |69       |                 |                      |        |          |Gewerbe         |                  |-6              |
|64  |IfcSpace   |              |69       |                 |                      |        |          |Keller          |                  |-6              |
|65  |IfcSpace   |              |69       |                 |                      |        |          |Technik         |                  |-6              |
|66  |IfcZone    |              |72       |Nutzungseinheit_1|Erhoehte Anforderungen|new     |          |                |                  |                |
|67  |IfcZone    |              |72       |Nutzungseinheit_2|Erhoehte Anforderungen|new     |          |                |                  |                |
|68  |IfcZone    |              |72       |Nutzungseinheit_3|Erhoehte Anforderungen|new     |          |                |                  |                |
|69  |IfcZone    |              |72       |Nutzungseinheit_4|Erhoehte Anforderungen|new     |          |                |                  |                |
|70  |IfcZone    |              |72       |Dach             |Erhoehte Anforderungen|new     |          |                |                  |                |
|71  |IfcZone    |              |72       |Fluchtweg_1      |Minimale Anforderungen|new     |          |                |                  |                |
|72  |IfcBuilding|              |         |Bauprojekt       |                      |new     |          |                |                  |                |
|73  |IfcBuilding|              |         |Nachbargebäude   |                      |existing|          |Wohnen          |                  |                |

### External Acoustic Ratings Structure

| Key                    | Description | Type   | Values          |
|------------------------|---|--------|-----------------|
| day                    |  | int    |            |
| night                  |  | int    |            |
| spectrumAdjustmentType |  | string | c, ctr |


### Example JSON
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

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)