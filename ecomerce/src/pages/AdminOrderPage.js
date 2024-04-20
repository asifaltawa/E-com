import React from 'react'
import Navbar from '../features/Navbar'
import AdminOrder from '../features/admin/components/AdminOrder'

const AdminOrderPage = () => {
  return (
    <div>
        <Navbar>
            <AdminOrder></AdminOrder>
        </Navbar>
    </div>
  )
}

export default AdminOrderPage;