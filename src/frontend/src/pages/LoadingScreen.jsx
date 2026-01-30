import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export default function LoadingScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-green-500/15 backdrop-blur-xl">
      {/* Pulsing circle */}
      <div className="mb-8">
        <div
          className="w-16 h-16 bg-green-400/30 rounded-full flex items-center justify-center"
          style={{
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}
        >
          <div className="w-10 h-10 bg-green-400/60 rounded-full"></div>
        </div>
      </div>

      <h1 className="text-green-100 text-2xl font-medium mb-10 tracking-wide">Loading...</h1>

      {/* Modern progress bar */}
      <div className="w-80 h-1.5 bg-green-300/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-400 rounded-full shadow-lg"
          style={{
            animation: 'progressBar 5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            boxShadow: '0 0 20px rgba(34, 197, 94, 0.6)' // emerald glow
          }}
        ></div>
      </div>

      <style jsx>{`
        @keyframes progressBar {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
