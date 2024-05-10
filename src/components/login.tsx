"use client"

import { useEffect, useState } from 'react';


const Login = () => {
    const CLIENT_ID = "0e51a07bdc884a7e80bf88b14a485db6";
    const REDIRECT_URI = "http://localhost:5173/dashboard";
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
    const RESPONSE_TYPE = "token";
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const handleAuth = () => {
            const hash = window.location.hash;
            if (hash) {
                const params = new URLSearchParams(hash.substring(1));
                const error = params.get('error');
                if (error) {
                    console.error('Authorization error:', error);
                    return;
                }
        
                const token = params.get('access_token');
                if (token) {
                    setToken(token);
                    window.location.hash = "";
                    window.localStorage.setItem("token", token);
                }
            }
        };

        handleAuth();

        // Cleanup
        window.removeEventListener("hashchange", handleAuth);

        // Check if token exists in localStorage
        const localToken = window.localStorage.getItem("token");
        if (localToken) {
            setToken(localToken);
        }

        // Add event listener for hash changes
        window.addEventListener("hashchange", handleAuth);

        return () => {
            window.removeEventListener("hashchange", handleAuth);
        };
    }, []);

    const logout = () => {
        setToken(null);
        window.localStorage.removeItem("token");
    };

    return (
        <>
            <div className='h-screen w-full bg-amber-300 flex justify-center items-center'>
                <header className="App-header text-center">
                    <h1 className='text-5xl font-bold text-red-700'>Spotify React</h1>
                    {!token ?
                        <a
                            className='py-1 inline-block mt-6 px-3 bg-green-600 hover:bg-green-800 rounded-lg text-white'
                            href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login
                            to Spotify</a>
                        : <button
                            className='py-1 mt-6 px-3 bg-green-600 hover:bg-green-800 rounded-lg text-white'
                            onClick={logout}>Logout</button>}
                </header>
            </div>
        </>
    );
};

export default Login;
