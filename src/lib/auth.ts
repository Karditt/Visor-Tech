import { SignJWT, jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  import.meta.env.JWT_SECRET || "default-secret-key-change-this-in-prod",
);

const ALG = "HS256";

export async function createToken(payload: any): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("2h") // Token expires in 2 hours
    .sign(SECRET_KEY);
}

export async function verifyToken(token: string): Promise<any | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload;
  } catch (error) {
    return null;
  }
}

export const COOKIE_NAME = "admin_token";
