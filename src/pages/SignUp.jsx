import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { signInUser, signUpUser } from '../services/userService';
import { emailRegex, passwordRegex, phoneNumberRegex } from '../services/regex';

const SignUp = () => {

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    state: '',
    lga: '',
    city: '',
    address: ''
  });

  const [disableButton, setDisableButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useUser();

  // Check for language preference on component mount
  useEffect(() => {
    const selectedLanguage = localStorage.getItem('selectedLanguage');
    if (!selectedLanguage) {
      navigate('/language');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateInputs = () => {
    const { firstName, lastName, email, password, phoneNumber, state, lga, city, address } = formData;

    if (!firstName || !lastName || !password || !state) {
      setErrorMessage('First name, last name, state, and password are required.');
      return false;
    }

    if (!email && !phoneNumber) {
      setErrorMessage('Either email or phone number is required.');
      return false;
    }

    if (email && !emailRegex.test(email)) {
      setErrorMessage('Invalid email format.');
      return false;
    }

    if (phoneNumber && !phoneNumberRegex.test(phoneNumber)) {
      setErrorMessage('Invalid phone number. Use +2348012345678 or 08012345678 format.');
      return false;
    }

    if (!passwordRegex.test(password)) {
    setErrorMessage(
      'Password must be 8-30 chars, include upper- & lower-case letters, a digit, and a special char.'
    );
    return false;
  }

    if (lga && lga.length < 2) {
      setErrorMessage('LGA should be at least 2 characters if provided.');
      return false;
    }

    if (city && city.length < 2) {
      setErrorMessage('City should be at least 2 characters if provided.');
      return false;
    }

    if (address && address.length < 5) {
      setErrorMessage('Address should be at least 5 characters if provided.');
      return false;
    }

    return true;
  };

  const submitButtonSignUp = async () => {
    setErrorMessage('');

    if (!validateInputs()) return;

    setDisableButton(true);

    try {
      const response = await signUpUser(formData);

      let credentials = { password: formData.password };

      if (response.data.email) {
        credentials.email = response.data.email;
      } else if (response.data.phoneNumber) {
        credentials.phoneNumber = response.data.phoneNumber;
      }

      try {
      const authData = await signInUser(credentials);
      await login(authData);
      navigate('/');
    } catch (error) {
      setErrorMessage(error.message || 'Oops! Sign-in failed.');
    } finally {
      setDisableButton(false);
    }

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
    <div className="flex items-center justify-center min-h-screen pt-[80px] md:pt-[70px] bg-gray-50 px-4">
  <div className="bg-white rounded-lg shadow p-8 w-full max-w-2xl">
    <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>

    {errorMessage && (
      <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
        {errorMessage}
      </div>
    )}

    <form onSubmit={(e) => { e.preventDefault(); submitButtonSignUp(); }} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Personal Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-semibold">First Name</label>
            <input name='firstName' value={formData.firstName} onChange={handleChange} type="text" className="w-full border rounded px-3 py-2" placeholder="First name" />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Last Name</label>
            <input name='lastName' value={formData.lastName} onChange={handleChange} type="text" className="w-full border rounded px-3 py-2" placeholder="Last name" />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Password</label>
            <input name='password' value={formData.password} onChange={handleChange} type="password" className="w-full border rounded px-3 py-2" placeholder="Password" />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Contact Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-semibold">Email</label>
            <input name='email' value={formData.email} onChange={handleChange} type="email" className="w-full border rounded px-3 py-2" placeholder="Email address" />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Phone Number</label>
            <input name='phoneNumber' value={formData.phoneNumber} onChange={handleChange} type="text" className="w-full border rounded px-3 py-2" placeholder="e.g. +2348012345678 or 08012345678" />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Farm Location</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-semibold">State</label>
            <input name='state' value={formData.state} onChange={handleChange} type="text" className="w-full border rounded px-3 py-2" placeholder="Ondo" />
          </div>
          <div>
            <label className="block mb-1 font-semibold">LGA</label>
            <input name='lga' value={formData.lga} onChange={handleChange} type="text" className="w-full border rounded px-3 py-2" placeholder="e.g. Akure South" />
          </div>
          <div>
            <label className="block mb-1 font-semibold">City</label>
            <input name='city' value={formData.city} onChange={handleChange} type="text" className="w-full border rounded px-3 py-2" placeholder="Akure" />
          </div>
          <div className="sm:col-span-2">
            <label className="block mb-1 font-semibold">Address</label>
            <input name='address' value={formData.address} onChange={handleChange} type="text" className="w-full border rounded px-3 py-2" placeholder="Full address" />
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={disableButton}
          className={`w-full py-2 rounded font-bold text-white flex items-center justify-center gap-2 ${
            disableButton ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {disableButton && (
            <span className="animate-spin h-4 w-4 border-t-2 border-white border-solid rounded-full"></span>
          )}
          {disableButton ? 'Signing Up...' : 'Sign Up'}
        </button>
      </div>
    </form>

    <div className="mt-6 text-center text-sm">
      Already have an account? <Link to="/signin" className="text-blue-600 underline">Sign In</Link>
    </div>
  </div>
</div>

  );
};

export default SignUp;
