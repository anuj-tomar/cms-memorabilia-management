export function createCookie(name, value, expires, path, domain) {
  let cookie = `${name}=${escape(value)};`;

  if (expires) {
    // If it's a date
    if (expires instanceof Date) {
      // If it isn't a valid date
      if (Number.isNaN(expires.getTime())) {
        expires = new Date();
      }
    } else {
      expires = new Date(new Date().getTime() + expires * 1000 * 60 * 60 * 24);
    }

    cookie += `expires=${expires.toGMTString()};`;
  }

  if (path) {
    cookie += `path=${path};`;
  }
  if (domain) {
    cookie += `domain=${domain};`;
  }

  document.cookie = cookie;
}

export function getCookie(name) {
  const regexp = new RegExp(`(?:^${name}|;\\s*${name})=(.*?)(?:;|$)`, 'g');
  const result = regexp.exec(document.cookie);
  return result === null ? null : result[1];
}

export function eraseCookie(name) {
  createCookie(name, '', -1);
}
