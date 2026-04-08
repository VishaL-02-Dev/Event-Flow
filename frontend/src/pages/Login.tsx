import React, { useState } from 'react'

const Login = () => {
    const [form,setForm]=useState({
        email:"",
        password:""
    });
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