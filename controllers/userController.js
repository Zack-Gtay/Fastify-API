import bcrypt from "bcrypt";
import User from "../model/User.js";
import jwt from "jsonwebtoken";

// function to handle user creation
export const createUser = async (req, reply) => {
  try {
    const { name, email, password } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return reply.send({ success: false, msg: "Please fill all fields" });
    }

    // Check if email already exists
    const isEmailTaken = await User.findOne({ email });
    if (isEmailTaken) {
      return reply.send({ success: false, msg: "Email already exists" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    const savedUser = await newUser.save();
    if (savedUser) {
      reply.send({ success: true, msg: "User created successfully" });
    } else {
      reply.send({ success: false, msg: "Server error" });
    }
  } catch (error) {
    reply.send({ success: false, msg: `Error: ${error.message}` });
  }
};

// function to handle user login
export const loginUser = async (req, reply) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return reply.send({ success: false, msg: "Please fill all fields" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return reply.send({ success: false, msg: "Invalid email or password" });
    }

    // Compare password with hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {
      const payload = { user_id: user._id };

      // Generate JWT token
      const token = jwt.sign({ payload }, process.env.SECRET_KEY, { expiresIn: "1h" });
      reply.send({ success: true, msg: "Login successful", token });
    } else {
      reply.send({ success: false, msg: "Invalid email or password" });
    }
  } catch (error) {
    reply.send({ success: false, msg: `Error: ${error.message}` });
  }
};

// Controller function to get user profile by token
export const getUserProfile = async (req, reply) => {
  try {
    const token = req.headers.authorization.split(" ")[1];  // Get the token from the header
    const { payload } = jwt.verify(token, process.env.SECRET_KEY);  // Verify and decode the token

    // Find user by ID
    const user = await User.findById(payload.user_id);
    if (!user) {
      return reply.status(404).send({ success: false, msg: "User not found" });
    }

    reply.send({ success: true, user });
  } catch (error) {
    reply.status(401).send({ success: false, msg: "Unauthorized" });
  }
};
