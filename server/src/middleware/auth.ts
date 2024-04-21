import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.header("Authorization")
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ success: false, message: "Invalid authorization header" });
    }
    const token = authorizationHeader.replace("Bearer ", "")
    console.log("Token", token);
    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: "Authorization token not found" });
    }
    try {
        const decoded = jwt.verify(token, (process.env as any).ACCESS_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
            console.error(err);
            return res.status(401).json({ success: false, message: "Invalid token" });
    }
};

export default authMiddleware;