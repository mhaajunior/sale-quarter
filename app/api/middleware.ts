import { Role } from "@prisma/client";
import { jwtDecode } from "jwt-decode";

export const validateUserRole = (token: string, role: Role[]) => {
  if (!token) return false;

  const decoded: any = jwtDecode(token);
  if (!role.includes(decoded.role)) {
    return false;
  }

  return true;
};

export const getUserRole = (token: string) => {
  if (!token) return false;

  const decoded: any = jwtDecode(token);
  return decoded.role;
};
