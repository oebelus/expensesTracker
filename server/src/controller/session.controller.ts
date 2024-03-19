import { generateToken, getGoogleOAuthTokens, getGoogleUser } from "../utils"
import { Request, Response } from "express"
import { UserModel } from "../models/userModel"

export async function googleOauthHandler(req: Request, res: Response) {
    try {
        // Get the code from the query string (qs)
        const code = req.query.code as string
        
        // Get the id and the access token with the code
        const {id_token, access_token} = await getGoogleOAuthTokens({code})

        // Get the user with tokens
        const googleUser = await getGoogleUser({id_token, access_token})
        /*jwt.decode(id_token)*/

        if (!googleUser.verified_email) {
            return res.status(403).send('Google account is not verified')
        }

        // Upsert the user
        const user = await UserModel.findOneAndUpdate(
            {
                email: googleUser.email,
            }, {
                email: googleUser.email,
                firstName: googleUser.given_name,
                familyName: googleUser.family_name,
                image: googleUser.picture
            }, {
                upsert: true,
                new: true
            }
        )
        console.log(user)

        // Create access & refresh tokens
        const token = generateToken(user!)

        // Set cookies
        res.cookie("token", token)
        res.cookie("userId", user!._id)
        res.cookie("userInfo", user)

        // Redirect back to client
        res.redirect(`http://localhost:5173/${user!._id}/dashboard`)

    } catch (error) {
        console.error(error, "Failed to authorize Google user")
    }
}

function signJwt() {
    throw new Error("Function not implemented.")
}
