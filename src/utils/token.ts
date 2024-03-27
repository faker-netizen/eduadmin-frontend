/* 使用localStorage存储token */

let token = localStorage.getItem('token');

export const getJwtToken = () => {
  return token;
};

export const setJwtToken = (newToken: string) => {
  token = newToken;
  localStorage.setItem('token', newToken);
};
