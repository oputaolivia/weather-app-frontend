import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { signInUser } from '../services/userService';

const SignIn = () => {
  const [formData, setFormData] = useState({
    identifier: '',
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
    const { identifier, password } = formData;

    if (!identifier || !password) {
      setErrorMessage('Email/Phone and password are required.');
      return false;
    }

    const isEmail = /\S+@\S+\.\S+/.test(identifier);
    const isPhone = /^\d{11,13}$/.test(identifier);

    if (!isEmail && !isPhone) {
      setErrorMessage('Enter a valid email or phone number.');
      return false;
    }
    return true;
  };

  const submitButtonSignIn = async () => {
    setErrorMessage('');

    if (!validateInputs()) return;

    setDisableButton(true);
    const { identifier, password } = formData;
    const payload = {password};

    if (/\S+@\S+\.\S+/.test(identifier)) {
      payload.email = identifier;
    } else {
      payload.phoneNumber = identifier;
    }
    try {
      const data = await signInUser(payload);
      setUser(data);
      navigate('/');
    } catch (error) {
      setErrorMessage(error.message || 'Oops! Sign-in failed.');
    } finally {
      setDisableButton(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Sign In</h1>
        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {errorMessage}
          </div>
        )}
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); submitButtonSignIn(); }}>
          <div>
            <label className="block mb-1 font-semibold">Email or Phone Number</label>
            <input
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              type='text'
              className="w-full border rounded px-3 py-2"
              placeholder="Enter your email or phone number"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Password</label>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={disableButton}
            className={`w-full py-2 rounded font-bold text-white ${disableButton ? 'bg-gray-400' : 'bg-green-600'}`}
          >
            {disableButton ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          Don't have an account? <a href="/signup" className="text-blue-600 underline">Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
