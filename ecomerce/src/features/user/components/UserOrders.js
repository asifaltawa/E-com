import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectUserOrders,
  fetchLoggedInUserOrdersAsync,
  selectLoggedInUserData
} from '../userSlice';
import { Link } from 'react-router-dom';
import { discountPrice } from '../../../app/const';

export default function UserOrders() {
  const orders = useSelector(selectUserOrders);
  const user = useSelector(selectLoggedInUserData);
  const dispatch = useDispatch();
  
  // Handle image loading errors
  const handleImageError = (e) => {
    e.target.src = 'https://placehold.co/400x400/png?text=Product+Image';
  };
  
  useEffect(() => {
    if (user && user.id) {
      dispatch(fetchLoggedInUserOrdersAsync(user.id));
    }
  }, [dispatch, user]);

  return (
    <div>
      {!orders && <p className="p-4 text-center">Loading your orders...</p>}
      
      {orders && Array.isArray(orders) && orders.map((order, index) => (
        <div key={index} className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 bg-white mt-8'>
              <div className="mt-8">
                  <h1 className="text-4xl my-2 font-bold tracking-tight pt-10 min-[769px]:text-[24px] min-[360px]:text-[15px] text-gray-900">Order id :- {order.id}</h1>
                  <h3 className='font-extrabold mb-2 '>Status:<span className='text-red-500 font-medium'>{order.status}</span></h3>
                            <div className="flow-root">
                              <ul className="-my-6 divide-y divide-gray-200">
                                {order.items && Array.isArray(order.items) && order.items.map((item) => (
                                  <li key={item.product.id} className="flex py-6">
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                      <img
                                        src={item.product.thumbnail || (item.product.images && item.product.images.length > 0 ? item.product.images[0] : null)}
                                        alt={item.product.title}
                                        className="h-full w-full object-cover object-center"
                                        onError={handleImageError}
                                      />
                                    </div>

                                    <div className="ml-4 flex flex-1 flex-col">
                                      <div>
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                          <h3>
                                            <a href={item.product.href}>{item.product.title}</a>
                                          </h3>
                                          <div>
                                            <p className="ml-4 text-gray-400 line-through">${item.product.price}</p>
                                            <p className="ml-4">${Math.round(item.product.price*(1-item.product.discountPercentage/100))}</p>
                                          </div>
                                          
                                          
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">{item.product.category}</p>
                                      </div>
                                      <div className="flex flex-1 items-end justify-between text-sm">
                                        <div className='text-gray-500'>
                                          <div className="inline mr-5 text-sm font-medium leading-6 text-gray-900">
                                              Qty = {order.totalItems}
                                          </div>
                                          
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
              <div className=" px-4 py-6 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  {order.items && Array.isArray(order.items) && order.items.map((item,index)=>(
                    <p key={index}>${discountPrice(item.product.price,item.product.discountPercentage)}</p>
                  ))}
                </div>
                <div className="flex justify-between my-2 text-base font-medium text-gray-900">
                  <p>Total Items</p>
                  <p>{order.totalItems} items</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500"></p>
                {/* address section */}
                <div className="border-b border-gray-900/10 pb-6">
                  <h2 className="text-base font-extrabold pt-7 leading-7 text-gray-900">Shipping Address</h2>
                  <ul className="divide-y divide-gray-100">
                    {order.selectAddress && Array.isArray(order.selectAddress) && order.selectAddress.length > 0 && (
                      <li key={index} className="flex flex-col gap-x-6 py-1 ">
                        <div className="flex min-w-0 gap-x-4">
                          <div className="min-w-0 flex-auto">
                            <p className="text-sm font-semibold leading-6 text-gray-900">{order.selectAddress[0].name}</p>
                            <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                              <span className='font-bold'>Phone: </span>
                              {order.selectAddress[0].phone}
                            </p>
                          </div>
                        </div>
                        <div className="">
                          <p className="text-sm leading-6 text-gray-900">{order.selectAddress[0].streetAddress}</p>
                          <p className="text-sm leading-6 text-gray-900">{order.selectAddress[0].city},{order.selectAddress[0].state}</p>
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                  <p>
                    or{' '}
                    <Link to='/'>
                      <button
                        type="button"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Continue Shopping
                        <span aria-hidden="true"> &rarr;</span>
                      </button>
                    </Link>
                  </p>
                </div>
              </div> 
          </div>  
      ))}
    </div>
  );
}
