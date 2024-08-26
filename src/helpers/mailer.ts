import User from "@/models/userModel";
import nodemailer from "nodemailer"
import bcryptjs from "bcryptjs"

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {

        const hashedToken = await bcryptjs.hash(userId.toString(), 10)

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId,
                {
                    $set: { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000 }
                })
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId,
                {
                    $set: { forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000 }
                })
        }
        let transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "5de12d62758e2b",
                pass: "362e4a4fbfb74b"
            }
        });

        const mailOptions = {
            from: 'saran.development@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Please Verify Your Email Address" : "Password Reset Request",
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #2a9d8f;">${emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password"}</h2>
                    <p>
                        Hello,
                    </p>
                    <p>
                        To ${emailType === "VERIFY" ? "verify your email address" : "reset your password"}, please click the link below:
                    </p>
                    <p>
                        <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}" 
                            style="color: #e76f51; text-decoration: none;">
                            ${emailType === "VERIFY" ? "Verify Email" : "Reset Password"}
                        </a>
                    </p>
                    <p>
                        If the above link doesn't work, please copy and paste the following URL into your browser:
                    </p>
                    <p style="word-break: break-all;">
                        ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
                    </p>
                    <p>
                        Thank you,<br>
                        The Team
                    </p>
                </div>
            `,
        };

        const mailResponse = await transport.sendMail(mailOptions)
        return mailResponse;
    } catch (error: any) {
        throw new Error(error.message)
    }
}