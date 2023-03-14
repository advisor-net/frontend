// TODO: switch to session auth and drop JWT token auth
// Short duration JWT token
export const getJwtToken = () => localStorage.getItem('access');
export const setJwtToken = (token) => {
  localStorage.setItem('access', token);
};
export const removeJwtToken = () => localStorage.removeItem('access');

// Longer duration refresh token
export const getRefreshToken = () => localStorage.getItem('refresh');
export const setRefreshToken = (token) => {
  localStorage.setItem('refresh', token);
};
export const removeRefreshToken = () => localStorage.removeItem('refresh');

// TODO: spin up redux and store this in memory, and not in local storage
export const getSessionUser = () => {
  return {
    uuid: localStorage.getItem('uuid'),
    id: localStorage.getItem('userId'),
    email: localStorage.getItem('email'),
    chatUsername: localStorage.getItem('chatUsername'),
    chatUserSecret: localStorage.getItem('chatUserSecret'),
    chatAgreedToTerms: localStorage.getItem('chatAgreedToTerms'),
  };
};
export const setSessionUser = (user) => {
  localStorage.setItem('uuid', user.uuid);
  localStorage.setItem('userId', user.id);
  localStorage.setItem('email', user.email);
  if (user.chatUser) {
    localStorage.setItem('chatUsername', user.chatUser.username);
    localStorage.setItem('chatUserSecret', user.chatUser.password);
    localStorage.setItem('chatAgreedToTerms', user.chatUser.agreedToTerms ? true : '');
  }
};
export const removeSessionUser = () => {
  localStorage.removeItem('uuid');
  localStorage.removeItem('userId');
  localStorage.removeItem('email');
};
