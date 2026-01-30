import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [accountError, setAccountError] = useState(false);

  const message = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isLogin ? 'login' : 'signup';
    const url = `/api/auth/${endpoint}`;
    let res;
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', email);

      if (isLogin) {
        localStorage.removeItem('onboarding');
      } else {
        localStorage.setItem('onboarding', true);
      }
      navigate('/dashboard');
      setPasswordError(false);
    } else if (isLogin && res.status === 403) {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 3000);
    } else if (!isLogin && res.status === 400) {
      setAccountError(true);
      setTimeout(() => setAccountError(false), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#fdfcf9] via-[#f9f6f1] to-[#f5f0e8] p-4 sm:p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800;900&family=Crimson+Text:wght@400;600;700&display=swap');
        
        * {
          font-family: 'Crimson Text', serif;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Playfair Display', serif;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes floatGentle {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        .animate-fade-up {
          animation: fadeInUp 0.8s ease-out backwards;
        }

        .animate-scale-in {
          animation: scaleIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) backwards;
        }

        .paper-texture {
          position: relative;
        }

        .paper-texture::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.015'/%3E%3C/svg%3E");
          pointer-events: none;
          border-radius: inherit;
          mix-blend-mode: overlay;
        }

        .elegant-shadow {
          box-shadow: 
            0 4px 6px rgba(45, 36, 22, 0.03),
            0 10px 20px rgba(45, 36, 22, 0.08),
            0 0 0 1px rgba(45, 36, 22, 0.05);
        }

        .elegant-shadow-hover {
          transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .elegant-shadow-hover:hover {
          box-shadow: 
            0 8px 12px rgba(45, 36, 22, 0.05),
            0 20px 40px rgba(45, 36, 22, 0.12),
            0 0 0 1px rgba(45, 36, 22, 0.08);
          transform: translateY(-4px);
        }

        .input-refined {
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .input-refined:focus {
          transform: translateY(-2px);
          box-shadow: 
            0 4px 12px rgba(97, 140, 69, 0.12),
            0 0 0 3px rgba(122, 176, 93, 0.08);
        }

        .floating-element {
          animation: floatGentle 6s ease-in-out infinite;
        }
      `}</style>

      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {/* Soft gradients - Brown & Green mix */}
        <div className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-br from-[#d4a574]/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-tl from-[#c9956d]/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#8B6F47]/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-40 w-[500px] h-[500px] bg-gradient-to-bl from-[#7ab05d]/8 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-32 w-[450px] h-[450px] bg-gradient-to-tr from-[#618c45]/6 to-transparent rounded-full blur-3xl"></div>

        {/* Decorative circles - Brown & Green */}
        <div className="absolute top-32 right-32 w-2 h-2 rounded-full bg-[#d4a574]/30"></div>
        <div className="absolute bottom-48 left-48 w-3 h-3 rounded-full bg-[#c9956d]/20"></div>
        <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 rounded-full bg-[#8B6F47]/25"></div>
        <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-[#618c45]/25"></div>
        <div className="absolute bottom-1/3 right-1/3 w-2.5 h-2.5 rounded-full bg-[#7ab05d]/20"></div>

        {/* Subtle leaf/organic shapes */}
        <div className="absolute top-24 left-24 w-32 h-32 opacity-5">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#618c45]">
            <path
              fill="currentColor"
              d="M50,10 Q80,30 85,60 Q80,85 50,95 Q40,80 35,60 Q30,40 50,10z"
            />
          </svg>
        </div>
        <div className="absolute bottom-32 right-24 w-40 h-40 opacity-5 rotate-45">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#c9956d]">
            <path
              fill="currentColor"
              d="M50,10 Q80,30 85,60 Q80,85 50,95 Q40,80 35,60 Q30,40 50,10z"
            />
          </svg>
        </div>

        {/* Diagonal lines pattern */}
        <div className="absolute inset-0 opacity-[0.015]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, #618c45 0px, #618c45 1px, transparent 1px, transparent 40px)'
            }}
          ></div>
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex flex-col lg:flex-row items-stretch max-w-5xl w-full elegant-shadow-hover hover:border-b-green-700 rounded-[32px] overflow-hidden bg-white/80 backdrop-blur-sm">
        {/* Left Side - Welcome Card */}
        <div className="paper-texture bg-gradient-to-br from-[#f7f2e1] to-[#ede4c8] lg:w-1/2 p-10 sm:p-12 lg:p-14 flex flex-col items-center justify-center text-center relative overflow-hidden">
          {/* Decorative corner accent */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#d4a574]/10 rounded-full blur-2xl"></div>

          <div className="relative z-10">
            {/* Image */}
            <div className="mb-8 inline-block floating-element" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#d4a574]/20 to-[#c9956d]/20 rounded-full blur-xl"></div>
                <img
                  src="/grocery.png"
                  alt="Groceries"
                  className="relative w-60 h-56 lg:w-60 lg:h-68 object-contain drop-shadow-2xl"
                />
              </div>
            </div>

            {/* Welcome Text */}
            <div className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <h2
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2d2416] mb-4 leading-tight tracking-tight"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Welcome to Plated
              </h2>
              <p className="text-xl sm:text-2xl text-[#6B5746] font-light leading-relaxed">
                Well-planned meals, without overspending
              </p>
            </div>

            {/* Decorative divider */}
            <div
              className="mt-10 flex items-center justify-center gap-3"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.4s backwards' }}
            >
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#d4a574]/40 to-transparent"></div>
              <div className="w-2 h-2 rounded-full bg-gradient-to-br from-[#618c45] to-[#c9956d]"></div>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#618c45]/40 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Right Side - Form Card */}
        <div className="lg:w-1/2 p-8 sm:p-10 lg:p-14 bg-white relative">
          {/* Header */}
          <div className="text-center mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="inline-block mb-4">
              <span className="px-5 py-2 bg-gradient-to-r from-[#618c45]/10 to-[#7ab05d]/10 text-[#2d4a28] rounded-full text-sm font-bold tracking-widest uppercase border border-[#618c45]/20">
                {isLogin ? 'Login' : 'Sign Up'}
              </span>
            </div>

            <h1
              className="text-5xl sm:text-6xl font-bold text-[#2d2416] mb-3 tracking-tight"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Plated
            </h1>
            <p className="text-xl text-[#6B5746] font-light">
              {isLogin ? 'Welcome back, friend' : 'Begin your journey'}
            </p>
          </div>

          {/* Error Messages */}
          {message && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-scale-in">
              <p className="text-red-700 font-semibold">{message}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <label className="block text-[#2d2416] font-semibold mb-3 text-base">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-refined w-full px-5 py-4 border-2 border-[#d4a574]/30 rounded-2xl focus:outline-none focus:border-[#618c45] bg-white/80 backdrop-blur-sm text-[#2d2416] text-lg"
                placeholder="you@example.com"
              />
            </div>

            <div className="animate-fade-up" style={{ animationDelay: '0.4s' }}>
              <label className="block text-[#2d2416] font-semibold mb-3 text-base">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`input-refined w-full px-5 py-4 pr-20 border-2 rounded-2xl focus:outline-none bg-white/80 backdrop-blur-sm text-[#2d2416] text-lg ${
                    passwordError
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-[#d4a574]/30 focus:border-[#618c45]'
                  }`}
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[#8B6F47] hover:text-[#6B5746] transition-colors font-semibold text-sm"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {passwordError && (
                <div className="mt-3 flex items-start gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  <svg
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm font-semibold">Invalid credentials. Please try again.</p>
                </div>
              )}

              {accountError && (
                <div className="mt-3 flex items-start gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  <svg
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm font-semibold">Account already exists. Please log in.</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full paper-texture bg-[#618C45F2] text-white py-5 rounded-2xl font-bold text-lg tracking-wide shadow-[0_8px_24px_rgba(97,140,69,0.25)] hover:shadow-[0_12px_32px_rgba(97,140,69,0.35)] transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group animate-scale-in"
              style={{ animationDelay: '0.5s' }}
            >
              <span className="relative z-10">{isLogin ? 'Log In' : 'Create Account'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#7ab05d] to-[#618c45] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-8 text-center animate-fade-up" style={{ animationDelay: '0.6s' }}>
            <p className="text-[#6B5746] text-lg">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#618c45] hover:text-[#7ab05d] font-bold underline-offset-4 hover:underline transition-colors"
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
