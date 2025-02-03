import React from 'react'
import { useAuth } from '../router/AuthProvider'
import { Link } from 'react-router-dom';
const Navbar = () => {
    const auth = useAuth();
    const Logout = async() => {
        if(await auth.logOut()){
            console.log("Logged out");
        }
    }
  return (
    <div className='fixed top-0 h-20 w-full bg-blue-950 text-white'>
        <div className='flex items-center justify-between h-full px-4'>
            <h1 className='text-2xl'>Codeditor</h1>
            <div className='flex items-center gap-4'>
            <Link to='/Editor'>Editor</Link>
            {auth.token && <button onClick={Logout} className='cursor-pointer'>Logout</button>}
            {!auth.token && <Link to='/login' className='cursor-pointer'>Login</Link>}
            {!auth.token && <Link to='/register' className='cursor-pointer'>Register</Link>}     
            
                   
            </div>
        </div>
    </div>
  )
}

export default Navbar