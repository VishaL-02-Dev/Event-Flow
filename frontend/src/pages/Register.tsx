import React, { useState } from 'react'

const Register = () => {
    const [form,setForm]=useState({
        name:"",
        email:"",
        password:""
    })
  return (
    <div>
        <h1>Register page</h1>
        <input type='text' value={form.name} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setForm({...form,name:e.target.value})}></input>
        <input type='email' value={form.email} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setForm({...form,email:e.target.value})}></input>
        <input type='password' value={form.password} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setForm({...form,password:e.target.value})}></input>
    </div>

  )
}

export default Register