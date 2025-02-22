import React from 'react'
import { Outlet } from 'react-router-dom'

function layout() {
    return (
        <main>
            <div className="flex w-screen h-screen bg-[#a7d9f2]">

                <Outlet />

            </div>
        </main>
    )
}

export default layout
