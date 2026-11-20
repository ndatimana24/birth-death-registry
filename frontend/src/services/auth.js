const KEY = "registry_user";

export const saveUser = (user) => {
  localStorage.setItem(KEY, JSON.stringify(user));
};

export const getUser = () => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem(KEY);
};

export const isLoggedIn = () => {
  return getUser() !== null;
};