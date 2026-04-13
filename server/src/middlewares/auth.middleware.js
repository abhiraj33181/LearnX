import { verifyToken } from "../utils/jwt.utils.js";


export const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(" ")[1]
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not Authorised."
            })
        }

        try {
            const decoded = verifyToken(token);
            req.user = decoded.userId;

            next()
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Not authorised or invalid token"
            })
        }
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Not authorised or invalid token"
        })
    }
}