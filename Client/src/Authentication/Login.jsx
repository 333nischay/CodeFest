import React from 'react'

import { useForm } from 'react-hook-form'

import { useAuth } from '../router/AuthProvider'
import { Link } from 'react-router-dom'


const Login = () => {
  

  
  
  
  const {
    register,
    handleSubmit,
    formState: { errors,isSubmitting },
  } = useForm()
  const auth = useAuth();
  const onSubmit = async (data) => {

    if(await auth.loginAction(data)){
      console.log("login");
    
    
  }}

  
  
  

  return (
    <>
    <div className='flex items-center flex-row h-screen'>
      <div className="border mx-auto flex flex-row">
        
        <div className="h-full bg-white p-16 flex flex-col justify-center items-center gap-4">
            <h1 className='text-2xl'>CodeEditor</h1>
            <h1 className='text-l text-black'>Login</h1>
         <form onSubmit={handleSubmit(onSubmit)} className='flex
           flex-col gap-6'>
            <div><p className='text-sm text-left text-slate-700'>Email</p>
              <input type="email" {...register("email",{required:{value: true, message:"This is required",}})} className='border w-96 px-4 py-2 rounded outline-none' autoComplete='off'/> 
              </div>
              <div>
              <p className='text-sm text-left text-slate-700'>Password</p>
              <input type="password" {...register("password")} className='border w-96 px-4 py-2 rounded outline-none'/>
              </div>
              <input disabled={isSubmitting} value={isSubmitting?"Submitting...": "Submit"} type="submit" className='border rounded w-1/2 mx-auto py-2 cursor-pointer hover:bg-blue-600 hover:text-white' />
           </form>
           <p className='text-sm'>New User? <Link to='/register' className='underline cursor-pointer'>Register</Link></p>
           <Link to='/forgotPassword' className='underline cursor-pointer'>Forgot Password</Link>
  
           
           
        </div>
      </div>
    
    </div>
    </>
  )
}

export default Login