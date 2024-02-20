import { Role } from "@/types/dto/role";
import { JwtPayload } from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import CryptoES from "crypto-es";

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

export const validateApiKey = (key: string) => {
  const hash = CryptoES.SHA256(key).toString();
  return hash === process.env.NEXT_PUBLIC_API_KEY_HASH;
};
