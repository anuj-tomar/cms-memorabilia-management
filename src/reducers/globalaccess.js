import { FETCH_CONTINENT_LIST, FETCH_COUNTRY_LIST, FETCH_CITY_LIST } from '../actions/constants';

const INITIAL_STATE = {
    contilentList: [],
    countryList: [],
    cityList: []
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case `REDUCER/${FETCH_CONTINENT_LIST}`:
            return { ...state, contilentList: action.data };
        case `REDUCER/${FETCH_COUNTRY_LIST}`:
            return { ...state, countryList: action.data };
        case `REDUCER/${FETCH_CITY_LIST}`:
            return { ...state, cityList: action.data };
        default:
            return state;
    }
}
