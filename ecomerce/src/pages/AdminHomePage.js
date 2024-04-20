import React from 'react'
import Navbar from '../features/Navbar'
import ProductList from '../features/product/components/ProductList'
import AdminProductList from '../features/admin/components/AdminProductList'
const Home = () => {
  return (
    <div>
        <Navbar>
            <AdminProductList></AdminProductList>
        </Navbar>
    </div>
  )
}

export default Home