import React, { useState } from 'react';
import {
  Button,
  Input,
  Link,
  Icon,
  DecorativeBlobs,
  Header,
} from '../../components';
import { userApi } from '../../service/api.service';
import { useToast } from '../../hooks/useToast';

export const ForgotPasswordPage: React.FC = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});

  const validate = () => {
    const next: typeof errors = {};

    if (!email) {
      next.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      next.email = 'Invalid email format';
    }

    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      const next = validate();

      if (Object.keys(next).length) {
        setErrors(next);
        return;
      }

      setIsLoading(true);

      await userApi.requestPasswordReset({ email });

      showToast('Reset link sent to your email', 'success');
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to send reset link',
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
            Forgot Password
          </h1>
          <p className="mt-1.5 text-sm text-primary-700/50">
            Enter your email to receive a password reset link.
          </p>
        </div>

        <form
          id="form-forgot-password"
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4"
        >
          <Input
            id="input-email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);

              if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
            }}
            leftIcon={<Icon iconSlug="mail" className="w-[18px] h-[18px]" />}
            error={errors.email}
          />

          <Button
            id="btn-submit-reset"
            type="submit"
            size="lg"
            fullWidth
            isLoading={isLoading}
            className="mt-1"
          >
            {isLoading ? 'Sending…' : 'Send Link'}
          </Button>
        </form>
      </main>

      <footer className="text-sm text-primary-700/50 text-center">
        Remember your password?{' '}
        <Link id="link-login" to="/login" underline={false}>
          Sign in
        </Link>
      </footer>
    </div>
  );
};

export default ForgotPasswordPage;
