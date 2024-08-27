"use client"

import React from 'react'

export default function page({ params }: any) {
    return (
        <div>
            <h1>Profile page</h1>
            <p>This is the profile page for {params.id}</p>
        </div>
    )
}
