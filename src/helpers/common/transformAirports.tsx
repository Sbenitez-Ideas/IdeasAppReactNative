import { Airport } from "../../model/classes/flights/business-objects/Airport";

export const transformAirports = ( iata: string, airports:  Airport[], type: string = 'city', defaultIata: boolean = true ) => {
    let info = defaultIata ? iata : '';
    if (airports) {
      const airport = airports.find(a => a.Code === iata);

    if (airport) {
      switch (type) {
        case 'city':
          info = airport.CityName;
        break;
        case 'airport':
          info = airport.Name;
        break;
      }
    }

    }

    return info;
}