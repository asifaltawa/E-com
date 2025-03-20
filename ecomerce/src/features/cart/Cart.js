import { useSelector, useDispatch } from 'react-redux';
import {
  selectItems, updateCartAsync,DeleteCartAsync
} from './CartSlice'
import { useState } from 'react'
import { Link } from 'react-router-dom';
import { discountPrice } from '../../app/const';

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector(selectItems)
  const [open, setOpen] = useState(true)
  
  // Handle image loading errors
  const handleImageError = (e) => {
    e.target.src = 'https://placehold.co/400x400/png?text=Product+Image';
  };
  
  // Debug logs
  console.log("Cart Items:", items);
  
  // Calculate total amount with null checking
  const totalAmount = items && items.length 
    ? items.reduce((amount, item) => {
        if (!item || !item.product) return amount;
        console.log("Processing item:", item);
        console.log("Product price:", item.product.price);
        console.log("Product discount:", item.product.discountPercentage);
        console.log("Quantity:", item.quantity);
        
        const price = parseFloat(item.product.price) || 0;
        const discount = parseFloat(item.product.discountPercentage) || 0;
        const quantity = parseInt(item.quantity) || 1;
        const discountedPrice = discountPrice(price, discount);
        console.log("Discounted price:", discountedPrice);
        
        return (discountedPrice * quantity) + amount;
      }, 0)
    : 0;
  
  // Calculate total items with null checking
  const totalItems = items && items.length
    ? items.reduce((total, item) => (item && item.quantity ? parseInt(item.quantity) : 0) + total, 0)
    : 0;
    
  const handleDelete = (e,id)=>{
    dispatch(DeleteCartAsync(id))
  }
  const handleChange = (e,item)=>{
    dispatch(updateCartAsync({id:item.id,quantity:+e.target.value}))
  }

  return (
    <>
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
                        onError={handleImageError}
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>
                            <a href={item.href}>{item.product.title}</a>
                          </h3>
                          <div>
                            <p className="ml-4 text-gray-400 line-through">
                              ${parseFloat(item.product.price).toFixed(2)}
                            </p>
                            <p className="ml-4">
                              ${discountPrice(parseFloat(item.product.price), parseFloat(item.product.discountPercentage)).toFixed(2)}
                            </p>
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
            <p>${totalAmount.toFixed(2)}</p>
          </div>
          <div className="flex justify-between my-2 text-base font-medium text-gray-900">
            <p>Total Items in Cart</p>
            <p>{totalItems} items</p>
          </div>
          <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
          <div className="mt-6">
            <Link
              to="/checkout"
              className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Checkout
            </Link>
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
    </>
  );
}
