import { useSelector } from "react-redux";
import { selectUserData } from "../authSlice";
import { Navigate } from "react-router-dom";

function AdminProtected({children}) {
    const user = useSelector(selectUserData);
    if(!user){
        return <Navigate to='/login' replace={true}></Navigate>
    }    
    else if(user && user.user.role !== 'admin'){     
      return <Navigate to='/' replace={true}></Navigate>
    }
    return children
    
     
}

export default AdminProtected;