import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "default-secret-key-change-in-prod";

export function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role || "USER",
      status: user.status || "APPROVED",
    },
    SECRET,
    {
      expiresIn: "7d",
    }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}