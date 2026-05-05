export const setUser = (user) => {
  if (!user) return; 
  
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = () => {
  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : null;
};

export const logout = () => {
  localStorage.removeItem("user");
};