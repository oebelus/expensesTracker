import { User } from "../models/userModel"
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import axios from 'axios'
import qs from 'qs'
import crypto from "crypto"

dotenv.config()

const ACCESS_SECRET = process.env.ACCESS_SECRET
const REFRESH_SECRET = process.env.REFRESH_SECRET

export const generateAccess = (user: User, session: Session) => {
    return jwt.sign(
        {
            sessionId: session.sessionId,
            firstName: user.firstName,
            familyName: user.familyName,
            email: user.email,
        },
        ACCESS_SECRET || 'sdSDFSF546516àééééèè-+',
        {
            expiresIn: '15m'
        }
    )
}

export const generateRefresh = (user: User, session: Session) => {
    return jwt.sign(
        {
            sessionId: session.sessionId,
            firstName: user.firstName,
            familyName: user.familyName,
            email: user.email
        },
        REFRESH_SECRET || 'sdSDFSF546516àééééèè-+',
        {
            expiresIn: '30d'
        }
    )
}

export function generateKeys(): string {
    return crypto.randomBytes(16).toString('base64');
}

interface GoogleTokensResult {
    access_token: string;
    expires_in: Number;
    refresh_token: string;
    scope: string;
    id_token: string;
  }

export async function getGoogleOAuthTokens({code}: {code: string}): Promise<GoogleTokensResult> {
    const url = 'https://oauth2.googleapis.com/token'

    const values = {
        code,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: 'http://localhost:4000/users/api/sessions/oauth/google',
        grant_type: 'authorization_code'
    }

    try {
        const res = await axios.post<GoogleTokensResult>(url, qs.stringify(values), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        return res.data
    } catch (error: any) {
        console.error(error.response.data.error)
        throw new Error(error.message)
    }
}

interface GoogleUserResult {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
}

interface getGoogleUserProps {
    id_token: string;
    access_token: string;
}

export async function getGoogleUser({id_token, access_token}: getGoogleUserProps): Promise<GoogleUserResult> {
    try {
        const res = await axios.get<GoogleUserResult>(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
            {
                headers: {
                Authorization: `Bearer ${id_token}`,
                },
            }
        )
        return res.data;
    } catch (error: any) {
        console.error(error)
        throw new Error(error.message);
    }
}