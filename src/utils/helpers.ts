export const getOS = function() {
  var userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
    windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
    iosPlatforms = ['iPhone', 'iPad', 'iPod'],
    os = '';

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux';
  }

  return os;
};

export const getBrowser = function() {
  var test = function(regexp: any) {
    return regexp.test(window.navigator.userAgent);
  };
  switch (true) {
    case test(/edg/i):
      return 'Microsoft Edge';
    case test(/trident/i):
      return 'Microsoft Internet Explorer';
    case test(/firefox|fxios/i):
      return 'Mozilla Firefox';
    case test(/opr\//i):
      return 'Opera';
    case test(/ucbrowser/i):
      return 'UC Browser';
    case test(/samsungbrowser/i):
      return 'Samsung Browser';
    case test(/chrome|chromium|crios/i):
      return 'Google Chrome';
    case test(/safari/i):
      return 'Apple Safari';
    default:
      return 'Other';
  }
};

export const getAccessToken = () => {
  const LS_KEY = 'dln:auth';
  const auth = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
  const { accessToken } = auth;

  return accessToken;
};
