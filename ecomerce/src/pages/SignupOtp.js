import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUpotp = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get email from localStorage
    const storedEmail = localStorage.getItem('signupEmail');
    console.log('Stored email in OTP page:', storedEmail);
    
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      console.log('No email found in localStorage, redirecting to signup');
      // If no email found, redirect to signup
      navigate('/signup');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setVerifying(true);

    try {
      console.log('Verifying OTP for email:', email, 'OTP:', otp);
      const response = await axios.post('http://localhost:8080/api/v1/verifyemail', {
        email: email,
        otp: otp
      });

      console.log('Verification response:', response.data);
      if (response.data.success) {
        // Set verification success message
        setResendSuccess('Email verified successfully! Redirecting to login...');
        
        // Clear the stored email
        localStorage.removeItem('signupEmail');
        
        // Wait a moment before redirecting
        setTimeout(() => {
          // Redirect to login page
          navigate('/login', { 
            replace: true,
            state: { 
              verificationSuccess: true, 
              email: email 
            }
          });
        }, 1500);
      } else {
        setError(response.data.message || 'Verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setResendSuccess('');
    setResending(true);
    
    try {
      console.log('Resending OTP for email:', email);
      const response = await axios.post('http://localhost:8080/api/v1/resendotp', {
        email: email
      });

      console.log('Resend response:', response.data);
      if (response.data.success) {
        setResendSuccess('A new OTP has been sent to your email');
      } else {
        setError(response.data.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      console.error('Resend error:', error);
      // If resendotp endpoint doesn't exist, try the signup endpoint
      try {
        const signupResponse = await axios.post('http://localhost:8080/api/v1/signup', {
          email: email,
          resendOtp: true
        });
        console.log('Signup resend response:', signupResponse.data);
        setResendSuccess('A new OTP has been sent to your email');
      } catch (secondError) {
        console.error('Signup resend error:', secondError);
        setError('Could not resend OTP. Please go back to signup.');
      }
    } finally {
      setResending(false);
    }
  };

  // Debug component rendering
  console.log('Rendering OTP verification component with email:', email);

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-12 w-auto"
          src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png"
          alt="E-Commerce Logo"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Verify your email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please enter the OTP sent to {email || "your email"}
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="otp" className="block text-sm font-medium leading-6 text-gray-900">
              Enter OTP
            </label>
            <div className="mt-2">
              <input
                id="otp"
                name="otp"
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Enter 6-digit OTP"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          {resendSuccess && (
            <div className="text-green-500 text-sm text-center bg-green-50 p-2 rounded">
              {resendSuccess}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={verifying}
              className={`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                verifying ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {verifying ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <button
            onClick={handleResendOTP}
            disabled={resending}
            className={`flex w-full justify-center rounded-md bg-white px-3 py-1.5 text-sm font-semibold leading-6 text-indigo-600 border border-indigo-600 hover:bg-indigo-50 ${
              resending ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {resending ? 'Sending...' : 'Resend OTP'}
          </button>
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          Want to use a different email?{' '}
          <button
            onClick={() => navigate('/signup')}
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Back to signup
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpotp;