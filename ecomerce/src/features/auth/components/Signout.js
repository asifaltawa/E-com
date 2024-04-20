import React, { useEffect } from 'react'
import { selectUserData, signOutAsync } from '../authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

function Signout() {
    const user = useSelector(selectUserData)
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(signOutAsync())
    })
    return ( 
        <>
        {!user && <Navigate to='/login' replace={true}></Navigate>}
        </>
     );
}

export default Signout;