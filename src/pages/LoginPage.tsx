import React,{useState} from 'react'
import httpClient from '../httpClient';

function LoginPage() {
    const [email,setEmail] = useState<string>("");
    const [password,setPassword] = useState<string >("");

    const logInUser = async ()=>{
        console.log(email,password);
        try
        {const response = await httpClient.post("//localhost:5000/login",{email,password,});
        console.log(response.data["department"]);
        if(response.status === 200){
            console.log("Login Successfull");
            window.location.href = "/"+response.data["department"];
        }
        }catch(error:any){
            if(error.response.status === 400){
                console.log("Login Failed");
        }
    }
}

  return (
    <div>
      <h1>
        Login Page
      </h1>
      <form>
        <div>
        <label>Email : </label>
        <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" id = ""/> 
        </div>
        <div>
        <label>Password : </label>
        <input type="text" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" id = ""/> 
        </div>
        <button type="button" onClick={logInUser}>Login</button>
        </form>    
    </div>
  )
}

export default LoginPage
