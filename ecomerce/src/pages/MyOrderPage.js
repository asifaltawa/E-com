import React from 'react'
import Navbar from '../features/Navbar'
import UserOrders from '../features/user/components/UserOrders'

const MyOrderPage = () => {
  return (
    <div>
        <Navbar>
          <h1 className='mx-auto text-[30px] text-center font-extrabold'>My Profile</h1>
          <UserOrders/>
        </Navbar>
    </div>
  )
}

export default MyOrderPage