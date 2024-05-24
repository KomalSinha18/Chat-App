import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt

        if (!token) {
            res.status(500).json({
                error: "Unauthorized - No Token Provided"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            res.status(500).json({
                error: "Unauthorized - Invalid Token"
            })
        }

        const user = await User.findById(decoded.userId).select("-password")

        if (!user) {
            res.status(500).json({
                error: "User not found"
            })
        }

        req.user = user

        next()
    } catch (error) {
        console.log("Error in protectRoute middelware", error.message);
        res.status(500).json({
            error: "Internal Server error"
        })
    }
}

export default protectRoute