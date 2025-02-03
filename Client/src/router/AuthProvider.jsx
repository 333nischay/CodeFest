import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const decodeToken = (token) => {
        try {
          return jwtDecode(token);
        } catch (error) {
          return null;
        }
      };
  const backend_Url = import.meta.env.VITE_BACKEND_URL;
  const [info, setInfo] = useState(JSON.stringify(decodeToken(localStorage.getItem("accessToken"))) || null)
  const [token, setToken] = useState(localStorage.getItem("accessToken") || "");
//   useEffect(() => {
//     const refresh = async() => {
//       let accessToken = localStorage.getItem("accessToken");
//       if(accessToken == null){
//         return;
//       }
//       let Info = decodeToken(accessToken);
//       if(!Info){
//         try {
//           const response = await fetch(`${backend_Url}/api/v1/users/refresh`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ refreshToken: localStorage.getItem("refreshToken") }),
//             credentials: "include", 
//           })
//            const res = await response.json();
           
//            if (res.data.accessToken) {
          
//             setToken(res.data.accessToken && res.data.refreshToken);
//             localStorage.setItem("accessToken", res.data.accessToken);
//             localStorage.setItem("refreshToken",res.data.refreshToken)
//             // navigate(prevLocation?prevLocation:'/dashboard');
//             accessToken = localStorage.getItem("accessToken");
//            Info = decodeToken(accessToken);
//            setInfo(JSON.stringify(Info))
//            return;
//           }
//           localStorage.removeItem("accessToken");
//         } catch (err) {
//           console.error(err);
//         }
//       }
//       setInfo(JSON.stringify(Info));
         
//     };
   
//     refresh();
    
//   }, [])
  




  const navigate = useNavigate();
  const loginAction = async (data, prevLocation) => {
    try {
      const response = await fetch(`${backend_Url}/api/v1/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      })
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
      
        
        setToken(res.data.accessToken);
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        setInfo(JSON.stringify(decodeToken(res.data.accessToken)));
        navigate(prevLocation?prevLocation:'/');
        return true;
      
      
    } catch (err) {
      
      console.log(err.message); //pop up error message
      return false;
    }
  };

  const logOut = async() => {
    try {
      const response = await fetch(`${backend_Url}/api/v1/users/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include", 
        
      })
       const res = await response.json();
      
      
      setToken("");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // navigate("/login");
      
    } catch (err) {
      console.error(err);
    }
    
  };

  const Register = async(data)=>{
    try{
      const response = await fetch(`${backend_Url}/api/v1/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      })
       const res = await response.json();
       console.log(res)
       if (res.statusCode == 200) {
        
        console.log(res.message);      
        return true;
      }

    }catch(err){
      console.log("Error while registration")
    }
    
  }
  const verifyRegistration = async(data)=>{
    try {
      const response = await fetch(`${backend_Url}/api/v1/users/verifyRegistration`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      })
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
       
      
      if (res.data.accessToken && res.data.refreshToken) {
        
        setToken(res.data.accessToken);
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        setInfo(JSON.stringify(decodeToken(res.data.accessToken)));
        navigate('/');
        return;
      }
    } catch (err) {
      console.error(err);
    }
  }
  const forgotPassword = async(data)=>{
    try{
      const response = await fetch(`${backend_Url}/api/v1/users/forgotPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      })
       const res = await response.json();
       console.log(res)
       if (res.statusCode == 200) {
        
        console.log(res.message);      
        return true;
      }

    }catch(err){
      console.log("Error while registration")
    }
  }
  const verifyForgotPassword = async(data)=>{
    try {
      const response = await fetch(`${backend_Url}/api/v1/users/verifyForgotPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      })
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
       
      
      if(res.statusCode == 200) {
        
        console.log(res.message);      
        return true;
      }
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <AuthContext.Provider value={{ info,backend_Url,token, loginAction, logOut,Register,verifyRegistration,forgotPassword,verifyForgotPassword }}>
      {children}
    </AuthContext.Provider>
  );

};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
