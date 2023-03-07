// TODO: switch to session auth and drop JWT token auth
// Short duration JWT token
export const getJwtToken = () => localStorage.getItem('access');
export const setJwtToken = token => {
  localStorage.setItem('access', token);
};
export const removeJwtToken = () => localStorage.removeItem('access');

// Longer duration refresh token
export const getRefreshToken = () => localStorage.getItem('refresh');
export const setRefreshToken = token => {
  localStorage.setItem('refresh', token);
};
export const removeRefreshToken = () => localStorage.removeItem('refresh');

export const getUserUuid = () => localStorage.getItem('userUuid');
export const setUserUuid = uuid => localStorage.setItem('userUuid', uuid);
export const removeUserUuid = () => localStorage.removeItem('userUuid');

export const getMetroArea = () => localStorage.getItem('metro');
export const setMetroArea = metro => localStorage.setItem('metro', metro);
export const removeMetroArea = () => localStorage.removeItem('metro');
