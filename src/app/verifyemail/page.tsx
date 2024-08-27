"use client"

import axios from 'axios'
import React, { useEffect, useState } from 'react'

function VerifyEmailPage() {
    const [token, setToken] = useState("")
    const [verified, setVerified] = useState(false)
    const [error, setError] = useState(false)

    const verifyUserEmail = async () => {
        try {
            await axios.post("/api/users/verifyemail", { token })
            setVerified(true)
        } catch (error: any) {
            setError(true)
        }
    }

    useEffect(() => {
        const urlToken = new URLSearchParams(window.location.search).get('token')
        setToken(urlToken || "")
    }, [])

    useEffect(() => {
        if (token.length > 0) {
            verifyUserEmail()
        }
    }, [token])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                {verified ? (
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-green-600">Email Verified!</h2>
                        <p className="mt-4 text-gray-600">Your email has been successfully verified. You can now log in.</p>
                        <button
                            onClick={() => (window.location.href = "/login")}
                            className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Go to Login
                        </button>
                    </div>
                ) : error ? (
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-red-600">Verification Failed</h2>
                        <p className="mt-4 text-gray-600">There was an error verifying your email. Please try again later or contact support.</p>
                    </div>
                ) : (
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-gray-700">Verifying Email...</h2>
                        <p className="mt-4 text-gray-600">Please wait while we verify your email address.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default VerifyEmailPage
