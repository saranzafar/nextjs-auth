import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function POST(request: NextRequest) {
    try {
        // Extract data from token
        const userId = await getDataFromToken(request);

        // Find user and exclude the password field
        const user = await User.findOne({ _id: userId })
            .select("-password")
            .lean();//This method returns a plain JavaScript object instead of a Mongoose document, avoiding circular references.
        if (!user) {
            return NextResponse.json({
                status: false,
                message: "User not found",
            }, { status: 404 });
        }

        return NextResponse.json({
            message: "User found",
            data: user
        });
    } catch (error: any) {
        return NextResponse.json({
            error: error.message
        }, { status: 500 });
    }
}
