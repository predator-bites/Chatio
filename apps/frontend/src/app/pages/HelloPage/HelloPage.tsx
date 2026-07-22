import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Icon, Logo, DecorativeBlobs, Header } from '../../components';

export const HelloPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('chatio_user');

    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="min-h-screen w-full bg-primary-50 flex flex-col items-center justify-between px-5 pt-10 pb-8 overflow-hidden relative">
      {/* Decorative background blobs */}
      <DecorativeBlobs />

      {/* Navbar / Logo */}
      <Header className="max-w-4xl flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <Logo size={48} />
          <span className="text-xl font-bold text-primary-800 tracking-tight">
            Chatio
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/chat')}
            >
              Open App
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/signup')}
              >
                Get Started
              </Button>
            </>
          )}
        </div>
      </Header>

      {/* Hero Main Card */}
      <main className="w-full max-w-2xl flex flex-col items-center text-center gap-8 z-10 my-auto py-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-semibold uppercase tracking-wider">
          <Icon iconSlug="messageSquare" className="w-3.5 h-3.5" />
          <span>Next-Gen Real-Time Messaging</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-primary-800 tracking-tight leading-[1.15]">
          Connect & Chat <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-primary-700 via-secondary to-primary-800 bg-clip-text text-transparent">
            Effortlessly in Real-Time
          </span>
        </h1>

        <p className="text-base md:text-lg text-primary-600 max-w-lg leading-relaxed">
          Chatio brings instant messaging, private rooms, and seamless team
          collaboration into one simple, modern experience.
        </p>

        {/* Primary CTA Area */}
        <div className="w-full max-w-sm flex flex-col sm:flex-row gap-3 mt-2">
          {isLoggedIn ? (
            <Button
              id="btn-cta-chat"
              size="lg"
              fullWidth
              onClick={() => navigate('/chat')}
              className="shadow-lg shadow-primary-700/20"
            >
              <span>Go to Workspace</span>
              <Icon iconSlug="arrowLeft" className="w-4 h-4 rotate-180" />
            </Button>
          ) : (
            <>
              <Button
                id="btn-cta-signup"
                size="lg"
                fullWidth
                onClick={() => navigate('/signup')}
                className="shadow-lg shadow-primary-700/20"
              >
                <span>Start Chatting Free</span>
              </Button>
              <Button
                id="btn-cta-login"
                variant="outline"
                size="lg"
                fullWidth
                onClick={() => navigate('/login')}
              >
                <span>Sign In</span>
              </Button>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-xs text-primary-500 text-center z-10">
        &copy; {new Date().getFullYear()} Chatio. Built for effortless
        communication.
      </footer>
    </div>
  );
};

export default HelloPage;
