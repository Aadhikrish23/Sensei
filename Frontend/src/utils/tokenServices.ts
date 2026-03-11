let token: string | null = null;

function setToken(newToken: string) {
  token = newToken;
  localStorage.setItem("accessToken", newToken);
}

function getToken() {
  if (!token) {
    token = localStorage.getItem("accessToken");
  }
  return token;
}

function clearToken() {
  token = null;
  localStorage.removeItem("accessToken");
}

let logoutcallback: (() => void) | null = null;

function registerLogout(cb: any) {
  logoutcallback = cb;
}

function triggerLogout() {
  if (logoutcallback) logoutcallback();
}

export default {
  setToken,
  getToken,
  clearToken,
  triggerLogout,
  registerLogout
};