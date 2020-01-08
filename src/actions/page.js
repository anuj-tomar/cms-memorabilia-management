import { UPDATE_PAGE_DATA, GET_PAGE_DATA, RESET_PAGE_STATE, UPDATE_MODAL_DATA, GET_INDIVIDUAL_DATA, 
  FETCH_AUTO_SUGGESTIONS, UPLOAD_FILE } from './constants';


export function updateModalData(data) {
    return {
      type: UPDATE_MODAL_DATA,
      data
    };
  }

export function getPageData(data={}) {
    return {
      type: `SAGA/${GET_PAGE_DATA}`,
      data
    };
}
export function getIndividualItem(data={}) {
    return {
      type: `SAGA/${GET_INDIVIDUAL_DATA}`,
      data
    };
}
  
  export function updatePageData(data={}, cb) {
    return {
      type: `SAGA/${UPDATE_PAGE_DATA}`,
      data,
      cb
    };
  }


  export function resetPageStore(key) {
    return {
      type: RESET_PAGE_STATE,
      data: { key }
    };
  }

  export function fetchSuggestions(data, namespace) {
    return {
      type: `${namespace}/${FETCH_AUTO_SUGGESTIONS}`,
      data,
      namespace
    };
  }

  export function setPageData(data){
    return {
      type: `REDUCER/${UPDATE_PAGE_DATA}`,
      data
  }
  }

  export function uploadFile(data, cb) {
    return {
      type: `SAGA/${UPLOAD_FILE}`,
      data,
      cb
    };
  }