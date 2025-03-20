import { useSelector } from "react-redux";
import { selectUserData, selectStatus } from "../authSlice";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { restoreUser } from "../authSlice";

function Protected({children}) {
    const user = useSelector(selectUserData);
    const status = useSelector(selectStatus);
    const dispatch = useDispatch();
    const [authChecked, setAuthChecked] = useState(false);

    // Single authentication check effect that runs once on mount
    useEffect(() => {
        console.log('Protected: Starting auth check with user:', user);
        
        // If we already have user in Redux, we're good
        if (user && (user.id || (user.user && user.user.id))) {
            console.log('Protected: User already in Redux state');
            setAuthChecked(true);
            return;
        }
        
        // Otherwise, check localStorage
        try {
            const storedUserStr = localStorage.getItem('userData');
            if (!storedUserStr) {
                console.log('Protected: No user data in localStorage');
                setAuthChecked(true);
                return;
            }
            
            const storedUser = JSON.parse(storedUserStr);
            console.log('Protected: Found stored user:', storedUser);
            
            if (storedUser && (storedUser.id || (storedUser.user && storedUser.user.id))) {
                console.log('Protected: Valid user data in localStorage, restoring');
                dispatch(restoreUser(storedUser));
                // Give Redux a moment to update state
                setTimeout(() => setAuthChecked(true), 50);
            } else {
                console.log('Protected: Invalid user data in localStorage');
                localStorage.removeItem('userData');
                setAuthChecked(true);
            }
        } catch (error) {
            console.error('Protected: Error parsing stored user:', error);
            localStorage.removeItem('userData');
            setAuthChecked(true);
        }
    }, []); // Empty dependency array means this runs once on mount
    
    // Show loading state while checking authentication
    if (!authChecked || status === 'loading') {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                <p className="ml-3">Authenticating...</p>
            </div>
        );
    }
    
    // Once auth check is complete, if no valid user, redirect to login
    const isAuthenticated = user && (user.id || (user.user && user.user.id));
    if (!isAuthenticated) {
        console.log('Protected: Not authenticated, redirecting to login');
        return <Navigate to="/login" replace />;
    }
    
    console.log('Protected: User is authenticated, rendering children');
    return children;
}

export default Protected;