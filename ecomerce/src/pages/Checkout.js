import React from 'react'
import { Link, Navigate } from 'react-router-dom';
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import {
  selectItems, updateCartAsync,DeleteCartAsync
} from '../features/cart/CartSlice'
import { useForm } from "react-hook-form"
import { CreateOrderAsync,selectCurrentOrder } from '../features/orders/OrderSlice';
import { selectLoggedInUserData, updateAddressAsync } from '../features/user/userSlice';
import { discountPrice } from '../app/const';
import Navbar from '../features/Navbar';

const Checkout = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectItems)
  const [open, setOpen] = useState(true)
  const currentOrder = useSelector(selectCurrentOrder)
  
  
  const [selectAddress,setSelectAddress] = useState(null);
  const [paymentMethod,setPaymentMethod] = useState('cash');
  const { register, handleSubmit ,reset, formState:{errors} } = useForm()
  const user = useSelector(selectLoggedInUserData);
  console.log("user");
  console.log(user);
  const totalAmount = items && items.length 
    ? items.reduce((amount, item) => {
        if (!item || !item.product) return amount;
        const price = item.product.price || 0;
        const discount = item.product.discountPercentage || 0;
        const quantity = item.quantity || 1;
        return discountPrice(price, discount) * quantity + amount;
      }, 0)
    : 0;
  const handlePayment = (e)=>{
    console.log(e.target.value)
    setPaymentMethod(e.target.value)
  }
  const handleAddress = (e) => {
    console.log('Address selection:', e.target.value);
    if(user && user.addresses && user.addresses.length > parseInt(e.target.value)) {
      setSelectAddress(user.addresses[parseInt(e.target.value)]);
    } else {
      console.error('Invalid address selection or user addresses not loaded');
    }
  }
  const totalItems = items && items.length
    ? items.reduce((total, item) => (item && item.quantity ? item.quantity : 0) + total, 0)
    : 0;
  const handleDelete = (e,id)=>{
    dispatch(DeleteCartAsync(id))
  }
  const handleChange = (e,item)=>{
    dispatch(updateCartAsync({id:item.id,quantity:+e.target.value}))
  }
  const handleOrders = async (e) => {
    // Check all required fields before creating order
    if(!user || !user.id) {
      alert('You must be logged in to place an order');
      return;
    }
    
    if(!selectAddress) {
      alert('Please select a shipping address');
      return;
    }
    
    if(!paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    
    if(!items || items.length === 0) {
      alert('Your cart is empty');
      return;
    }
    
    // Create the order with proper validation
    const order = {
      items,
      totalAmount,
      totalItems,
      user: user.id,
      paymentMethod,
      selectAddress,
      status: 'pending'
    };
    
    console.log('Creating order:', order);
    try {
      const result = await dispatch(CreateOrderAsync(order)).unwrap();
      console.log('Order created successfully:', result);
      // The redirection will be handled by the useEffect watching currentOrder
    } catch (error) {
      console.error('Failed to create order:', error);
      alert(error.message || 'Failed to create order. Please try again.');
    }
  }
  return (
    <>
    {!items.length && <Navigate to='/' replace={true} ></Navigate> }
    {currentOrder && <Navigate to={`/order-success/${currentOrder.id}`} replace={true} ></Navigate> }
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8  mt-12'>
        <div className='grid grid-col-1 gap-x-8 gap-y-10 lg:grid-cols-5'>
            <div className='lg:col-span-3'>
                <form className='bg-white px-5 py-12' onSubmit={handleSubmit((data)=>{
                                                                //   dispatch(checkuserAsync({email:data.email,password:data.password}))
                                                                  dispatch(updateAddressAsync({...user,addresses:[...user.addresses,data]}))
                                                                  reset()
                                                                  console.log(data);})}
                > 
                    <div className='space-y-12'>
                        <div className="border-b border-gray-900/10 pb-12">
                            <h2 className="text-2xl font-bold leading-7 text-gray-900">Personal Information</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p>

                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-3">
                                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                    Full Name
                                </label>
                                <div className="mt-2">
                                    <input
                                    type="text"
                                    {...register('name',{required:"name is required"})}
                                    id="name"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                                </div>

                                <div className="sm:col-span-4">
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                    id="email"
                                    {...register('email',{required:"email is required"})}
                                    type="email"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                                </div>

                                <div className="sm:col-span-3">
                                <div className="mt-2">
                                    <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                                        Phone
                                    </label>
                                    <input
                                        id='phone'
                                        {...register('phone',{required:"phone is required"})}
                                        type="tel"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                                </div>

                                <div className="col-span-full">
                                <label htmlFor="streetAddress" className="block text-sm font-medium leading-6 text-gray-900">
                                    Street address
                                </label>
                                <div className="mt-2">
                                    <input
                                    type="text"
                                    {...register('streetAddress',{required:"streetAddress is required"})}
                                    id="streetAddress"
                                    autoComplete="streetAddress"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                                </div>

                                <div className="sm:col-span-2 sm:col-start-1">
                                <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                                    City
                                </label>
                                <div className="mt-2">
                                    <input
                                    type="text"
                                    {...register('city',{required:"city is required"})}
                                    id="city"
                                    autoComplete="address-level2"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                                </div>

                                <div className="sm:col-span-2">
                                <label htmlFor="state" className="block text-sm font-medium leading-6 text-gray-900">
                                    State / Province
                                </label>
                                <div className="mt-2">
                                    <input
                                    type="text"
                                    {...register('state',{required:"state is required"})}
                                    id="state"
                                    autoComplete="address-level1"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                                </div>

                                <div className="sm:col-span-2">
                                <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
                                    ZIP / Postal code
                                </label>
                                <div className="mt-2">
                                    <input
                                    type="text"
                                    name="postal-code"
                                    id="postal-code"
                                    autoComplete="postal-code"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                                </div>
                            </div>
                            </div>

                            <div>
                                <div className="mt-6 flex items-center justify-end gap-x-6">
                                    <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                                    Reset
                                    </button>
                                    <button
                                    type="submit"
                                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                    Save Address
                                    </button>
                            </div>
                            <div className="border-b border-gray-900/10 pb-12">
                                <h2 className="text-base font-semibold leading-7 text-gray-900">Address</h2>
                                <p className="mt-1 text-sm leading-6 text-gray-600">
                                    Choose from existing address
                                </p>
                                <ul  className="divide-y divide-gray-100">
                                    {user && user.addresses && user.addresses.map((address,index) => (
                    
                                        <li key={index} className="flex justify-between gap-x-6 py-5 border-solid border-2 border-gray-200 px-5">
                                            <div className="flex min-w-0 gap-x-4">
                                                <input
                                                    onChange={handleAddress}
                                                    value={index}
                                                    id="address"
                                                    name="address"
                                                    type="radio"
                                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                />
                                                <div className="min-w-0 flex-auto">
                                                <p className="text-sm font-semibold leading-6 text-gray-900">{address.name}</p>
                                                <p className="mt-1 truncate text-xs leading-5 text-gray-500"><span className='font-bold'>
                                                Phone: 
                                                </span>{address.phone}</p>
                                                </div>
                                            </div>
                                            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                                                <p className="text-sm leading-6 text-gray-900">{address.city},{address.streetAddress}</p>
                                                <p className="text-sm leading-6 text-gray-900">{address.state}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-10 space-y-10">
                                <fieldset>
                                <legend className="text-sm font-semibold leading-6 text-gray-900">Payment Methods</legend>
                                <p className="mt-1 text-sm leading-6 text-gray-600">Choose One</p>
                                <div className="mt-6 space-y-6">
                                    <div className="flex items-center gap-x-3">
                                    <input
                                        onChange={handlePayment}
                                        value="cash"
                                        id="cash"
                                        name="payments"
                                        checked={paymentMethod === 'cash'}
                                        type="radio"
                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                    <label htmlFor="push-everything" className="block text-sm font-medium leading-6 text-gray-900">
                                        Cash
                                    </label>
                                    </div>
                                    <div className="flex items-center gap-x-3">
                                    <input
                                        onChange={handlePayment}
                                        value="card"
                                        id="card"
                                        name="payments"
                                        checked={paymentMethod === 'card'}
                                        type="radio"
                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                    <label htmlFor="push-email" className="block text-sm font-medium leading-6 text-gray-900">
                                        Card
                                    </label>
                                    </div>
                                </div>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className='lg:col-span-2'>
                <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 bg-white mt-12'>
                    <div className="mt-8">
                        <h1 className="text-4xl my-5 font-bold tracking-tight text-gray-900">Cart</h1>
                                    <div className="flow-root">
                                    <ul className="-my-6 divide-y divide-gray-200">
                                        {items && items.length > 0 ? items.map((item) => (
                                            item && item.product ? (
                                                <li key={item.id} className="flex py-6">
                                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                        <img
                                                            src={item.product.thumbnail || (item.product.images && item.product.images.length > 0 ? item.product.images[0] : null)}
                                                            alt={item.product.title}
                                                            className="h-full w-full object-cover object-center"
                                                            onError={(e) => {
                                                                e.target.src = 'https://placehold.co/400x400/png?text=Product+Image';
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="ml-4 flex flex-1 flex-col">
                                                        <div>
                                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                                <h3>
                                                                    <a href={item.href}>{item.product.title}</a>
                                                                </h3>
                                                                <div>
                                                                    <p className="ml-4 text-gray-400 line-through">${item.product.price}</p>
                                                                    <p className="ml-4">${discountPrice(item.product.price,item.product.discountPercentage)}</p>
                                                                </div>
                                                            </div>
                                                            <p className="mt-1 text-sm text-gray-500">{item.product.category}</p>
                                                        </div>
                                                        <div className="flex flex-1 items-end justify-between text-sm">
                                                            <div className='text-gray-500'>
                                                                <label htmlFor="quantity" className="inline mr-5 text-sm font-medium leading-6 text-gray-900">
                                                                    Qty
                                                                </label>
                                                                <select onChange={(e)=>handleChange(e,item)} value={item.quantity}>
                                                                    <option value={1}>1</option>
                                                                    <option value={2}>2</option>
                                                                    <option value={3}>3</option>
                                                                    <option value={4}>4</option>
                                                                    <option value={5}>5</option>
                                                                </select>
                                                            </div>
                                                            <div className="flex">
                                                                <button
                                                                    onClick={e=>handleDelete(e,item.id)}
                                                                    type="button"
                                                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            ) : null
                                        )) : (
                                            <li className="py-6 text-center">
                                                Your cart is empty
                                            </li>
                                        )}
                                    </ul>
                                    </div>
                                </div>
                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>${totalAmount}</p>
                        </div>
                        <div className="flex justify-between my-2 text-base font-medium text-gray-900">
                        <p>Total Items in Cart</p>
                        <p>{totalItems} items</p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                        <div className="mt-6">
                        <div
                            onClick={handleOrders}
                            className="flex  items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                        >
                            Order Now
                        </div>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                            or{' '}
                            <Link to='/'>
                            <button
                                type="button"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                                onClick={() => setOpen(false)}
                            >
                                Continue Shopping
                                <span aria-hidden="true"> &rarr;</span>
                            </button>
                            </Link>
                        </p>
                        </div>
                    </div> 
                </div>  
            </div>    
        </div>
    </div>
    </>
  )
}

export default Checkout