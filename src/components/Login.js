import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

const Login = (props) => {
    let history = useNavigate();
    const [credentials, setCredentials] = useState({email: "", password:""});
    const handleSubmmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({email: credentials.email, password: credentials.password}),
        });
        const json = await response.json();
        if(json.success){
            //save the auth-token and redirect
            localStorage.setItem('token', json.authtoken);
            props.showAlert("Logged In Successfully!", "success");
            history("/");
        }else{
            props.showAlert("Invalid Credentials", "danger");
        }
        console.log(json);
    }

    const onChange = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

  return (
    <div className='mt-5'>
    <h2>Login To notesOnCloud</h2>
    <form onSubmit={handleSubmmit}>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email address</label>
        <input type="email" className="form-control" id="email" value={credentials.email} onChange={onChange} name="email" placeholder="name@example.com" />
      </div>
      <div>
        <label htmlFor="password" className="form-label">Password</label>
        <input type="password" id="password" value={credentials.password} onChange={onChange} name="password" className="form-control" aria-labelledby="passwordHelpBlock" />
        <div id="passwordHelpBlock" className="form-text">
          Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
        </div>
      </div>
      <button type="submit" className="btn btn-primary" >Submit</button>
    </form>
    </div>
  );
}

export default Login;
