import 'whatwg-fetch';
import { ErrorCode } from './constants';

/**
 * Parses the JSON returned by a network request
 */

function parseTextResponse(response) {
  try {
    return JSON.parse(response);
  } catch (e) {
    return response;
  }
}

function parseResponse(response) {
  if (response instanceof Response) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      return response.json();
    }
    return response.text().then(parseTextResponse);
  }
  return new Promise(function(resolve) {
    resolve(parseTextResponse(response));
  });
}

/**
 * Check if a network request came back fine, and throws an error if not
 */

function checkStatus(response) {
  if (response instanceof Response) {
    if (response.status >= 200 && response.status < 500) {
      return response;
    }
    const error = new Error(response.statusText);
    error.responseCode = ErrorCode.SOMETHING_WRONG;
    error.response = response;
    throw error;
  }
  return new Promise(function(resolve) {
    resolve(response);
  });
}
function makeRequest(url, options, emptyHeader) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(options.method, url);
    //xhr.withCredentials = true;
    if (!emptyHeader) {
      xhr.setRequestHeader(
        'Content-Type',
        options.headers && options.headers['Content-Type']
          ? options.headers['Content-Type']
          : 'application/json; charset=UTF-8"'
      );
      if (options.headers && Object.keys(options.headers).length > 1) {
        for (var header in options.headers) {
          if (header !== 'Content-Type')
            xhr.setRequestHeader(header, options.headers[header]);
        }
      }
    }
    xhr.onload = function() {
      if (this.status >= 200 && this.status < 500) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function() {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    options.body ? xhr.send(options.body) : xhr.send();
  });
}
function XHR(url, options, emptyHeader) {
  return new Promise(function(resolve, reject) {
    const xhr = makeRequest(url, options, emptyHeader);
    xhr
      .then(function(response) {
        resolve(response);
      })
      .catch(function() {
        reject();
      });
  });
}
/**
 * Request a URL, returning a Promise
 */
export default function request(url, options, emptyHeader = false) {
  let ajaxApi = XHR(url, options, emptyHeader);
  return ajaxApi
    .then(checkStatus)
    .then(parseResponse)
    .catch(function(error) {
      console.error('fetch error', url, error);
      return { apiError: true, error };
    });
  // if (options.xhr) {
  //   ajaxApi = XHR(url, options);
  // } else {
  //   ajaxApi = fetch(url, options);
  // }
  // return fetch(url, options)
  //   .then(checkStatus)
  //   .then(parseResponse)
  //   .catch(function(error) {
  //     console.error("Fetch Error", error);
  //   });
}
