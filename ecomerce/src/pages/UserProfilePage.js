import React from 'react'
import Navbar from '../features/Navbar'
import UserProfile from '../features/user/components/UserProfile'

const UserProfilePage = () => {
  return (
    <div>
        <Navbar>
          <h1 className='mx-auto text-[30px] text-center font-extrabold'>My Profile</h1>
          <UserProfile/>
        </Navbar>
    </div>
  )
}

export default UserProfilePage