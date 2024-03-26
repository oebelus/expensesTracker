import { generateToken, getGoogleOAuthTokens, getGoogleUser } from "../utils"
import { Request, Response } from "express"
import { UserModel } from "../models/userModel"
import bcrypt from 'bcrypt'

export async function googleOauthHandler(req: Request, res: Response) {
    try {
        // Get the code from the query string (qs)
        const code = req.query.code as string
        
        // Get the id and the access token with the code
        const {id_token, access_token} = await getGoogleOAuthTokens({code})

        // Get the user with tokens
        const googleUser = await getGoogleUser({id_token, access_token})
        console.log("Google user: ", googleUser)
        /*jwt.decode(id_token)*/

        if (!googleUser.verified_email) {
            return res.status(403).json({error: 'Google account is not verified'})
        }

        // Upsert the user
        const salt = bcrypt.genSaltSync(10);
        let user = await UserModel.findOne({ email: googleUser.email });
        if (user) {
            res.cookie("userId", user!._id)
            res.cookie("userInfo", user)
        } else {
            user = await UserModel.create({
                email: googleUser.email,
                firstName: googleUser.given_name,
                familyName: googleUser.family_name,
                password: bcrypt.hashSync("123456789", salt),
                image: googleUser.picture,
            });
        
            // Create access & refresh tokens
            const token = generateToken(user!)

            // Set cookies
            res.cookie("token", token)
            res.cookie("userId", user!._id)
            res.cookie("userInfo", user)
        }
        // Redirect back to client
        res.redirect(`http://localhost:5173/`)

    } catch (error) {
        console.error(error, "Failed to authorize Google user")
    }
}

function signJwt() {
    throw new Error("Function not implemented.")
}
