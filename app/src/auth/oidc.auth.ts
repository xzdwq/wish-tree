import { type UserManagerSettings, User, UserManager, WebStorageStateStore, Log } from 'oidc-client';
import { computed, ref } from 'vue';
import api from '~/api';

// Settings
const userManager = new UserManager({
  authority: import.meta.env.OIDC_ISSUER,
  client_id: import.meta.env.OIDC_CLIENT_ID,
  response_type: 'id_token token',
  scope: 'openid profile email offline_access',
  automaticSilentRenew: true,
  monitorSession: true,
  loadUserInfo: false,
  includeIdTokenInSilentRenew: true,
  userStore: new WebStorageStateStore({
    store: localStorage,
  }),
  redirect_uri: window.location.origin + '/auth/oidc/callback',
  silent_redirect_uri: window.location.origin + '/auth/oidc/callback',
  metadata: {
    issuer: import.meta.env.OIDC_ISSUER,
    jwks_uri: import.meta.env.OIDC_JWKS_URI,
    authorization_endpoint: import.meta.env.OIDC_ISSUER + '/oauth2/authorize',
    end_session_endpoint: import.meta.env.OIDC_ISSUER + '/oauth2/logout',
    token_endpoint: import.meta.env.OIDC_TOKEN_URI,
    userinfo_endpoint: import.meta.env.OIDC_USERINFO_URI,
    code_challenge_methods_supported: ['RS256'],
  },
  revokeAccessTokenOnSignout: true,
  popup_redirect_uri: window.location.origin + '/auth/oidc/callback',
  post_logout_redirect_uri: window.location.origin + '/auth/oidc/callback',
  popup_post_logout_redirect_uri: window.location.origin + '/auth/oidc/callback',
} as UserManagerSettings);

Log.logger = console;
Log.level = Log.ERROR;

// State
export const userProfile = ref<User | null>(null);

(async () => {
  userManager.getUser().then((user) => {
    userProfile.value = user || null;
  });
})();

export const isAuthenticated = computed(() => !!userProfile.value);

// Events
userManager.events.addUserLoaded((user) => {
  userManager.storeUser(user);
  api.defaults.headers.common.Authorization = `Bearer ${user.access_token}`;
  userManager.getUser().then((getUser) => {
    userProfile.value = getUser;
  });
});

const isRenew = true;
userManager.events.addAccessTokenExpiring(async () => {
  if (isRenew) {
    await userManager.signinSilent();
  } else {
    userManager.signoutRedirect();
  }
});

// Methods
export class AuthService {
  public static getUser(): Promise<User | null> {
    return userManager.getUser();
  }

  public static async login(): Promise<void> {
    return userManager.signinRedirect();
  }

  public static async loginPopup(): Promise<void> {
    userManager.signinPopup().then(() => {
      window.location.href = '/';
    });
  }

  public static loginCallback(): Promise<User | undefined> {
    return userManager.signinRedirectCallback();
  }

  public static loginCallbackPopup(): Promise<User | undefined> {
    return userManager.signinPopupCallback();
  }

  public static logout(): void {
    localStorage.clear();
    sessionStorage.clear();
    void userManager
      .signoutRedirect()
      .then(() => {
        window.location.href = window.location.origin;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  public static logoutPopup(): Promise<void> {
    userProfile.value = null;
    return userManager.signoutPopup();
  }

  public static async logoutPopupCallback(): Promise<void> {
    userManager.signoutPopupCallback();
  }

  public static loginSilentCallback(): Promise<User | undefined> {
    return userManager.signinSilentCallback();
  }
}
