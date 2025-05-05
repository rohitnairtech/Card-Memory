import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/axios';
import logo from '../assets/images/inverted-logo.webp';
import backgroundGif from '../assets/images/memory-bg.gif';
import buttonHoverSound from '../assets/audio/button-hover.mp3';
import buttonClickSound from '../assets/audio/button-click.mp3';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [sfxVolume] = useState(parseInt(localStorage.getItem("sfxVolume"), 10) || 50);
  const hoverAudioRef = useRef(null);
  const clickAudioRef = useRef(null);

  // Initialize audio refs
  useEffect(() => {
    hoverAudioRef.current = new Audio(buttonHoverSound);
    clickAudioRef.current = new Audio(buttonClickSound);
    
    hoverAudioRef.current.volume = sfxVolume / 100;
    clickAudioRef.current.volume = sfxVolume / 100;
  }, [sfxVolume]);

  const playHoverSound = () => {
    if (!hoverAudioRef.current) return;
    if (document.documentElement.hasAttribute('data-user-interacted')) {
      hoverAudioRef.current.currentTime = 0;
      hoverAudioRef.current.play().catch(error => 
        console.error("Hover sound playback failed:", error)
      );
    }
  };

  const playClickSound = () => {
    if (!clickAudioRef.current) return;
    
    clickAudioRef.current.currentTime = 0;
    clickAudioRef.current.play().catch(error => 
      console.error("Click sound playback failed:", error)
    );
    
    document.documentElement.setAttribute('data-user-interacted', 'true');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    playClickSound();
    try {
      const { token, userID } = await login(formData);
      localStorage.setItem('token', token);
      localStorage.setItem('userID', userID);
      onLogin();
      navigate('/play');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError('User not found. Please register first.');
      } else {
        setError(error.response?.data.message || 'Error logging in');
      }
    }
  };

  const handleRegisterRedirect = () => {
    playClickSound();
    navigate('/register');
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4 overflow-hidden"
      style={{ 
        backgroundImage: `url(${backgroundGif})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="w-full max-w-md bg-[rgba(44,44,84,0.85)] rounded-2xl shadow-lg p-8 transform transition-all hover:scale-[1.02] border-2 border-[#00d9ff]">
        <div className="text-center mb-8">
          <img src={logo} alt="Game Logo" className="mx-auto mb-4 h-20 w-auto" /> 
          <h1 className="text-4xl font-bold text-[#ffcc00] mb-2 animate-pulse" 
              style={{ 
                fontFamily: '"Orbitron", sans-serif',
                textShadow: '0 0 10px #ffcc00, 0 0 20px #ffaa00, 0 0 30px rgba(255, 255, 255, 0.6)'
              }}>
            WonderCards
          </h1>
          <p className="text-[#00d9ff]">Enter your credentials to play</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00d9ff] focus:border-transparent transition-all"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00d9ff] focus:border-transparent transition-all"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              onMouseEnter={playHoverSound}
              className="flex-1 bg-[#4a4e69] hover:bg-[#40407a] text-white px-6 py-3 rounded-lg font-medium border-2 border-[#00d9ff] focus:outline-none focus:ring-2 focus:ring-[#00d9ff] focus:ring-offset-2 focus:ring-offset-gray-800 transition-all shadow-[0_0_10px_rgba(0,217,255,0.3)] hover:shadow-[0_0_20px_rgba(0,217,255,0.5)]"
              style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '14px' }}
            >
              Login
            </button>
            <button
              type="button"
              onMouseEnter={playHoverSound}
              onClick={handleRegisterRedirect}
              className="flex-1 bg-[#2c2c54] hover:bg-[#40407a] text-white px-6 py-3 rounded-lg font-medium border-2 border-[#00d9ff] focus:outline-none focus:ring-2 focus:ring-[#00d9ff] focus:ring-offset-2 focus:ring-offset-gray-800 transition-all"
              style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '14px' }}
            >
              Register
            </button>
          </div>
          
          {error && (
            <div className="mt-4 text-red-500 text-center bg-red-500/10 p-3 rounded-lg border border-red-500">
              {error}
            </div>
          )}
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm" style={{ fontFamily: '"Orbitron", sans-serif' }}>
            Welcome to your cosmic memory adventure!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;