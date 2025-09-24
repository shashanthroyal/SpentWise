import { useState } from "react";
import { useNavigate , Link } from "react-router-dom";
import axios from 'axios';

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
        <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6'}}>
            <div style={{background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 4px 24px #0001', width: '100%', maxWidth: 400}}>
                <h2 style={{textAlign: 'center'}}>Register</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" placeholder="Name" onChange={handleChange} required style={{width: '100%', padding: 8, marginBottom: 12, borderRadius: 8, border: '1px solid #ccc'}} />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required style={{width: '100%', padding: 8, marginBottom: 12, borderRadius: 8, border: '1px solid #ccc'}} />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required style={{width: '100%', padding: 8, marginBottom: 12, borderRadius: 8, border: '1px solid #ccc'}} />
                    <button type="submit" style={{width: '100%', background: '#2563eb', color: '#fff', padding: 10, borderRadius: 8, border: 'none', fontWeight: 600}}>Register</button>
                    <div style={{marginTop: 16, textAlign: 'center'}}>
                      <span>Already have an account? </span>
                      <Link to="/login" style={{color: '#2563eb', fontWeight: 600, textDecoration: 'none'}}>Login</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}


export default Register;