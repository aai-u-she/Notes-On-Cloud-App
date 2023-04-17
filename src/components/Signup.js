import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

const Signup = (props) => {

  let history = useNavigate();
    const [credentials, setCredentials] = useState({name: "", email: "", password:"", cpassword: ""});
    const handleSubmmit = async (e) => {
        e.preventDefault();
        const {name, email, password} = credentials;
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            method: "POST", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({name, email, password}),
        });
        const json = await response.json();
        console.log(json);
        if(json.success){
          //save the auth-token and redirect
          localStorage.setItem('token', json.authtoken);
          props.showAlert("Your Account Created Successfully!", "success");
          history("/");
        }else{
          props.showAlert("Invalid Credentials", "danger");
        }
    }
    const onChange = (e) => {
      setCredentials({...credentials, [e.target.name]: e.target.value})
    }

  return (
    <div className='container mt-5'>
       <h2>Create An Account To Use notesOnCloud</h2>
      <form onSubmit={handleSubmmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" name="name" onChange={onChange} aria-describedby="name" />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input type="email" className="form-control" id="email" name="email" onChange={onChange} aria-describedby="email" />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name="password" onChange={onChange} minLength={5} required />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">Confirm Password</label>
          <input type="password" className="form-control" id="cpassword" name="cpassword" onChange={onChange} minLength={5} required/>
        </div>
       
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default Signup;
