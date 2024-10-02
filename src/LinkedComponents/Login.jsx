import { useRef, useState } from 'react';
import '../stylesheets/login.css'
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo.png';
import axios from 'axios';
import {toast} from 'react-hot-toast';

// axios.defaults.withCredentials = true;

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const showPasswordRef = useRef();
    const hidePasswordRef = useRef();
    const passwordInput = useRef();
    const [hidden, setHidden] = useState(true);
    const loginButton = useRef();
    const handleShowPassword = () => {
        if(hidden) {
            setHidden(!hidden);
            showPasswordRef.current.style.display = "none";
            hidePasswordRef.current.style.display = "block";
            passwordInput.current.setAttribute("type", "text");
        }
        else {
            setHidden(!hidden);
            showPasswordRef.current.style.display = "block";
            hidePasswordRef.current.style.display = "none";
            passwordInput.current.setAttribute("type", "password");
        }
    }
    const LoginUser = async () => {
        loginButton.current.disabled = true;
        const loginPromise = axios.post('http://localhost:3000/login',JSON.stringify({Email: email.toLowerCase(), Password: password}), {
            headers: {
                Accept: 'application/form-data',
                'Content-Type': 'application/json'
            }
        });
        toast.promise(loginPromise, {
            loading: "Logging in...",
            success: response => {
                localStorage.setItem('auth-token', response.data.token);
                loginButton.current.disabled = false;
                setTimeout(() => window.location.replace("/"), 1500);
                return "Login Successful!";
            },
            error: error => {
                loginButton.current.disabled = false;
                return error.response.data.errors;
            }
        });
    }
    if(localStorage.getItem('auth-token')) {
        window.location.replace('/');
    }
    else {
        return (
            <div className="Login">
                <div className="container">
                    <div className="loginForm">
                        <Link to='/' className="Logo"><img src={Logo} alt="Nutriipute" /></Link>
                        <label htmlFor="email">Email</label>
                        <input type="text" value={email} id="email" onChange={(e) => setEmail(e.target.value)}/>
                        <label htmlFor="password">Password</label>
                        <div className='passwordDiv'>
                            <input type="password" ref={passwordInput} value={password} onChange={(e) => setPassword(e.target.value)} id="password"/>
                            <div className="eyeBtn" onClick={handleShowPassword}>
                                <i ref={showPasswordRef} className="fa-regular fa-eye"></i>
                                <i ref={hidePasswordRef} className="fa-regular fa-eye-slash"></i>
                            </div>
                        </div>
                        <button ref={loginButton} onClick={LoginUser}>Login</button>
                        <p>New customer? <Link to="/Register" onClick={() => window.scrollTo(0, 69)}>Register</Link></p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;