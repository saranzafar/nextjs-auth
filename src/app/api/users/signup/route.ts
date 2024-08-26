import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel"
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import { sendEmail } from "@/helpers/mailer";

connect()
// .../api/users/signup  
export async function POST(request: NextRequest) {
    try {
        const reqbody = await request.json()
        const { username, email, password } = reqbody;
        //validation

        const user = await User.findOne({ email })
        if (user) {
            return NextResponse.json({
                error: "User already exist"
            }, { status: 400 }
            )
        }

        let salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })
        const savedUser = await newUser.save()
        console.log("savedUser: ", savedUser);

        // send verification meail
        await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id })


        return NextResponse.json({
            message: "User registered successfully",
            success: true,
            savedUser
        })
    } catch (error: any) {
        console.log("Error: ", error);
        return NextResponse.json({
            error: error.message
        }, { status: 500 })
    }
}