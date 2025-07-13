import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext'

const SignIn = () => {
  const email = useRef(null);
  const password = useRef(null);
  const [inputEmptyState, setInputEmptyState] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [signInErrorMessage, setSignInErrorMessage] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUser();

  // Accessing the API
  const getSignInData = async () => {
    const endpoint = 'https://weather-app-backend-fdzb.onrender.com/users/auth';
    const userInput = {
      email: email.current.value,
      password: password.current.value
    };

    const apiCall = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userInput),
    };

    try {
      const response = await fetch(endpoint, apiCall);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Server Error: ${response.status}`);
      }

      return data;
    } catch (error) {
      // An alert message that disappears after 10seconds if there is an error signing in
      setErrorMessage(error.message || 'Oops! Sign-in failed.');
      setTimeout(() => setErrorMessage(''), 10000);
      return null;
    }
  };

  // Setting the onclick function for the submit buttom.
  const submitButtonSignIn = async () => {
    const emailVal = email.current.value.trim();
    const passwordVal = password.current.value.trim();

    if (!emailVal || !passwordVal) {
      setInputEmptyState(true)
      return;
    }

    setInputEmptyState(false)
    setDisableButton(true);
    const signInData = await getSignInData();

    if (signInData.status === 200) {
      setUser(signInData)
      navigate('/')
    } else{
      setDisableButton(false)
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
          {inputEmptyState && (
            <p className="text-sm text-red-600 font-medium mb-2">
              Email and password are required.
            </p>
          )}
          <div>
            <label className="block mb-1 font-semibold">Email</label>
            <input ref={email} type="email" className="w-full border rounded px-3 py-2" placeholder="Enter your email" />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Password</label>
            <input ref={password} type="password" className="w-full border rounded px-3 py-2" placeholder="Enter your password" />
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
