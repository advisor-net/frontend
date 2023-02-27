// Short duration JWT token
export const getJwtToken = () => sessionStorage.getItem('access');

export const setJwtToken = (token) => {
  sessionStorage.setItem('access', token);
};

// Longer duration refresh token
export const getRefreshToken = () => sessionStorage.getItem('refresh');

export const setRefreshToken = (token) => {
  sessionStorage.setItem('refresh', token);
};

export const removeJwtToken = () => sessionStorage.removeItem('access');

export const removeRefreshToken = () => sessionStorage.removeItem('refresh');
