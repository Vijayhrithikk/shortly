import { useState } from "react"

import { signup } from "../api/auth"


export default function SignupPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")


    const handleSignup = async()=>{
        try{
            const data = await signup(email,password)
            console.log(data)
            alert("Signup successful")
        } catch(err) {
            console.log(err)
            alert("Signup Failed")
        }
    }
   return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-3xl font-bold">
          Signup
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
          onClick={handleSignup}
          className="w-full bg-black text-white p-3 rounded"
        >
          Signup
        </button>
      </div>
    </div>
  )
}