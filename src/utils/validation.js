import { regexPatterns } from './regex';

function getRegx(regex, regexType) {
  if (typeof regex === 'string') {
    return new RegExp(regex);
  } else if (regex instanceof RegExp) {
    return regex;
  } else if (regexType && regexType in regexPatterns) {
    return regexPatterns[regexType];
  } else {
    return regexPatterns['noop'];
  }
}

const validator = {
  text: (label, value, { regex, errorMsg, regexType = 'noop' }) => {
    const regexTest = getRegx(regex, regexType).test(value);
    if (!value || value.toString().trim() === '') {
      return {
        isValid: false,
        errorMsg: errorMsg || 'This filed is required.'
      };
    } else if (regexTest === false) {
      return {
        isValid: false,
        errorMsg: errorMsg || `This value is invalid.`
      };
    } else {
      return {
        isValid: true,
        errorMsg: ''
      };
    }
  },
  file: (label, value, { regex, errorMsg, regexType = 'noop' }) => {
    const regexTest = getRegx(regex, regexType).test(value);
    if (!value) {
      return {
        isValid: false,
        errorMsg: errorMsg || `${label} is empty`
      };
    } else if (value.split('.')[1] != 'aac') {
      return {
        isValid: false,
        errorMsg: 'Only aac files are allowed'
      };
    }
    return {
      isValid: true,
      errorMsg: ''
    };
  }
};

export function validate(label, value, validation) {
  return validator[validation.type](label, value, validation);
}
export function handleError(data) {
  let error = '';
  Object.keys(data).forEach(function(key) {
    error += data[key] + '.\n';
  });
  return error;
}
