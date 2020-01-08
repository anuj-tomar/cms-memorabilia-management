import { getHostConfig } from './config';


export const ErrorCode = {
  SOMETHING_WRONG: 999
};

export const Endpoint = {
  AUTH: 'auth/token',
  USER_LOGIN: 'cms/login',
  MEMBER: 'cms/member-manage',
  STAF_MEMBER: 'cms/staff-manage',
  EVENT_MANAGE: 'cms/event-manage',
  EVENT_CAT: 'common/event-category',
  IDEAS_MANAGE: 'cms/aioi-manage',
  QSPECIAL_MANAGE: 'cms/qspecial-manage',
  QSPECIAL_CATEGORIES: 'cms/qspecial-categories',
  RESERVATION_TYPE: 'cms/reservation-type',
  RESERVATION: 'cms/reservation-manage',
  RESERVATION_LIST: 'cms/reservation-list',
  LOCATION: 'common/location',
  GLOBAL_ACCESS: 'cms/global-access-manage',
  MEDIA_UPLOAD: 'common/media-upload',
  CHECKIN_MEMBER: 'cms/checkin-member',
  CHECKIN_GUEST: 'cms/checkin-guest',
  GUEST_MANAGE: 'cms/guest-manage',
  MODULE_MANAGE: 'cms/module-manage',
  CLUB_MANAGE: 'cms/club-manage',
  INIVITE_LINK: 'member/guest-invite-data/1',
  LOGOUT: 'cms/logout',
  MEMBER_CATEGORIES: 'cms/membership-categories',
  AUTOSUGGETIONS: 'common/auto-suggestion',
  UPLOAD: 'common/media-upload'
};

export const ROUTER_MAPPER = {
  admin_roles_access: "/member",
  an_india_of_ideas: "/indiaofideas",
  //check_in_a_member: "/",
  edit_member_details: "/member-list/member",
  events: "/events",
  golbal_access: "/global-access",
  invite_a_guest: "/invite-guests",
  //make_a_reseravtion: "/make-reservation",
  q_shop: "/",
  q_specials: "/Qspecial",
  q_whats_app: "/",
  take_away: "/",
  view_checked_in_member: "/checkin",
  guest_managenet: "/view-guest",
  view_reservations: "/reservation",
}

export const NOT_FOUND_PAGE = '/407';

export const NOT_ACCESSIBLE_PAGE = '/login';

export const cookieExpiry = 365;
export const cookieName = 'token';

export const MobileMinWidth = 320;
export const MobileMaxWidth = 767;

export const TabletMinWidth = 768;
export const TabletMaxWidth = 1023;

export const DesktopMinWidth = 1024;

export const Messages = {
  API_BROKEN: 'Api call is broken, fix the Api service',
  INVALID_FORM_VALUES: 'Invalid Form Fields',
  LOGIN_FAILED: 'Login Failed',
  DELETE_REPORT_FAILED: 'Report did not delete successfully',
  DELETE_REPORT_SUCCESS: 'Report deleted successfully!',
  REPORT_SAVE_SUCCESS: 'Report saved successfully!',
  REPORT_SAVE_FAILED: 'Report did not save successfully!'
};

export function checkIfMobile() {
  if (navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
  ) {
      return true;
  } else {
      return false;
  }
}

export function getFileExtension(file) {
  if (!file) return;
  return file.split('.').pop();
}

export const IMAGE_BOX_SIZE = {
  project_list: {
      h: 260,
      w: 463
  },
  project_media: {
      h: 338,
      w: 600
  },
  projetc_image: {
      w: 754,
      h: 424
  },
  common: {
      h: 213,
      w: 160
  },
  deck_media: {
      h: 338,
      w: 600
  },
  deck_slider: {
      h: 814,
      w: 1448
  }
}

export const MEMBERTYPE = {
  1: 'Permanent',
  2: 'Local'
}

export const ALTERNATE_CONTACTTYPE = {
  1: 'Family',
  2: 'P. Assistant',
  3: 'None'
}

export const MEMBER_TITLE = {
  'm': 'Mr.',
  'f': 'Mrs.',
  'o': 'Ms.'
}

export const MERITAL_STATUS = {
  'm1': 'Married.',
  'p': 'Partnered.',
  's': 'Single.'
}

export const GENDER = {
  'm': 'Male',
  'f': 'Female',
  'c': 'Company'
}

export const CLEARANCE_LEVEL = {
  1: 'Family',
  2: 'P. Assistant',
  3: 'None'
}

export const HOBBIES = ["MUSIC", "LITERATURE", "ENVIRONMENT", "CINEMA", "TRAVEL", "FOOD", "THEATRE", "SPORTS", "FITNESS", "WINE/SPRIT", "TASTING", "TECHNOLOGY", "POLITICS", "NEW ECONOMY", "DESIGN/ARCHITECTURE", "ART/EXHIBITION"]

// http://aphrocms.slike.in:88 //http://api.klugcms.in:99
export const HOST_CONFIG = getHostConfig();
export const API_BASE_PATH = HOST_CONFIG['API_BASE_PATH'];
