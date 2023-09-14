import { useEffect, useState } from "react";
import "./style.css"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import { useNavigate } from "react-router-dom";
import Motion from "./spinner";
import Typed from "react-typed";










const Test = () => {
    const navigate = useNavigate()
    function register() {
        let x = document.getElementById('register');
        let y = document.getElementById('login');
        let z = document.getElementById('btn');
        x.style.left = '50px';
        y.style.left = '450px';
        z.style.left = '0px';
    }
    function login() {

        let x = document.getElementById('register');
        let y = document.getElementById('login');
        let z = document.getElementById('btn');

        x.style.left = '-400px';
        y.style.left = '50px';
        z.style.left = '110px';


    }
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isChecked, setChecked] = useState(false)
    const [loading, setLoading] = useState(false);



useEffect(()=>{
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
        window.history.go(1);
    };
},[])



    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = { name, email, password };
        if (isChecked) {
            setLoading(true);
            axios.post("https://chathutmessageappbackend.onrender.com/api/user/register", userData).then(response => {
                setLoading(false);
                login()
                toast.success(response.data, {
                    position: "top-center"
                });
            })
                .catch(error => {
                    setLoading(false)
                    toast.error(error.response.data, {
                        position: "top-center"
                    });
                })
        }
        else
            toast.error("Please Click the Check Box", {
                position: "top-center"
            });
    }

    axios.defaults.withCredentials = true;




    const submit = (e) => {
        e.preventDefault();
        setLoading(true)
        axios.post("https://chathutmessageappbackend.onrender.com/api/user/login", { email, password }).then(response => {
            setLoading(false)
            navigate(`/dashboard/${response.data.name}/${response.data._id}`)

        })
            .catch(error => {
                setLoading(false)
                toast.error(error.response.data, {
                    position: "top-center"
                });
            })

    }


    const hand = (e) => {
        e.preventDefault();
        axios.get("https://chathutmessageappbackend.onrender.com/api/user/authenticate").then(response => {
            navigate(`/dashboard/${response.data.name}/${response.data._id}`)

        })

            .catch(error => {
                toast.error(error.response.data, {
                    position: "top-center"
                })
                login()
            })



    }









    return (
        <>
            <div className="full-page">
                <div className="navbar">
                    <div>
                        <h2><em>ChatHut</em></h2>
                        <Typed
                          strings={[
                              "Welcome to ChatHut",
                              "Stay Tunned with us",
                              "Stay Connected with us",
                          ]}
                       typeSpeed={250}
                       backSpeed={150}
                       loop
                      />
                    </div>

                    <nav>
                        <ul id='MenuItems'>
                            <li><button className='loginbtn' onClick={register}>Register</button></li>
                            <li><button className='loginbtn' onClick={login}>Login</button></li>
                            <li><button className='loginbtn' onClick={hand}>Chat</button></li>

                        </ul>
                    </nav>

                </div>

                <div id='login-form' class='login-page'>
                    <div class="form-box">
                        <div class='button-box'>
                            <div id='btn'></div>
                            <button type='button' class='toggle-btn'>Register</button>
                            <button type='button' class='toggle-btn'>Login</button>
                        </div>
                        <form id='login' class='input-group-login'>
                            <input type='text' class='input-field' placeholder='Email Id' value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <input type='password' class='input-field' placeholder='Enter Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <input type='checkbox' class='check-box' /><span>Remember Password</span>
                            <button type='submit' class='submit-btn' onClick={submit} >Log in</button>
                        </form>

                        <form id='register' class='input-group-register'>
                            <input type='text' class='input-field' placeholder='Your Name' value={name} onChange={(e) => setName(e.target.value)} required />
                            <input type='email' class='input-field' placeholder='Your Email Id' value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <input type='password' class='input-field' placeholder='Enter Your Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <input type='checkbox' class='check-box' onChange={() => setChecked(!isChecked)} /><span>I agree to the terms and conditions</span>
                            <button type='submit' class='submit-btn' onClick={handleSubmit} >Register</button>
                        </form>

                    </div>
                </div>

            </div>
           





            <ToastContainer />


            {
                loading ? <Motion /> : console.log("")
            }
            

        </>
    )


}

export default Test;

