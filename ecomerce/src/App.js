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
import { selectUserData, restoreUser } from './features/auth/authSlice';
import UserProfilePage from './pages/UserProfilePage';
import Signout from './features/auth/components/Signout';
import ForgetPasswordPage from './pages/ForgetPasswordPage';
import AdminHomePage from './pages/AdminHomePage'
import ProductForm from './features/admin/components/ProductForm';
import AdminProtected from './features/auth/components/AdminProtected';
import AdminOrderPage from './pages/AdminOrderPage';
import SignUpotp from './pages/SignupOtp';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Create and export the router outside the component
const router = createBrowserRouter([
  {
    path: '/',
    element: <Protected><Home/></Protected>,
    id: 'home',
  },
  {
    path: '/login',
    element: <LoginPage/>,
    id: 'login',
  },
  {
    path: '/signup',
    element: <SignupPage/>,
    id: 'signup',
  },
  {
    path: '/signup/otpverification',
    element: <SignUpotp/>,
    id: 'signup-otp',
  },
  {
    path: '/verify-email',
    element: <SignUpotp/>,
    id: 'verify-email',
  },
  {
    path: '/cart',
    element: <Protected><CartPage/></Protected>,
    id: 'cart',
  },
  {
    path: '/checkout',
    element: <Protected><Checkout/></Protected>,
    id: 'checkout',
  },
  {
    path: '/forgot-password',
    element: <ForgetPasswordPage/>,
    id: 'forgot-password',
  },
  {
    path: '/product-detail/:id',
    element: <Protected><ProductDetailPage/></Protected>,
    id: 'product-detail',
  },
  {
    path: '/order-success/:id',
    element: <Protected><OrderSuccessPage/></Protected>,
    id: 'order-success',
  },
  {
    path: '/my-orders',
    element: <Protected><MyOrderPage/></Protected>,
    id: 'my-orders',
  },
  {
    path: '/profile',
    element: <Protected><UserProfilePage/></Protected>,
    id: 'profile',
  },
  {
    path: '/signout',
    element: <Signout/>,
    id: 'signout',
  },
  {
    path: '/admin/home',
    element: <AdminProtected><AdminHomePage/></AdminProtected>,
    id: 'admin-home',
  },
  {
    path: '/admin/order',
    element: <AdminProtected><AdminOrderPage/></AdminProtected>,
    id: 'admin-order',
  },
  {
    path: '/admin/product-form',
    element: <AdminProtected><ProductForm/></AdminProtected>,
    id: 'admin-product-form',
  },
  {
    path: '/admin/product-form/edit/:id',
    element: <AdminProtected><ProductForm/></AdminProtected>,
    id: 'admin-product-edit',
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage/>,
    id: 'reset-password',
  },
  {
    path: '*',
    element: <PageNotFound/>,
    id: '404',
  }
]);

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectUserData);
  
  // Fetch user data and cart when user is authenticated
  useEffect(() => {
    if (user && user.id) {
      const userId = user.id;
      console.log('App: Fetching data for authenticated user ID:', userId);
      dispatch(fetchCartByIdAsync(userId));
      dispatch(fetchLoggedInUserDataAsync(userId));
    } else if (user && user.user && user.user.id) {
      const userId = user.user.id;
      console.log('App: Fetching data for authenticated user.user.id:', userId);
      dispatch(fetchCartByIdAsync(userId));
      dispatch(fetchLoggedInUserDataAsync(userId));
    }
  }, [dispatch, user]);

  // Fix user data structure on app start - runs only once with a simpler approach
  useEffect(() => {
    // We don't want this to run when the Redux store already has the user
    if (user && (user.id || (user.user && user.user.id))) {
      console.log('App: User already in Redux state, skipping localStorage check');
      return;
    }
    
    try {
      const userDataStr = localStorage.getItem('userData');
      if (!userDataStr) {
        console.log('App: No user data in localStorage');
        return;
      }
      
      const userData = JSON.parse(userDataStr);
      console.log('App: Checking localStorage user data');
      
      // Simple structure fix - doesn't interfere with Protected component
      if (userData && userData.user && userData.user.id && !userData.id) {
        console.log('App: Basic user data fix applied');
        userData.id = userData.user.id;
        localStorage.setItem('userData', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('App: Error checking localStorage:', error);
    }
  }, []); // Empty dependency array - runs once

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
