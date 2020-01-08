import { FETCH_CONTINENT_LIST, FETCH_COUNTRY_LIST, FETCH_CITY_LIST } from './constants';

export function fectContinentList(data={}){
    return {
        type: 'SAGA/' + FETCH_CONTINENT_LIST,
        data,
        namespace: FETCH_CONTINENT_LIST
    };
} 
export function fectCountryList(data){
    return {
        type: 'SAGA/' + FETCH_COUNTRY_LIST,
        data,
        namespace: FETCH_COUNTRY_LIST
    };
} 
export function fectCityList(data){
    return {
        type: 'SAGA/' + FETCH_CITY_LIST,
        data,
        namespace: FETCH_CITY_LIST
    };
} 