import React from 'react';

const SignUp = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
        <form className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Name</label>
            <input type="text" className="w-full border rounded px-3 py-2" placeholder="Enter your name" />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Email</label>
            <input type="email" className="w-full border rounded px-3 py-2" placeholder="Enter your email" />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Password</label>
            <input type="password" className="w-full border rounded px-3 py-2" placeholder="Enter your password" />
          </div>
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded font-bold">Sign Up</button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account? <a href="/signin" className="text-blue-600 underline">Sign In</a>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 