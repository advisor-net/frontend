// Short duration JWT token
export const getJwtToken = () => sessionStorage.getItem('access');
export const setJwtToken = (token) => {
  sessionStorage.setItem('access', token);
};
export const removeJwtToken = () => sessionStorage.removeItem('access');

// Longer duration refresh token
export const getRefreshToken = () => sessionStorage.getItem('refresh');
export const setRefreshToken = (token) => {
  sessionStorage.setItem('refresh', token);
};
export const removeRefreshToken = () => sessionStorage.removeItem('refresh');

export const getUserUuid = () => sessionStorage.getItem('userUuid');
export const setUserUuid = (uuid) => sessionStorage.setItem('userUuid', uuid);
export const removeUserUuid = () => sessionStorage.removeItem('userUuid');
