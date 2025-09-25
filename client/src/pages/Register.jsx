import { useState } from "react";
import { useNavigate , Link } from "react-router-dom";
import axios from 'axios';
import './Auth.css'

const Register = () => {

    const [form , setForm] = useState({name:"",email:"",password:""});
    const navigate = useNavigate();

    const handleChange = (e)=> setForm({...form, [e.target.name] : e.target.value });

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/auth/register",form)
            alert("Register Successful")
            navigate('/login')
        } catch (error) {
            alert(error.response?.data.message || "Something went wrong");

        }
    }


    return(
        <div className="auth-bg">
            <div className="auth-box">
                <h2 className="auth-title">Register</h2>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                    <button type="submit">Register</button>
                    <div className="auth-link-wrap">
                      <span>Already have an account? </span>
                      <Link className="auth-link" to="/login">Login</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}


export default Register;