import React from 'react'
import Login from '../features/auth/components/Login'

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <Login/>
        </div>
    </div>
  )
}

export default LoginPage