import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ITEMS_PER_PAGE, discountPrice } from '../../../app/const';
import { fetchAllOrdersAsync, selectOrders, selectTotalOrder, updateOrderAsync } from '../../orders/OrderSlice';
import {ArrowUpIcon, EyeIcon, PencilIcon} from '@heroicons/react/24/outline'
import Pagination from '../../common/Pagination';
import { ArrowDownIcon } from '@heroicons/react/20/solid';

const AdminOrder = () => {
    const [page,setPage] = useState(1);
    const [EditOrderId,setEditOrderId] = useState(-1);
    const [sort,setSort] = useState({});
    const dispatch = useDispatch();
    const orders = useSelector(selectOrders);
    const totalOrders = useSelector(selectTotalOrder);

      const handlePage = (page)=>{
        setPage(page);
      }
    useEffect(()=>{
        const pagination = {_page:page,_limit:ITEMS_PER_PAGE}
        dispatch(fetchAllOrdersAsync({sort,pagination}));
    },[dispatch,page,sort])
    
    const handleEdit = (order)=>{
      setEditOrderId(order.id)
    }
    const handleShow = ()=>{
      setEditOrderId()
    }
    const handleUpdate = (e,order)=>{
      console.log(e.target.value);
      const update = {...order,status:e.target.value}
      dispatch(updateOrderAsync(update));
      setEditOrderId(-1)
    }
    const handlesort = (e,shortOption)=>{
      // sort wale me kuch garbar hai backend me sahi karna hi
      const newSort = {_sort:shortOption.name}
      setSort(newSort);
    }
    const chooseColor = (status)=>{
      switch(status){
        case "pending":
          return 'bg-purple-200 text-purple-600'
        case "dispatch":
          return 'bg-yellow-200 text-yellow-600'
        case "delivered":
          return 'bg-green-200 text-green-600'
        case "cancelled":
          return 'bg-red-200 text-red-600'
        default:
          return 'bg-purple-200 text-purple-600'
      }
    }
  return (
    <>
  {/* component */}
  <div className="overflow-x-auto ">
    <div className="min-w-full min-h-scree flex items-center justify-center bg-gray-100 font-sans overflow-x-auto">
      <div className="w-full ">
        <div className="bg-white overflow-x-auto shadow-md rounded my-6">
          <table className="min-w-max w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Order Id</th>
                <th className="py-3 px-6 text-left">Items</th>
                <th className="py-3 px-6 text-center"
                  onClick={(e)=>handlesort(e,
                      {
                        name:"totalAmount",
                        order:sort._order === "asc"? "desc":"asc"
                      }
                    )}
                > Total Amounts {' '}
                  {sort._name === 'totalAmount' &&
                      (sort._order === 'asc' ? (
                        <ArrowUpIcon className="w-4 h-4 inline"></ArrowUpIcon>
                      ) : (
                        <ArrowDownIcon className="w-4 h-4 inline"></ArrowDownIcon>
                  ))}
                </th>
                <th className="py-3 px-6 text-center">Shipping Address</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light ">
              { orders.map((order,index)=>(
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="mr-2">
                    </div>
                    <span className="font-medium">{order.id}</span>
                  </div>
                </td>
                <td className="py-3 px-6 text-left">
                  { order.items.map((item,index)=>( 
                  <div key={index} className="flex items-center">
                    <div className="mr-2">
                      <img
                        className="w-6 h-6 rounded-full"
                        src={item.product.thumbnail}
                      />
                    </div>
                    <span>{item.product.title}- #{item.quantity} * ${discountPrice(item.product.price,item.product.discountPercentage)}</span>
                  </div>))}
                </td>
                <td className="py-3 px-6 text-center">
                    <p>{order.totalAmount}</p>
                </td>
                <td className="py-3 px-6 text-center">
                
                    <strong>{order.selectAddress[0].name}</strong>
                    <p>{order.selectAddress[0].streetAddress},</p>
                    <p>{order.selectAddress[0].city},</p>
                    <p>{order.selectAddress[0].state},</p>
                    <p>{order.selectAddress[0].phone}</p>
                </td>
                <td className="py-3 px-6 text-center">
                    {order.id === EditOrderId ?
                     (<select onChange={e=>handleUpdate(e,order)}>
                        <option value="pending">Pending</option>
                        <option value="dispatch">Dispatch</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    ):(
                      <span className={`${chooseColor(order.status)} py-1 px-3 rounded-full text-xs`}>
                        {order.status}
                      </span>
                    )
                    }
                  
                </td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center gap-3">
                    <div className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                        <EyeIcon className='w-8 h-8' onClick={e=>handleShow(order)} />            
                    </div>
                    <div className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110"> 
                        <PencilIcon className='w-8 h-8' onClick={e=>handleEdit(order)}/>
                    </div>
                    
                  </div>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <Pagination handlePage={handlePage} totalItems={totalOrders} page={page}/>
</>

  )
}

export default AdminOrder