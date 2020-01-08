import { detect } from 'detect-browser';
import { toast } from 'react-toastify';
import request from './request';
import {
  MobileMinWidth,
  MobileMaxWidth,
  TabletMinWidth,
  TabletMaxWidth,
  DesktopMinWidth,
  API_BASE_PATH
} from './constants';
import format from './formatter';

function isFile(input) {
  if ('File' in window && input instanceof File) return true;
  else return false;
}

function isBlob(input) {
  if (input instanceof Blob) return true;
  else return false;
}

export function fetchService(config, emptyHeader = false) {
  const url = new URL(`${API_BASE_PATH}${config.url}`);
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    ...config
  };

  if (
    options.payload &&
    config.headers &&
    config.headers['Content-Type'] === 'multipart/form-data'
  ) {
    options.body = new FormData();
    Object.keys(options.payload).forEach(key => {
      if (key === 'attachments') {
        for (var i in options.payload[key]) {
          if (
            isFile(options.payload[key][i]) ||
            isBlob(options.payload[key][i])
          ) {
            options.body.append(key + '[' + i + ']', options.payload[key][i]);
          }
        }
      } else {
        let kd = options.payload[key] && Array.isArray(options.payload[key]) ? JSON.stringify(options.payload[key]) : options.payload[key];
        options.body.append(key, kd);
      }
    });
    emptyHeader = true;
  } else if (options.payload) {
    options.body = JSON.stringify(options.payload);
  }

  if (config.params && config.params !== null) {
    Object.keys(config.params).forEach(key =>
      url.searchParams.append(key, config.params[key])
    );
  }
  return request(url, options, emptyHeader);
}

export function getBrowser() {
  const browser = detect();
  return browser.name;
}

export function isMobile() {
  const viewportWidth = window.innerWidth;
  return viewportWidth >= MobileMinWidth && viewportWidth <= MobileMaxWidth;
}

export function isTablet() {
  const viewportWidth = window.innerWidth;
  return viewportWidth >= TabletMinWidth && viewportWidth <= TabletMaxWidth;
}

export function isDesktop() {
  const viewportWidth = window.innerWidth;
  return viewportWidth >= DesktopMinWidth;
}

export function flatternObject(obj) {
  const returnObj = {};
  Object.keys(obj).forEach(key => {
    if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
      const flatObject = flatternObject(obj[key]);
      Object.keys(flatObject).forEach(newKey => {
        returnObj[`${key}.${newKey}`] = flatObject[newKey];
      });
    } else {
      returnObj[key] = obj[key];
    }
  });
  return returnObj;
}

export function deepSearchObject(key, obj) {
  const keyArray = key.indexOf('|') !== -1 ? key.split('|') : key.split('.');
  let value = obj;
  keyArray.every(tempKey => {
    if (value[tempKey]) {
      value = value[tempKey];
      return true;
    } else {
      value = undefined;
      return false;
    }
  });
  return value;
}

export function injectData(baseObj = {}, keyObj, data, raw) {
  const obj = baseObj;
  Object.keys(keyObj).forEach(key => {
    if (typeof keyObj[key] === 'string') {
      let dataKey = keyObj[key].split('|')[0];
      const formatter = keyObj[key].split('|')[1] || 'value';
      let defaultVal;
      if (dataKey.indexOf('~') !== 0) {
        const dataKeyArr = dataKey.split('~');
        [dataKey, defaultVal] = dataKeyArr;
      }
      obj[key] =
        dataKey.indexOf('@') === 0
          ? format[formatter](dataKey.replace('@', ''))
          : format[formatter](data[dataKey]) ||
            format[formatter](deepSearchObject(dataKey, raw)) ||
            defaultVal;
    } else {
      obj[key] = keyObj[key];
    }
  });
  return obj;
}

export function setPageTitle(title) {
  document.title = title;
}

export function dynamicString(string, data) {
  Object.keys(data).forEach(key => {
    string = string.replace(new RegExp(`#${key}#`, 'g'), data[key]);
  });
  return string;
}

export function isJson(str) {
  if (str === null || str === undefined || !str) {
    return false;
  }
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export function isObject(value) {
  return value && typeof value === 'object' && value.constructor === Object;
}

export const storage = {
  get: name => {
    const value = localStorage.getItem(name) || undefined;
    if (isJson(value)) {
      return JSON.parse(value);
    } else {
      return value;
    }
  },
  set: (name, value) => {
    if (typeof value === 'object') {
      localStorage.setItem(name, JSON.stringify(value));
    } else {
      localStorage.setItem(name, value);
    }
  },
  delete: name => {
    localStorage.removeItem(name);
  }
};

export function isObjEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function debounce(fn, time) {
  let timeout;

  return function() {
    const functionCall = () => fn.apply(this, arguments);

    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  };
}

export function closeRightPannel() {
  document.body.className = document.body.className.replace('openDrawer', '');
}

export function toastmessage(message, type = 'info', conf = {}) {
  //type: Kind of notification. One of "default", "success", "info", "warning", "error"
  let config = {
    position: toast.POSITION.TOP_CENTER,
    hideProgressBar: true,
    autoClose: 1000,
    closeButton: false,
    className: 'toastMsg'
    // className: 'toast'
    // bodyClassName: 'grow-font-size'
  };
  Object.assign(config, conf);
  toast[type](message, config);
}

export function copy(str, msg = '') {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  toastmessage(msg || 'Copied', 'warning', { autoClose: 1000 });
}

export function getFileExtension(file) {
  if (!file) return;
  return file.split('.').pop();
}
