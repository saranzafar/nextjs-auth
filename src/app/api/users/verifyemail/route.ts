import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel"
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import { sendEmail } from "@/helpers/mailer";

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { token } = reqBody
        console.log("TOKEN: ", token);
        if (!token) {
            return NextResponse.json({
                error: "Token not found"
            }, { status: 404 }
            )
        }

        const user = await User.findOne({ verifyToken: token, verifyTokenExpiry: { $gt: Date.now() } })//$gt meansgreater then
        if (!user) {
            return NextResponse.json({
                error: "Invalid token"
            }, { status: 400 })
        }
        user.isVerified = true
        user.verifyToken = undefined
        user.verifyTokenExpiry = undefined
        await user.save()
        return NextResponse.json({
            message: "Email verified successfully",
            success: true
        }, { status: 400 })
    } catch (error: any) {
        return NextResponse.json({
            error: error.message
        }, { status: 500 })
    }
}