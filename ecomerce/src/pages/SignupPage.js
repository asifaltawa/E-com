import React from 'react'
import Signup from '../features/auth/components/Signup'

const SignupPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <Signup/>
        </div>
    </div>
  )
}

export default SignupPage