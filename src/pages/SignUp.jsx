import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext'
import { signUpUser } from '../services/userService';

const SignUp = () => {

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: ''
  });

  const [disableButton, setDisableButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateInputs = () => {
    const { firstName, lastName, email, password, phoneNumber } = formData;

    if (!firstName || !lastName || !password) {
      setErrorMessage('First name, last name, and password are required.');
      return false;
    }

    if (!email && !phoneNumber) {
      setErrorMessage('Either email or phone number is required.');
      return false;
    }

    if (email && !/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage('Invalid email format.');
      return false;
    }

    return true;
  };


  const submitButtonSignUp = async () => {
    setErrorMessage('');

    if (!validateInputs()) return;

    setDisableButton(true);

    try {
      const data = await signUpUser(formData);
      setUser(data);
      navigate('/');
    } catch (error) {
      if (error.message.includes("already exists")) {
        setErrorMessage('An account with this email or phone number already exists.');
      } else {
        setErrorMessage(error.message || 'Oops! Sign-up failed.');
      }
    } finally {
      setDisableButton(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {errorMessage}
          </div>
        )}
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); submitButtonSignUp(); }}>
          <div>
            <label className="block mb-1 font-semibold">First Name</label>
            <input name='firstName' value={formData.firstName} onChange={handleChange} type="text" className="w-full border rounded px-3 py-2" placeholder="Enter your first name" />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Last Name</label>
            <input name='lastName' value={formData.lastName} onChange={handleChange} type="text" className="w-full border rounded px-3 py-2" placeholder="Enter your last name" />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Email</label>
            <input name='email' value={formData.email} onChange={handleChange} type="email" className="w-full border rounded px-3 py-2" placeholder="Enter your email" />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Phone Number</label>
            <input name='phoneNumber' value={formData.phoneNumber} onChange={handleChange} type="text" className="w-full border rounded px-3 py-2" placeholder="Enter your phone number" />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Password</label>
            <input name='password' value={formData.password} onChange={handleChange} type="password" className="w-full border rounded px-3 py-2" placeholder="Enter your password" />
          </div>
          <button
            type="submit"
            disabled={disableButton}
            className={`w-full py-2 rounded font-bold text-white ${disableButton ? 'bg-gray-400' : 'bg-green-600'}`}
          >
            {disableButton ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account? <a href="/signin" className="text-blue-600 underline">Sign In</a>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 