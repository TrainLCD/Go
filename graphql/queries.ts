import { gql } from "graphql-request";

const STATION_FRAGMENT = gql`
  fragment StationFields on Station {
    id
    groupId
    name
    nameKatakana
    nameRoman
    nameChinese
    nameKorean
    threeLetterCode
    lines {
      id
      nameShort
      nameKatakana
      nameFull
      nameRoman
      nameChinese
      nameKorean
      color
      lineType
      lineSymbols {
        symbol
        color
        shape
      }
      status
      company {
        id
        railroadId
        nameShort
        nameKatakana
        nameFull
        nameEnglishShort
        nameEnglishFull
        url
        type
        status
        name
      }
      averageDistance
      transportType
    }
    line {
      id
      nameShort
      nameKatakana
      nameFull
      nameRoman
      nameChinese
      nameKorean
      color
      lineType
      lineSymbols {
        symbol
        color
        shape
      }
      status
      company {
        id
        railroadId
        nameShort
        nameKatakana
        nameFull
        nameEnglishShort
        nameEnglishFull
        url
        type
        status
        name
      }
      averageDistance
      transportType
    }
    prefectureId
    postalCode
    address
    latitude
    longitude
    openedAt
    closedAt
    status
    stationNumbers {
      lineSymbol
      lineSymbolColor
      lineSymbolShape
      stationNumber
    }
    stopCondition
    distance
    hasTrainTypes
    trainType {
      id
      typeId
      groupId
      name
      nameKatakana
      nameRoman
      nameChinese
      nameKorean
      color
      direction
      kind
    }
    transportType
  }
`;

export const STATIONS_BY_NAME = gql`
  ${STATION_FRAGMENT}
  query StationsByName($name: String!, $limit: Int, $fromStationGroupId: Int) {
    stationsByName(name: $name, limit: $limit, fromStationGroupId: $fromStationGroupId) {
      ...StationFields
    }
  }
`;

export const STATION_GROUP_STATIONS = gql`
  ${STATION_FRAGMENT}
  query StationGroupStations($groupId: Int!) {
    stationsByGroupId(groupId: $groupId) {
      ...StationFields
    }
  }
`;

export const LINE_STATIONS = gql`
  ${STATION_FRAGMENT}
  query LineStations($lineId: Int!) {
    stationsByLineId(lineId: $lineId) {
      ...StationFields
    }
  }
`;

export const LINE_BY_ID = gql`
  query LineById($id: Int!) {
    line(id: $id) {
      id
      nameShort
      nameKatakana
      nameFull
      nameRoman
      nameChinese
      nameKorean
      color
      lineType
      lineSymbols {
        symbol
        color
        shape
      }
      status
      company {
        id
        railroadId
        nameShort
        nameKatakana
        nameFull
        nameEnglishShort
        nameEnglishFull
        url
        type
        status
        name
      }
      averageDistance
      transportType
    }
  }
`;

export const LINES_BY_NAME = gql`
  query LinesByName($name: String!, $limit: Int) {
    linesByName(name: $name, limit: $limit) {
      id
      nameShort
      nameKatakana
      nameFull
      nameRoman
      nameChinese
      nameKorean
      color
      lineType
      lineSymbols {
        symbol
        color
        shape
      }
      status
      company {
        id
        railroadId
        nameShort
        nameKatakana
        nameFull
        nameEnglishShort
        nameEnglishFull
        url
        type
        status
        name
      }
      averageDistance
      transportType
    }
  }
`;

export const ROUTES = gql`
  ${STATION_FRAGMENT}
  query Routes($fromStationGroupId: Int!, $toStationGroupId: Int!) {
    routes(fromStationGroupId: $fromStationGroupId, toStationGroupId: $toStationGroupId) {
      routes {
        id
        stops {
          ...StationFields
        }
      }
      nextPageToken
    }
  }
`;
