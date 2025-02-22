import React from 'react'

function DotsUI() {
    return (
        <>
            {[...Array(9)].map((_, i) => (
                <div key={i} className="w-0.5 h-0.5 bg-blue-500 rounded-full"></div>
            ))}
        </>
    )
}

export default DotsUI
