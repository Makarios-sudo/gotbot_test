import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';


const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/users/login', {
                email,
                password
            });

            const { token, user } = response.data;
            login(user, token);
            navigate('/dashboard');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage("Invalid credentials");
            } else {
                throw new Error('Login failed. Please try again.');
            }
        }
    };

    return (
        <React.Fragment>
            <div className='auth_container'>
                <h1 className=''> Login </h1>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <form
                    onSubmit={handleSubmit}
                    className='auth_form'
                >
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        className='form_value'
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className='form_value'
                    />
                    <button className='CTA_button' type="submit">Submit</button>
                </form>

            </div>
        </React.Fragment>
    )
}

export default LoginForm