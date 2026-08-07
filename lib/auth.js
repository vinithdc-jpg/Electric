import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
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