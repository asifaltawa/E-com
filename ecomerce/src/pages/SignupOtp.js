import React, { useState } from 'react'
import { IoEyeOff } from "react-icons/io5";
import { IoEye } from 'react-icons/io5';
import { useForm } from "react-hook-form";
import axios from 'axios';
import { Navigate, useLocation } from 'react-router-dom';


const SetPassword = () => {
  const [showPassword,setShowPassword] = useState(false);
  const location = useLocation();
  const email = location.state.email;
  console.log("email");
  console.log(email);
  const[isvarify,setIsVarify] = useState(false);
  const[code,setCode] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const sendtoDB = async (data) =>{
    try{
      let otp = data;
      const response = await axios.post('http://localhost:8080/api/v1/verifyemail',{email,otp})
      console.log(response);
      setIsVarify(response);
      // 
    }
    catch(err){       
     console.log(err);
     
    }
  }

  return (
    <>
      {isvarify && <Navigate to='/login' replace={true}  ></Navigate>}
      <form 
          onSubmit={handleSubmit((data)=>{
                        console.log(data.otp)
                        setCode(data.otp);
                        sendtoDB(data.otp);
                        })
                  }
          className=" w-full h-screen bg-[#fff] overflow-hidden"
      >
      
          <div className="absolute sm:w-[350px] sm:left-1 lg:left-36 md:left-20 lg:top-20 lg:w-[80%] lg:h-[95%]">   
              <img
                className="absolute hidden lg:block sm:top-[0px] lg:left-[700px] rounded-[30px] lg:w-[600px] h-[700px] object-cover"
                alt=""
                src="/rectangle-20@2x.png"
              />          
            <div className="absolute top-[100px] sm:top-10 sm:w-[340px] sm:left-2 md:left-5 md:w-[600px] lg:w-[460px] lg:left-[100px] flex flex-col items-start justify-start gap-[48px]">
              <div className="flex flex-col sm:w-[340px] md:w-[600px] lg:w-[460px] items-start justify-start gap-[16px]">
                <div className="w-[460px] sm:w-[340px] md:w-[600px] lg:w-[460px] flex flex-col items-start justify-start gap-[16px]">
                  <h1 className="m-0 self-stretch relative text-21xl font-semibold font-Poppins text-t text-left">
                    Verify Code
                  </h1>
                  <p className="m-0 self-stretch relative text-base font-Poppins text-t text-left opacity-[0.75]">
                    An authentication code has been send to your email
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start justify-start ">
                  <p className='text-[12px] pb-2'>Didn't recieve any code?<span className='text-red-500'> Resend</span></p>
                  <div className="flex flex-col items-start justify-start h-[100px]" >
                      <div className="w-[460px] relative sm:w-[340px] md:w-[600px] lg:w-[460px] rounded-t rounded-b-none h-14 flex flex-col items-start justify-start">                    
                          <input
                          id="otp"
                          className="[outline:none] top-3  font-Poppins text-base bg-[#fff] self-stretch rounded flex flex-col items-start justify-start p-4 text-[#1c1b1f] border-[1px] border-solid border-[#79747e]"
                          placeholder="Enter Code"
                          type={showPassword ? 'text':'password'}
                          {...register("otp", 
                                      { required:"Please enter the code",
                                      } )}                        
                          />
                          {errors.password && <span className='text-red-500 absolute top-[54px]'>{errors.password.message}</span>}
                          <span className='absolute right-0' onClick={()=>setShowPassword((prev)=>!prev)}>
                              {!showPassword ? 
                                  <IoEye className='absolute cursor-pointer w-[24px] h-[24px] top-4 right-4'/>:
                                  <IoEyeOff className='absolute cursor-pointer w-[24px] h-[24px] top-4 right-4'/>
                              }
                          </span>
                      </div>    
                  </div>
                <button type='submit' className=" self-stretch  rounded bg-p h-12 r py-2 px-4 box-border cursor-pointer [border:none] p-0 bg-[transparent] w-[460px] sm:w-[340px] md:w-[600px] lg:w-[460px] flex flex-col items-center justify-center">                
                    <p className="relative text-sm font-semibold font-Poppins text-[#f3f3f3] text-left">
                      Verify
                    </p>              
                </button>
              </div>
            </div>
          </div>       
      </form>
      
    </>
  );
};

export default SetPassword;