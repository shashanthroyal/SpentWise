import { useState } from "react";
import axios from "axios";
import { useNavigate , Link } from "react-router-dom";

export default function Login(){

    const [form , setForm] = useState({email: "" , password: ""});
    const navigate = useNavigate();

    const handleChange = (e) => setForm({...form , [e.target.name]: e.target.value});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const {data} = await axios.post("http://localhost:5000/api/auth/login", form);
            localStorage.setItem("token" , data.token);
            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
            }
            alert("Login Successful");
            navigate("/")
        } catch (error) {
            alert(error.response?.data?.message || "Invalid Credentials");   
        }  
    }


    return(
        <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6'}}>
            <div style={{background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 4px 24px #0001', width: '100%', maxWidth: 400}}>
                <h2 style={{textAlign: 'center'}}>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required style={{width: '100%', padding: 8, marginBottom: 12, borderRadius: 8, border: '1px solid #ccc'}}/> <br />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required style={{width: '100%', padding: 8, marginBottom: 12, borderRadius: 8, border: '1px solid #ccc'}}/><br />
                    <button type="submit" style={{width: '100%', background: '#2563eb', color: '#fff', padding: 10, borderRadius: 8, border: 'none', fontWeight: 600}}>Login</button>
                    <div style={{marginTop: 16, textAlign: 'center'}}>
                      <span>Don't have an account? </span>
                      <Link to="/register" style={{color: '#2563eb', fontWeight: 600, textDecoration: 'none'}}>Register</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}