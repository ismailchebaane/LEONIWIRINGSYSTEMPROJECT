import React,{useState,useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import  axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
export default function Register() {
    const Navigate=useNavigate()
    const [alertt,setalert]=useState(false);
    const [loading,setloading]=useState(false);
    const [alertfalse,setalertfalse]=useState(false);

    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
  
  
    const  handleSubmit=async(e)=>{
      setloading(true)
   
      
        
fetch("http://localhost:4000/api/auth/register",{
    method:"POST",
    crossDomain:true,
    headers:{
        "content-type":"application/json",
        Accept:"application/json",
        "Access-Control-Allow-Origin":"*",
    
    },body:JSON.stringify({	
     
        email,
        password,
    }),
    
    }).then((res)=>res.json()).then((res)=>{console.log(res)
        if(res.status===200){
          setloading(false)
          setalert(true);
            Navigate('/login')
        }else{
          setTimeout(() => {
            setalertfalse(false);
    
        }, 2000);
        setalertfalse(true);
          setloading(false)


        }
    
    }).then((data)=>{
        console.log(data)
        
    })
   
     
          e.preventDefault()
    }
  return (
   
<div class="container  flex  justify-center  overflow-hidden items-center mb-14 lg:mb-0 lg:mt-20  md:mt-0   mt-0  box-border p-0 text-center overflow-x-hidden	h-[100vh]" >
<div className={alertt?"alert  flex justify-between absolute top-[20%] z-[999] max-w-sm alert-success shadow-lg":"hidden"}>
  <div>
    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    <span>Logged in with success  !</span>
  </div>
  <CloseIcon  onClick={()=>{setalert(false)}} className="cursor-pointer" />
</div>

<div  className={alertfalse?"alert alert-error  flex justify-between absolute top-[20%] z-[999] max-w-sm  shadow-lg":"hidden"}>
  <div>
    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    <span> Wrong input! try again.</span>
  </div>
  <CloseIcon  onClick={()=>{setalertfalse(false)}} className="cursor-pointer" />
</div>
<div className={loading&&" w-16 absolute top-[50%] left-[50%] h-16 border-4 border-dashed rounded-full border-orangew animate-spin dark:border-orangew"}></div>


<div class="container mx-auto max-w-lg px-4 py-8 md:p-12">
      <form class="flex flex-col gap-4" onSubmit={handleSubmit}>
        <h2 class="text-2xl text-center font-bold">Sign Up</h2>
        
        <div class="flex flex-col">
          <label class="font-semibold mb-1" for="email">Email address</label>
          <input class="border-2 rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                 type="email" name="email" id="email" autoComplete="false" required 
                 placeholder="example@gmail.com" value={email} 
                 onChange={(e)=>{setEmail(e.target.value)}} />
        </div>
        <div class="flex flex-col">
          <label class="font-semibold mb-1" for="password">Password</label>
          <input class="border-2 rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                 type="password" name="password" id="password" required 
                 placeholder="**********" value={password} 
                 onChange={(e)=>{setPassword(e.target.value)}} />
        </div>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">Register</button>
        <div class="flex flex-row justify-center">
          <h6 class="mr-2">Already have an account?</h6>
          <Link class="text-blue-500 font-bold underline" to="/login">Login</Link>
        </div>
      </form>
    </div>
</div>
  )
}
