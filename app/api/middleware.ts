import { Role } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";

export const validateUserRole = (token: string, role: Role[]) => {
  if (!token) return false;

  const decoded: JwtPayload = jwtDecode(token);
  if (!role.includes(decoded.role)) {
    return false;
  }

  return true;
};

export const getUserRole = (token: string) => {
  if (!token) return false;

  const decoded: JwtPayload = jwtDecode(token);
  return decoded.role;
};
