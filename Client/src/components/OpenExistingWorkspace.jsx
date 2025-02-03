import React, { useEffect,useState } from 'react'
import { Link } from 'react-router-dom'
const OpenExistingWorkspace = () => {
    const [workSpaces, setworkSpaces] = useState([]);
    useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/getWorkspace`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Something went wrong');
          } else {
            throw new Error('Unexpected response format');
          }
        }

        const res = await response.json();
        setworkSpaces(res.data.workSpaces);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
    }, [])
  return (
    <>
    <div className='w-screen flex flex-col mt-20 items-center'>
        <div className='flex flex-row w-full justify-center gap-20 my-36 items-center'>
     {workSpaces.map((workspace) => (
        <Link to={`/workspace/${workspace._id}`} key={workspace._id} className='cursor-pointer border h-48 w-48 p-4 rounded-xl text-center text-while hover:bg-blue-700 hover:text-white'>
          <h1>{workspace.name}</h1>
          <p>{workspace.description}</p>
        </Link>
      ))}
      </div>
      </div>
    </>
  )
}

export default OpenExistingWorkspace