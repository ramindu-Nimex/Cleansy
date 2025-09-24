import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

// sign up API
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json("User Signup successfully");
  } catch (error) {
    next(error);
  }
};

// sign up API - Vulnerable Version
export const signupVulnerable = async (req, res, next) => {
  const { username, email, password, profilePicture } = req.body;

  if (!username || !email || !password) {
    return next(errorHandler(400, "All fields are required"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  //  Vulnerable: profilePicture stored without validation
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    profilePicture,
  });

  try {
    await newUser.save();
    res.json("User Signup successfully");
  } catch (error) {
    next(error);
  }
};

// sign in API
export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(400, "User not found"));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }

    const token = jwt.sign(
      {
        id: validUser._id,
        Username: validUser.username,
        isAdmin: validUser.isAdmin,
        isUserAdmin: validUser.isUserAdmin,
        isPropertyAdmin: validUser.isPropertyAdmin,
        isVisitorAdmin: validUser.isVisitorAdmin,
        isAnnouncementAdmin: validUser.isAnnouncementAdmin,
        isBookingAdmin: validUser.isBookingAdmin,
        isStaffAdmin: validUser.isStaffAdmin,
        isBillingAdmin: validUser.isBillingAdmin,
        isFacilityAdmin: validUser.isFacilityAdmin,
        isFacilityServiceAdmin: validUser.isFacilityServiceAdmin,
        isStaff: validUser.isStaff,
      },
      process.env.JWT_SECRET
    );

    const { password: pass, ...rest } = validUser._doc;
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// google sign in API
export const google = async (req, res, next) => {
  const { email, name, googlePhotoURL } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id, Username: user.username, isAdmin: user.isAdmin, isUserAdmin: user.isUserAdmin, isPropertyAdmin: user.isPropertyAdmin, isVisitorAdmin: user.isVisitorAdmin, isAnnouncementAdmin: user.isAnnouncementAdmin, isBookingAdmin: user.isBookingAdmin, isStaffAdmin: user.isStaffAdmin, isBillingAdmin: user.isBillingAdmin, isFacilityAdmin: user.isFacilityAdmin, isFacilityServiceAdmin: user.isFacilityServiceAdmin }, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;
      res.status(200).cookie('access_token', token, {
        httpOnly: true,
      }).json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoURL,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id, Username: newUser.username, isAdmin: newUser.isAdmin, isUserAdmin: newUser.isUserAdmin, isPropertyAdmin: newUser.isPropertyAdmin, isVisitorAdmin: newUser.isVisitorAdmin, isAnnouncementAdmin: newUser.isAnnouncementAdmin, isBookingAdmin: newUser.isBookingAdmin, isStaffAdmin: newUser.isStaffAdmin, isBillingAdmin: newUser.isBillingAdmin, isFacilityAdmin: newUser.isFacilityAdmin, isFacilityServiceAdmin: newUser.isFacilityServiceAdmin }, process.env.JWT_SECRET);
      const { password, ...rest } = newUser._doc;
      res.status(200).cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      }).json(rest);
    }
  } catch (error) {
    next(error);
  }
}

// A vulnerable version of the google sign-in function
export const googleVuln = async (req, res, next) => {
  const { email } = req.body;
  try {
    //  Unsafe: directly using user input in MongoDB query
    const user = await User.findOne({ email, profilePicture: req.body.googlePhotoURL });
    if (user) {
      res.json({ success: true, message: "Logged in!" });
    } else {
      res.json({ success: false, message: "User not found" });
    }
  } catch (err) {
    next(err);
  }
};


export const signInQR = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    const token = jwt.sign({ id: user._id, Username: user.username, isAdmin: user.isAdmin, isUserAdmin: user.isUserAdmin, isPropertyAdmin: user.isPropertyAdmin, isVisitorAdmin: user.isVisitorAdmin, isAnnouncementAdmin: user.isAnnouncementAdmin, isBookingAdmin: user.isBookingAdmin, isStaffAdmin: user.isStaffAdmin, isBillingAdmin: user.isBillingAdmin, isFacilityAdmin: user.isFacilityAdmin, isFacilityServiceAdmin: user.isFacilityServiceAdmin }, process.env.JWT_SECRET);
    const { password, ...rest } = user._doc;
    res.status(200).cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    }).json(rest);

  } catch (error) {
    next(error);
  }
}
