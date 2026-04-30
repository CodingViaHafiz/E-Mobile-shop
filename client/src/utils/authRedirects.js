export const getRoleHomePath = (userOrRole) => {
  const role =
    typeof userOrRole === "string" ? userOrRole : userOrRole?.role;

  return role === "admin" ? "/admin" : "/";
};
