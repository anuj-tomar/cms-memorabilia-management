//import queryString from 'query-string';
export function historyPushstate(path) {
  if (window.history.pushState) {
    var newurl = window.location.protocol + '//' + window.location.host + path;
    window.history.pushState({ path: newurl }, '', newurl);
  }
}
export function historyReplacestate(path) {
  if (window.history.replaceState) {
    var newurl = window.location.protocol + '//' + window.location.host + path;
    window.history.replaceState({ path: newurl }, '', newurl);
  }
}

// export function getQueryParams() {
//   return queryString.parse(window.location.search);
// }
