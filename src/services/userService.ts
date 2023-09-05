import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {
  AuthUserDetails,
  TokenType,
  UserDetails,
} from "../types/controllerTypes.js";
import { JWT_SECRET, REFRESH_JWT_SECRET } from "../config/index.js";

export const findUser = async (id: string) => User.findByPk(id);

export const createOrFindUser = async (userName: string, password: string) => {
  const [user, created] = await User.findOrCreate({
    where: { userName },
    defaults: { password: await bcrypt.hash(password, 10) },
  });

  const userDetails: UserDetails = user.dataValues;

  if (created) return { ...userDetails, isCreated: true };

  const isValidPassword = await checkValidPassword(
    password,
    userDetails.password
  );

  if (!isValidPassword) return null;

  return { ...userDetails, isCreated: false };
};

export const checkValidPassword = async (
  password: string,
  savedPassword: string
) => bcrypt.compare(password, savedPassword);

export const verifyToken = (
  token: string,
  tokenType: TokenType,
  details?: AuthUserDetails
) => {
  const secret =
    tokenType === "normal"
      ? JWT_SECRET && details && JWT_SECRET + details.id
      : REFRESH_JWT_SECRET && REFRESH_JWT_SECRET;

  if (!secret) return null;

  return jwt.verify(token, secret);
};

export const generateToken = (details: AuthUserDetails) =>
  JWT_SECRET &&
  jwt.sign(
    {
      ...details,
      password: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    },
    JWT_SECRET + details.id,
    {
      expiresIn: "1d",
    }
  );

export const generateRefreshToken = (id: string) =>
  REFRESH_JWT_SECRET &&
  jwt.sign({ id }, REFRESH_JWT_SECRET, {
    expiresIn: "7d",
  });
