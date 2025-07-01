import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted with:', { email, password });
        try {
            await login(email, password);
            console.log('Login successful, navigating to /');
            toast.success('Logged in successfully!');
            navigate('/'); // Changed to '/'
        } catch (error) {
            console.error('Login component error:', error);
            toast.error(error as string);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            console.log('Test navigate clicked');
                            navigate('/'); // Changed to '/'
                        }}
                        className="w-full mt-4 bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600"
                    >
                        Test Navigate
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;