type CelestialDirection =
  | null
  | 'N'
  | 'NE'
  | 'E'
  | 'SE'
  | 'S'
  | 'SW'
  | 'W'
  | 'NW';
type Status = 'new' | 'temporary' | 'existing' | 'demolish';
// @todo use english values
type Reference = 'Wand' | 'Decke' | 'Flachdach' | 'Steildach' | 'Bodenplatte';
// @todo use english values
type AcousticRatingLevelReq = 'Mindestanforderungen' | 'Erhoehte Anforderungen';
type PredefinedType = 'FLOOR' | 'BASESLAB' | 'ROOF';
// @todo use english values
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
  | 'Studierzimmer';

class Component {
  id: string;
  parentId: string;
}

class IFCWall extends Component {
  isExternal: boolean;
  celestialDirection: CelestialDirection;
  reference: Reference;
}

class IFCSlab extends Component {
  isExternal: boolean;
  celestialDirection: CelestialDirection;
  reference: Reference;
}

class IFCSpace extends Component {
  occupancyType: OccupancyType;
  centerOfGravityZ: number;
}

class IFCZone extends Component {
  acousticRatingLevelReq: AcousticRatingLevelReq;
  status: Status;
  reference: Reference;
}

class IFCBuilding extends Component {
  status: Status;
  reference: Reference;
}

class OutputComponent {
  id: string;
  airborneAcousticRatingCReq: number;
  airborneAcousticRatingCtrReq: number;
  footstepAcousticRatingCReq: number;
  footstepAcousticRatingCtrReq: number;
}

class ExternalAcousticRating {
  N: number;
  NE: number;
  E: number;
  SE: number;
  S: number;
  SW: number;
  W: number;
  NW: number;
}

class AcousticRatingCalculator {
  inputComponents: Component[];
  externalAcousticRating: ExternalAcousticRating;

  constructor(
    inputComponents: Component[],
    externalAcousticRating: ExternalAcousticRating,
  ) {
    this.inputComponents = inputComponents;
    this.externalAcousticRating = externalAcousticRating;
  }

  calculate(): OutputComponent[] {
    let outputComponents: OutputComponent[];

    return outputComponents;
  }

  calculateAirborneAcousticRatingCReq() {}

  calculateAirborneAcousticRatingCtrReq() {}

  calculateFootstepAcousticRatingCReq() {}

  calculateFootstepAcousticRatingCtrReq() {}
}

const acousticRatingCalculator = new AcousticRatingCalculator();
const output = acousticRatingCalculator.calculate();
