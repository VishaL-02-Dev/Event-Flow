import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [form,setForm]=useState({
        email:"",
        password:""
    });

    const navigate=useNavigate();
  return (
    <div>

    <h1>Login Form</h1>
    <input type='email' value={form.email} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setForm({...form,email:e.target.value})}></input>
    <input type='password' value={form.password} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setForm({...form,password:e.target.value})}></input>
    <button>Submit</button>
    </div>
  )
}

export default Login