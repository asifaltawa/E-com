import React, { useEffect, useState } from 'react'
import Navbar from '../features/Navbar'
import UserProfile from '../features/user/components/UserProfile'
import { useNavigate } from 'react-router-dom'

const UserProfilePage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('userData');
    if (!userData) {
      // Redirect to login if no user data
      navigate('/login');
    } else {
      setIsLoggedIn(true);
    }
  }, [navigate]);
  
  return (
    <div>
        <Navbar>
          <h1 className='mx-auto text-[30px] text-center font-extrabold'>My Profile</h1>
          {isLoggedIn ? <UserProfile/> : 
            <div className="text-center p-8">
              <p>Please log in to view your profile</p>
            </div>
          }
        </Navbar>
    </div>
  )
}

export default UserProfilePage