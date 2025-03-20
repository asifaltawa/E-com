import React,{useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectLoggedInUserData, updateAddressAsync, fetchLoggedInUserDataAsync } from '../userSlice';
import { selectUserData } from '../../auth/authSlice';
import { useForm } from 'react-hook-form';

const UserProfile = () => {
    const { register, handleSubmit, setValue, reset, formState:{errors} } = useForm()
    const userFromRedux = useSelector(selectLoggedInUserData);
    const userFromAuthSlice = useSelector(selectUserData);
    const [user, setUser] = useState(null);
    const [selectedEditAddress, setSelectedEditAddress] = useState(-1);
    const [addNewAddress, setAddNewAddress] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useDispatch()
    
    // Get user data on component mount
    useEffect(() => {
        // Try to get user from localStorage if not in Redux
        if (!userFromRedux || !userFromRedux.id) {
            try {
                const userDataStr = localStorage.getItem('userData');
                if (userDataStr) {
                    const userData = JSON.parse(userDataStr);
                    console.log('User from localStorage:', userData);
                    
                    // Check for necessary user data properties
                    if (userData && userData.id) {
                        // Use the user data from localStorage
                        setUser(userData);
                        console.log('Setting user from localStorage:', userData);
                        
                        // Also fetch the latest user data from the server
                        console.log('Fetching user data with ID:', userData.id);
                        dispatch(fetchLoggedInUserDataAsync(userData.id));
                    } else if (userData && userData.user && userData.user.id) {
                        // Alternative structure
                        const processedUser = {
                            id: userData.user.id,
                            email: userData.user.email,
                            name: userData.user.name || 'New User',
                            role: userData.user.role || 'user',
                            addresses: userData.user.addresses || []
                        };
                        setUser(processedUser);
                        console.log('Setting processed user from localStorage.user:', processedUser);
                        dispatch(fetchLoggedInUserDataAsync(processedUser.id));
                    } else {
                        console.error('User data incomplete:', userData);
                        setError('User data incomplete. Please log in again.');
                    }
                } else {
                    setError('Please log in to view your profile');
                }
            } catch (err) {
                console.error('Error parsing user data:', err);
                setError('Error loading user data');
            }
        } else {
            // Use user data from Redux
            console.log('Setting user from Redux:', userFromRedux);
            setUser(userFromRedux);
        }
    }, [userFromRedux, dispatch]);
    
    // Update user when Redux data changes
    useEffect(() => {
        if (userFromRedux && userFromRedux.id) {
            console.log('Updating user from Redux data:', userFromRedux);
            setUser(userFromRedux);
        } else if (userFromAuthSlice && userFromAuthSlice.user && userFromAuthSlice.user.id) {
            // Try to get user info from auth slice if needed
            const authUser = {
                id: userFromAuthSlice.user.id,
                email: userFromAuthSlice.user.email,
                name: userFromAuthSlice.user.name || 'New User',
                role: userFromAuthSlice.user.role || 'user',
                addresses: userFromAuthSlice.user.addresses || []
            };
            console.log('Using user data from auth slice:', authUser);
            setUser(authUser);
            dispatch(fetchLoggedInUserDataAsync(authUser.id));
        }
    }, [userFromRedux, userFromAuthSlice, dispatch]);
    
    const RemoveAddress = (index) => {
        // Check if user is valid and has addresses
        if(!user || !user.id || !user.addresses) {
            setError('Cannot update user data - missing user information');
            return;
        }
        
        setError(''); // Clear any previous errors
        const newUser = {...user, addresses: [...user.addresses]};
        newUser.addresses.splice(index, 1);
        
        dispatch(updateAddressAsync(newUser))
            .unwrap()
            .then(() => {
                // Refresh user data after removing address
                dispatch(fetchLoggedInUserDataAsync(user.id));
            })
            .catch(err => {
                setError('Failed to update address: ' + (err.message || err));
                console.error('Error updating address:', err);
            });
    }
    
    const handleEdit = (e, index) => {
        if(!user || !user.addresses || !user.addresses[index]) {
            setError('Cannot edit address - address not found');
            return;
        }
        
        setError(''); // Clear any previous errors
        setSelectedEditAddress(index);
        const address = user.addresses[index];
        setValue('name', address.name);
        setValue('email', address.email);
        setValue('phone', address.phone);
        setValue('streetAddress', address.streetAddress);
        setValue('city', address.city);
        setValue('state', address.state);
    }
    
    const editAddress = (updatedAddress, index) => {
        if(!user || !user.id || !user.addresses) {
            setError('Cannot update user data - missing user information');
            return;
        }
        
        setError(''); // Clear any previous errors
        const newUser = {...user, addresses: [...user.addresses]}; //shallow copy
        newUser.addresses.splice(index, 1, updatedAddress);
        
        dispatch(updateAddressAsync(newUser))
            .unwrap()
            .then(() => {
                // Refresh user data after editing address
                dispatch(fetchLoggedInUserDataAsync(user.id));
                setSelectedEditAddress(-1);
            })
            .catch(err => {
                setError('Failed to update address: ' + (err.message || err));
                console.error('Error updating address:', err);
            });
    }
    
    // Add a new address
    const handleAddNewAddress = (data) => {
        // Make sure we have valid user data
        if (!user) {
            console.error('User is null or undefined');
            setError('Cannot add address - missing user information');
            return;
        }
        
        if (!user.id) {
            console.error('User ID is missing:', user);
            
            // Try to get user ID from authUser if available
            if (userFromAuthSlice && userFromAuthSlice.user && userFromAuthSlice.user.id) {
                console.log('Found user ID in auth data:', userFromAuthSlice.user.id);
                const updatedUser = { ...user, id: userFromAuthSlice.user.id };
                
                console.log('Adding address for user with ID from auth:', updatedUser);
                const addresses = updatedUser.addresses ? [...updatedUser.addresses] : [];
                
                // Update the user with the new address
                const finalUser = { ...updatedUser, addresses: [...addresses, data] };
                dispatch(updateAddressAsync(finalUser))
                    .then(() => {
                        dispatch(fetchLoggedInUserDataAsync(updatedUser.id));
                        reset();
                        setAddNewAddress(false);
                    })
                    .catch(err => {
                        setError('Failed to add address: ' + err);
                    });
                
                return;
            }
            
            setError('Cannot add address - missing user information. Please log in again.');
            return;
        }
        
        console.log('Adding address for user:', user);
        const addresses = user.addresses ? [...user.addresses] : [];
        
        // Update the user with the new address
        const updatedUser = { ...user, addresses: [...addresses, data] };
        dispatch(updateAddressAsync(updatedUser))
            .unwrap()
            .then(() => {
                dispatch(fetchLoggedInUserDataAsync(user.id));
                reset();
                setAddNewAddress(false);
            })
            .catch(err => {
                console.error('Error adding address:', err);
                setError('Failed to add address: ' + err);
            });
    }

  return (
    <div>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 bg-white mt-8'>
            <div className="mt-8">
                <h1 className="text-4xl my-2 font-bold tracking-tight pt-10 text-gray-900">Name: {user && user.name ? user.name : "New User"}</h1>
                <h3 className='font-extrabold mb-2 '>Email:<span className='text-gray-500 font-medium'> {user && user.email}</span></h3>
                <h1 className='font-extrabold mb-2 ' >{user && user.role}</h1>      
            </div>
            <div className=" px-4 py-6 sm:px-6">
                {/* Display error message if there is one */}
                {error && (
                    <div className="rounded-md bg-red-50 p-4 my-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Error</h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>{error}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
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
                        onSubmit={handleSubmit((data) => {
                            if (!user || !user.id) {
                                setError('Cannot add address - missing user information');
                                return;
                            }
                            const addresses = user.addresses ? [...user.addresses] : [];
                            dispatch(updateAddressAsync({...user, addresses: [...addresses, data]}))
                                .then(() => {
                                    console.log('Address added successfully');
                                    dispatch(fetchLoggedInUserDataAsync(user.id));
                                    reset();
                                    setAddNewAddress(false);
                                })
                                .catch(err => {
                                    console.error('Error adding address:', err);
                                    setError('Failed to add address: ' + err);
                                });
                        })}
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
                            user && user.addresses && user.addresses.map((address,index)=>(
                                <div key={index}>
                                    { selectedEditAddress === index ? ( 
                                        //EDIT ADDRESS FORM
                                        <div>
                                            <form className='bg-white px-5 py-12' onSubmit={handleSubmit((data)=>{
                                                                editAddress(data,index);
                                                            })}
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