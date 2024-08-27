import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel"
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

connect()

export async function POST(request: NextRequest) {
    try {
        const reqbody = await request.json()
        const { email, password } = reqbody;
        //validation

        const user = await User.findOne({ email })
        if (!user) {
            return NextResponse.json({
                error: "User does not exist"
            }, { status: 400 }
            )
        }

        const validPassword = await bcryptjs.compare(password, user.password)
        if (!validPassword) {
            return NextResponse.json({
                error: "Invalid Password"
            }, { status: 400 }
            )
        }

        const tokenData = {
            id: user._id.toString(),
            email: user.email,
            username: user.username
        }
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1d" })

        const response = NextResponse.json({
            message: "Loged In successfully",
            success: true,
            token
        }, { status: 200 })
        
        response.cookies.set("token", token, {
            httpOnly: true
        })
        return response
    } catch (error: any) {
        return NextResponse.json({
            error: error.message
        }, { status: 500 })
    }
} 
