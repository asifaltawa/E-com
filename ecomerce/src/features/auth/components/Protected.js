import { useSelector } from "react-redux";
import { selectUserData } from "../authSlice";
import { Navigate } from "react-router-dom";

function Protected({children}) {
    const user = useSelector(selectUserData)
    if(!user){
        return <Navigate to='/login' replace={true}></Navigate>
    }
    else{
        return children
    }
     
}

export default Protected;