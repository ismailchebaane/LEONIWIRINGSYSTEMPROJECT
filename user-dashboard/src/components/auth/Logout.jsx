// ✅ CORRECT for default export
const Logout = () => {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
  window.location.href = "/";
  return null;
};

export default Logout;
