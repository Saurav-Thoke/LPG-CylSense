import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {/* Toggle Button */}
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            {isLogin ? 'Create an Account' : 'Already have an account? Log In'}
          </button>
        </div>

        {/* Render Login or Register based on toggle state */}
        {isLogin ? <Login /> : <Register />}
      </div>
    </div>
  );
};

export default AuthPage;
