const ADSRUN_TOKEN_KEY = 'adsrun_token'

export const getToken = () => {
  return window.localStorage.getItem(ADSRUN_TOKEN_KEY)
};

export const saveToken = token => {
  window.localStorage.setItem(ADSRUN_TOKEN_KEY, token)
};

export const destroyToken = () => {
  window.localStorage.removeItem(ADSRUN_TOKEN_KEY)
};

export const saveInfo = (KEY, VAL) => {
  window.localStorage.setItem(KEY, VAL)
};

export const getInfo = KEY => {
  return window.localStorage.getItem(KEY)
};

export const removeInfo = KEY => {
  window.localStorage.removeItem(KEY)
};

export default { getToken, saveToken, destroyToken, saveInfo, getInfo, removeInfo }
