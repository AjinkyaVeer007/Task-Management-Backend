import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 10;

export const register = async (req, res) => {
  try {
    const { name, email, password, userType, adminId } = req.body;

    if (!name || !email || !password || !userType) {
      return res.status(400).json({
        message: "All fields are mandatory",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exist, please login",
        success: false,
      });
    }

    const encryptedPassword = await bcrypt.hash(password, saltRounds);

    await User.create({
      name,
      email,
      password: encryptedPassword,
      userType,
      adminId,
    });

    return res.status(200).json({
      message: "You have registered successfully",
      success: true,
    });
  } catch (error) {
    console.log("fail to register user", error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are mandatory",
        success: false,
      });
    }

    const user = await User.findOne({ email }).select("-createdAt -updatedAt");

    if (!user) {
      return res.status(400).json({
        message: "You need to register first",
        success: false,
      });
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      return res.status(400).json({
        message: "Password is invalid",
        success: false,
      });
    }

    const token = await jwt.sign(
      {
        _id: user._id,
      },
      process.env.TOKEN_SECRET_KEY + user._id,
      { expiresIn: process.env.TOKEN_EXPIRY }
    );

    user.token = token;
    user.password = undefined;

    const options = {
      httpOnly: true,
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    };

    return res.status(200).cookie("token", token, options).json({
      data: user,
      message: "User login successfully",
      success: true,
    });
  } catch (error) {
    console.log("fail to login user", error);
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token").status(200).json({
    message: "User logout successfully",
    success: true,
  });
};
