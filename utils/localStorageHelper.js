import { v4 as uuidv4 } from 'uuid';

export const getOrCreateUserToken = () => {
  if (typeof window === "undefined") return null;

  let token = localStorage.getItem('finance_user_token');
  if (!token) {
    token = uuidv4();
    localStorage.setItem('finance_user_token', token);
  }
  return token;
};