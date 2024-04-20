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
  const user = useSelector(selectLoggedInUserData)
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(fetchLoggedInUserOrdersAsync(user.id));
  },[])
  return (
    <div>
      {orders.map((order,index)=>(
        <div key={index} className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 bg-white mt-8'>
              <div className="mt-8">
                  <h1 className="text-4xl my-2 font-bold tracking-tight pt-10 text-gray-900">Order # {order.id}</h1>
                  <h3 className='font-extrabold mb-2 '>Status:<span className='text-red-500 font-medium'>{order.status}</span></h3>
                            <div className="flow-root">
                              <ul className="-my-6 divide-y divide-gray-200">
                                {order.items.map((item) => (
                                  <li key={item.product.id} className="flex py-6">
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                      <img
                                        src={item.product.images[0]}
                                        alt={item.product.title}
                                        className="h-full w-full object-cover object-center"
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
                  {order.items.map((item,index)=>(
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
                                <h2 className="text-base font-extrabold leading-7 text-gray-900">Shipping Address</h2>
                                <ul  className="divide-y divide-gray-100">
                                    
                    
                                        <li key={index} className="flex justify-between gap-x-6 py-5 ">
                                            <div className="flex min-w-0 gap-x-4">
                                                <div className="min-w-0 flex-auto">
                                                <p className="text-sm font-semibold leading-6 text-gray-900">{order.selectAddress[0].name}</p>
                                                <p className="mt-1 truncate text-xs leading-5 text-gray-500"><span className='font-bold'>
                                                Phone: 
                                                </span>{order.selectAddress[0].phone}</p>
                                                </div>
                                            </div>
                                            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                                                <p className="text-sm leading-6 text-gray-900">{order.selectAddress[0].city},{order.selectAddress[0].streetAddress}</p>
                                                <p className="text-sm leading-6 text-gray-900">{order.selectAddress[0].state}</p>
                                            </div>
                                        </li>
                                  
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
