export const getLocalToken = () => {
  return localStorage.getItem('token');
}

export const setLocalToken = (token) => {
  return localStorage.setItem('token', token);
}

export const removeLocalToken = () => {
  return localStorage.removeItem('token');
}

export const getLocalRefreshToken = () => {
  return localStorage.getItem('refresh_token');
}

export const setLocalRefreshToken = (token) => {
  return localStorage.setItem('refresh_token', token);
}

export const removeLocalRefreshToken = () => {
  return localStorage.removeItem('refresh_token');
}

export const getUserName = () => {
  return localStorage.getItem('username');
}

export const setUserName = (username) => {
  return localStorage.setItem('username', username);
}

export const removeUserName = () => {
  return localStorage.removeItem('username');
}
