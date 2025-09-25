import { useState } from "react";
import axios from "axios";
import { useNavigate , Link } from "react-router-dom";

export default function Login(){

    const [form , setForm] = useState({email: "" , password: ""});
     const [showPassword, setShowPassword] = useState(false);


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
        <div className="auth-bg">
            <div className="auth-box">
                <h2 className="auth-title">Login</h2>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required /> <br />
                    <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" onChange={handleChange} required /><br />
                    <div className="auth-password"><input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />Show Password</div>
                    <button type="submit">Login</button>
                    <div className="auth-link-wrap">
                      <span>Don't have an account? </span>
                      <Link className="auth-link" to="/register">Register</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}