import {
    UPDATE_MODAL_DATA,
    RESET_PAGE_STATE,
    UPDATE_PAGE_DATA,
    GET_PAGE_DATA,
    GET_INDIVIDUAL_DATA,
    FETCH_AUTO_SUGGESTIONS
} from '../actions/constants';

const INITIAL_STATE = {
    modal: { showCustomModal: false },
    addonmodal: { showCustomModal: false },
    pageData: {},
    individualItem: {},
    itemLoader: false,
    isLoader: false,
    updatedData: {},
    countryList: [],
    continentList: [],
    cityList: [],
    qsCatList: [],
    clubList: [],
    reservationTypeList: {},
    suggesions:{}
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case UPDATE_MODAL_DATA:
            let modal = action.data.addon ? 'addonmodal' : 'modal';
            return { ...state, [modal]: action.data };
        case `SAGA/${GET_PAGE_DATA}`:
            return { ...state, isLoader: true, pageData: {} };
        case `REDUCER/${GET_PAGE_DATA}`:
            return { ...state, isLoader: false, pageData: action.data };
        case `SAGA/${UPDATE_PAGE_DATA}`:
            return { ...state, updatedData: {} };
        case `REDUCER/${UPDATE_PAGE_DATA}`:
            return { ...state, updatedData: action.data };
        case `SAGA/${GET_INDIVIDUAL_DATA}`:
            return { ...state, individualItem: {}, itemLoader: true };
        case `REDUCER/${GET_INDIVIDUAL_DATA}`:
            return { ...state, individualItem: action.data, itemLoader: false };
        case `REDUCER/countryList/${FETCH_AUTO_SUGGESTIONS}`:
            return { ...state, countryList: action.data };
        case `REDUCER/continentList/${FETCH_AUTO_SUGGESTIONS}`:
            return { ...state, continentList: action.data };
        case `REDUCER/suggesions/${FETCH_AUTO_SUGGESTIONS}`:
            return { ...state, suggesions: action.data };
        case `REDUCER/cityList/${FETCH_AUTO_SUGGESTIONS}`:
            return { ...state, cityList: action.data };
        case `REDUCER/qsCatList/${FETCH_AUTO_SUGGESTIONS}`:
                return { ...state, qsCatList: action.data };
        case `REDUCER/reservationTypeList/${FETCH_AUTO_SUGGESTIONS}`:
            return { ...state, reservationTypeList: action.data };
        case `REDUCER/clubList/${FETCH_AUTO_SUGGESTIONS}`:
            return { ...state, clubList: action.data };
        case RESET_PAGE_STATE:
            return action.data && action.data.key
                ? { ...state, ...resetStore(action.data.key, INITIAL_STATE) }
                : INITIAL_STATE;
        default:
            return state;
    }
}

function resetStore(key, state){
   if(Array.isArray(key)){
     let s = {};
     key.forEach((k)=>{
         s[k] = state[k];
     })
     return s;
   }
   return {[key]: state[key]}
}