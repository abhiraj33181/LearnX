import userModel from "../models/user.model.js";
import { generateToken } from "../utils/jwt.utils.js";


/**
 * @desc Register a new user
 * @route POST /api/user/register
 * @access Public
 */
export const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        console.log(name, email, password)
        if (!name || !email || !password) {
            return res.status(400).json({
                success : false,
                message : "name, email and password is required"
            })
        }

        const userExist = await userModel.findOne({email})

        if (userExist) {
            return res.status(409).json({
                success : false,
                message : "User already registered"
            })
        }

        const user = await userModel.create({
            name,
            email,
            password
        })

        // generate token 
        const token = generateToken(user._id)

        res.status(201).json({
            success : true,
            message : "User created successfully!",
            data : {
                user,
                token
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success : false,
            message : error.message
        })
    }
}


/**
 * @desc Login user
 * @route POST /api/user/login
 * @access Public
 */
export const loginUser = async (req, res) => {
        try {
            const {email, password} = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success : false,
                    message : "email and password is required"
                })
            }

            const user = await userModel.findOne({email}).select("+password")

            if (!user) {
                return res.status(404).json({
                    success : false,
                    message : "Invalid email or password"
                })
            }

            const isPasswordMatch = await user.comparePassword(password)

            if (!isPasswordMatch) {
                return res.status(404).json({
                    success : false,
                    message : "Invalid email or password"
                })
            }

            // generate token
            const token = generateToken(user._id)

            res.status(200).json({
                success : true,
                message : "User logged in successfully!",
                data : {
                    user,
                    token
                }
            })
            
        } catch (error) {
            console.log(error)
            res.status(500).json({
                success : false,
                message : error.message
            })
        }
}

/**
 * @desc Get user profile
 * @route GET /api/user/profile
 * @access Private
 */
export const getMe = async (req, res) => {
    try {
        const userId = req.user;

        const user = await userModel.findById(userId)

        if (!user) {
            return res.status(401).json({
                success : false,
                message : "Unauthorized access"
            })
        }

        res.status(200).json({
            success : true,
            message : "User profile fetched successfully!",
            data : user
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message
        })
    }
}