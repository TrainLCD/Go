export enum StopCondition {
  All = "All",
  Not = "Not",
  Partial = "Partial",
  Weekday = "Weekday",
  Holiday = "Holiday",
  PartialStop = "PartialStop",
}

export enum LineType {
  OtherLineType = "OtherLineType",
  BulletTrain = "BulletTrain",
  Normal = "Normal",
  Subway = "Subway",
  Tram = "Tram",
  MonorailOrAGT = "MonorailOrAGT",
}

export enum OperationStatus {
  InOperation = "InOperation",
  NotOpened = "NotOpened",
  Closed = "Closed",
}

export enum TrainDirection {
  Both = "Both",
  Inbound = "Inbound",
  Outbound = "Outbound",
}

export enum TrainTypeKind {
  Default = "Default",
  Branch = "Branch",
  Rapid = "Rapid",
  Express = "Express",
  LimitedExpress = "LimitedExpress",
  HighSpeedRapid = "HighSpeedRapid",
}

export enum CompanyType {
  OtherCompany = "OtherCompany",
  JR = "JR",
  Private = "Private",
  Major = "Major",
  SemiMajor = "SemiMajor",
}

export enum TransportType {
  TransportTypeUnspecified = "TransportTypeUnspecified",
  Rail = "Rail",
  Bus = "Bus",
  RailAndBus = "RailAndBus",
}

export interface StationNumber {
  lineSymbol: string;
  lineSymbolColor: string;
  lineSymbolShape: string;
  stationNumber: string;
}

export interface LineSymbol {
  symbol: string;
  color: string;
  shape: string;
}

export interface Company {
  id: number;
  railroadId: number;
  nameShort: string;
  nameKatakana: string;
  nameFull: string;
  nameEnglishShort: string;
  nameEnglishFull: string;
  url?: string;
  type: CompanyType;
  status: OperationStatus;
  name: string;
}

export interface TrainType {
  id: number;
  typeId: number;
  groupId: number;
  name: string;
  nameKatakana: string;
  nameRoman?: string;
  nameChinese?: string;
  nameKorean?: string;
  color: string;
  lines: Line[];
  line?: Line;
  direction: TrainDirection;
  kind: TrainTypeKind;
}

export interface Line {
  id: number;
  nameShort: string;
  nameKatakana: string;
  nameFull: string;
  nameRoman?: string;
  nameChinese?: string;
  nameKorean?: string;
  color: string;
  lineType: LineType;
  lineSymbols: LineSymbol[];
  status: OperationStatus;
  station?: Station;
  company?: Company;
  trainType?: TrainType;
  averageDistance: number;
  transportType: TransportType;
}

export interface Station {
  id: number;
  groupId: number;
  name: string;
  nameKatakana: string;
  nameRoman?: string;
  nameChinese?: string;
  nameKorean?: string;
  threeLetterCode?: string;
  lines: Line[];
  line?: Line;
  prefectureId: number;
  postalCode: string;
  address: string;
  latitude: number;
  longitude: number;
  openedAt: string;
  closedAt: string;
  status: OperationStatus;
  stationNumbers: StationNumber[];
  stopCondition: StopCondition;
  distance?: number;
  hasTrainTypes?: boolean;
  trainType?: TrainType;
  transportType: TransportType;
}

export interface Route {
  id: number;
  stops: Station[];
}

export interface RouteTypeTrainType {
  id: number;
  groupId: number;
}

export interface RouteTypesResponse {
  trainTypes: RouteTypeTrainType[];
  nextPageToken: string;
}
