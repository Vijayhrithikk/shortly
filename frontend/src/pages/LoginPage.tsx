import { useState } from "react"

import { login } from "../api/auth"




export default function LoginPage() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handlelogin = async()=>{
    try{
      const data = await login(email,password)

      localStorage.setItem("token", data.token)
      alert("Login Successfull")
    }catch(err) {
      console.log(err)

      alert("Login Failed")
    }
  }


   return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-3xl font-bold">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          onClick={handlelogin}
          className="w-full bg-black text-white p-3 rounded"
        >
          Login
        </button>
      </div>
    </div>
  )
}