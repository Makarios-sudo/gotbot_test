import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const { register } = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register({ email, password, firstName, lastName });
            navigate('/login');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage("Please fill all forms");
            } else {
                throw new Error('Registration failed. Please try again.');
            }
        }
    };

    return (
        <React.Fragment>
            <div className='auth_container'>
                <h1> Register </h1>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <form
                    onSubmit={handleSubmit}
                    className='auth_form'
                >
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                        required
                        className='form_value'
                    />
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                        required
                        className='form_value'
                    />
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

export default RegisterForm