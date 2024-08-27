"use client"

import React, { useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { toast } from "react-hot-toast"
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
    const router = useRouter()
    const [data, setData] = useState("nothing")

    const getUserDetails = async () => {
        const res = await axios.post("/api/users/me")
        (res.data)
        setData(res.data.data._id)
    }

    const logout = async () => {
        try {
            await axios.get("/api/users/logout")
            toast.success("Logout successful")
            router.push("/login")
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
                <h1 className="text-3xl font-semibold mb-6 text-gray-800">Profile Page</h1>
                <h2 className="text-xl text-gray-600 mb-6">
                    {data === "nothing" ? "No user data available" : (
                        <Link href={`/profile/${data}`} className="text-indigo-600 hover:underline">
                            View Profile: {data}
                        </Link>
                    )}
                </h2>
                <div className="space-y-4">
                    <button
                        onClick={getUserDetails}
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Get User Details
                    </button>
                    <button
                        onClick={logout}
                        className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}
