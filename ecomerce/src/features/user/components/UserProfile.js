import React,{useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectLoggedInUserData, updateAddressAsync } from '../userSlice';
import { useForm } from 'react-hook-form';

const UserProfile = () => {
    const { register, handleSubmit ,setValue,reset, formState:{errors} } = useForm()
    const user = useSelector(selectLoggedInUserData);
    const [selectedEditAddress,setSelectedEditAddress] = useState(-1);
    const [addNewAddress,setAddNewAddress] = useState(false);
    const dispatch = useDispatch()
    const RemoveAddress = (index)=>{
        const newUser = {...user,addresses:[...user.addresses]}
        newUser.addresses.splice(index,1);
        console.log(newUser)
        dispatch(updateAddressAsync(newUser))
    }
    const handleEdit = (e,index)=>{
        setSelectedEditAddress(index);
        const address = user.addresses[index];
        setValue('name',address.name);
        setValue('email',address.email);
        setValue('phone',address.phone);
        setValue('streetAddress',address.streetAddress);
        setValue('city',address.city);
        setValue('state',address.state);
    }
    const editAddress = (updatedAddress,index)=>{
        const newUser = {...user,addresses:[...user.addresses]} //shallow copy
        newUser.addresses.splice(index,1,updatedAddress);
        dispatch(updateAddressAsync(newUser));
        setSelectedEditAddress(-1)
    }
  return (
    <div>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 bg-white mt-8'>
            <div className="mt-8">
                <h1 className="text-4xl my-2 font-bold tracking-tight pt-10 text-gray-900">Name: {user.name ? user.name : "New User"}</h1>
                <h3 className='font-extrabold mb-2 '>Email:<span className='text-gray-500 font-medium'> {user.email}</span></h3>
                <h1 className='font-extrabold mb-2 ' >{user.role}</h1>      
            </div>
              <div className=" px-4 py-6 sm:px-6">
              <button
                    onClick={e=>(
                                setAddNewAddress(true),
                                setSelectedEditAddress(-1))}
                    className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
               >
                Add New Address
              </button>
                <div className="border-b border-gray-900/10 pb-6">
                    {/* NEW ADDRESS FORM */}
                    {addNewAddress && <form className='bg-white px-5 py-12' 
                        onSubmit={
                            handleSubmit((data)=>{
                                dispatch(updateAddressAsync({...user,addresses:[...user.addresses,data]}))
                                reset()
                                setAddNewAddress(false);
                                console.log(data);})}
                    > 
                        <div className='space-y-12'>
                            <div className="border-b border-gray-900/10 pb-12">
                                <h2 className=" text-2xl font-bold leading-7 text-gray-900">Personal Information</h2>
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
                                        <button 
                                        type="button" 
                                        className="text-sm font-semibold leading-6 text-gray-900"
                                        onClick={e=>setAddNewAddress(false)}
                                        >
                                        Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                        Save Address
                                        </button>
                                </div>
                            </div>
                        </div>
                    </form>}
                    
                        <h2 className="text-base font-extrabold leading-7 pt-10 text-gray-900">Your Addresses:-</h2>
                        { 
                            user.addresses.map((address,index)=>(
                                <div key={index}>
                                    { selectedEditAddress === index ? ( 
                                        //EDIT ADDRESS FORM
                                        <div>
                                            <form className='bg-white px-5 py-12' onSubmit={handleSubmit((data)=>{
                                                                        editAddress(data,index)
                                                                        reset()
                                                                        console.log(data);})}
                                                > 
                                                    <div className='space-y-12'>
                                                        <div className="border-b border-gray-900/10 pb-12">
                                                            <h2 className=" text-2xl font-bold leading-7 text-gray-900">Personal Information</h2>
                                                            <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive your order.</p>

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
                                                                    <button 
                                                                    type="button" 
                                                                    className="text-sm font-semibold leading-6 text-gray-900"
                                                                    onClick={e=>setSelectedEditAddress(-1)}
                                                                    >
                                                                    Cancel
                                                                    </button>
                                                                    <button
                                                                        type="submit"
                                                                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                                    >
                                                                    Save Address
                                                                    </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                        </div>) : null}
                                        {/* SHOWING ADDRESS SECTION */}
                                    <div className="divide-y divide-gray-100">
                                        <li  className="sm:flex-col -mt-10 gap-x-6 py-5 ">
                                            <div className="flex min-w-0 gap-x-4">
                                                <div className="min-w-0 flex-auto">
                                                    <p className="text-sm font-semibold leading-6 text-gray-900">{address.name}</p>
                                                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                                                        <span className='font-bold'>
                                                            Phone: 
                                                        </span>
                                                        {address.phone}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className=" shrink-0 sm:flex sm:flex-col sm:items-end">
                                                <p className="text-sm leading-6 text-gray-900">{address.streetAddress},{address.city}</p>
                                                <p className="text-sm leading-6 text-gray-900">{address.state}</p>
                                            </div>
                                        </li>
                                        <div className='flex flew-col gap-2'>
                                            <button
                                                onClick={e=>RemoveAddress(index)}
                                                type="button"
                                                className="font-medium text-indigo-600 hover:text-indigo-500"
                                            >
                                                Remove
                                            </button>
                                            <button
                                                onClick={e=>handleEdit(e,index)}
                                                type="submit"
                                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                >
                                                Edit Address
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    
                </div>
              </div> 
          </div>  
    </div>
  )
}

export default UserProfile