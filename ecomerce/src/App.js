import React, { useEffect } from 'react';
import './App.css';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import ProductDetailPage from './pages/ProductDetailPage';
import Protected from './features/auth/components/Protected';
import { fetchCartByIdAsync } from './features/cart/CartSlice';
import { useDispatch, useSelector } from 'react-redux';
import PageNotFound from './pages/PageNotFound';
import OrderSuccessPage from './pages/OrderSuccessPage';
import MyOrderPage from './pages/MyOrderPage';
import { fetchLoggedInUserDataAsync } from './features/user/userSlice';
import { selectUserData } from './features/auth/authSlice';
import UserProfilePage from './pages/UserProfilePage';
import  Signout  from './features/auth/components/Signout';
import ForgetPasswordPage from './pages/ForgetPasswordPage';
import AdminHomePage from './pages/AdminHomePage'
import ProductForm from './features/admin/components/ProductForm';
import AdminProtected from './features/auth/components/AdminProtected';
import AdminOrderPage from './pages/AdminOrderPage';

const router = createBrowserRouter([
  {
    path : '/',
    element : <Protected><Home/></Protected>
  },
  {
    path : '/login',
    element : <LoginPage/>
  },
  {
    path : '/signup',
    element : <SignupPage/>
  },
  {
    path:'/cart',
    element:<Protected><CartPage/></Protected>
  },
  {
    path:'/checkout',
    element:<Protected><Checkout/></Protected>
  },
  {
    path:'/forgetpassword',
    element:<ForgetPasswordPage/>
  },
  {
    path:'/product-detail/:id',
    element:<Protected><ProductDetailPage/></Protected>
  },
  {
    path:'/order-success/:id',
    element:<OrderSuccessPage></OrderSuccessPage>
  },
  {
    path:'/my-orders',
    element:<Protected><MyOrderPage/></Protected>
  },
  {
    path:'/profile',
    element:<Protected><UserProfilePage/></Protected>
  },
  {
    path:'/signout',
    element:<Signout/>
  },
  {
    path:'/admin/home',
    element:<AdminProtected><AdminHomePage/></AdminProtected>
  },
  {
    path:'/admin/order',
    element:<AdminProtected><AdminOrderPage/></AdminProtected>
  },
  {
    path:'/admin/product-form',
    element:<AdminProtected><ProductForm/></AdminProtected>
  },
  {
    path:'/admin/product-form/edit/:id',
    element:<AdminProtected><ProductForm/></AdminProtected>
  },
  {
    path:'*',
    element:<PageNotFound></PageNotFound>
  }
])
function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectUserData)
  
  useEffect(()=>{
    if(user){
      dispatch(fetchCartByIdAsync(user.user.id))
      dispatch(fetchLoggedInUserDataAsync(user.user.id))
    }
  },[dispatch,user])
  return (
    <div >
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
