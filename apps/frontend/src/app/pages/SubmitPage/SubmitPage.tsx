import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Link, DecorativeBlobs, Header } from '../../components';
import { userApi } from '../../service/api.service';
import { useToast } from '../../hooks/useToast';

export const SubmitPage: React.FC = () => {
  const { id, submitUrl } = useParams<{ id: string; submitUrl: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = async () => {
    try {
      if (!id || !submitUrl) {
        showToast('Invalid verification link', 'error');
        return;
      }

      setIsLoading(true);

      await userApi.submitEmail(id, submitUrl);

      setIsVerified(true);

      showToast('Email verified successfully!', 'success');
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to verify email',
        'error',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-primary-50 flex flex-col items-center justify-between px-5 pt-14 pb-10 overflow-hidden relative">
      <DecorativeBlobs />

      <Header />

      <main className="w-full max-w-sm flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-700 leading-tight">
            Verify Email
          </h1>
          <p className="mt-1.5 text-sm text-primary-700/50">
            {isVerified
              ? 'Your email has been verified. You can now sign in.'
              : 'Click the button below to verify your email address.'}
          </p>
        </div>

        {!isVerified ? (
          <Button
            id="btn-verify-email"
            onClick={handleVerify}
            size="lg"
            fullWidth
            isLoading={isLoading}
            className="mt-1"
          >
            {isLoading ? 'Verifying…' : 'Verify Email'}
          </Button>
        ) : (
          <Button
            id="btn-go-to-login"
            onClick={() => navigate('/login')}
            size="lg"
            fullWidth
            className="mt-1"
          >
            Go to Sign in
          </Button>
        )}
      </main>

      <footer className="text-sm text-primary-700/50 text-center">
        Need to create a new account?{' '}
        <Link id="link-signup" to="/signup" underline={false}>
          Sign up
        </Link>
      </footer>
    </div>
  );
};

export default SubmitPage;
