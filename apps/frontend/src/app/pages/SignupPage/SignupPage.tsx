import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
  }>({});

  const validate = () => {
    const next: typeof errors = {};

    if (!username) {
      next.username = 'Username is required';
    } else if (username.length < 2) {
      next.username = 'At least 2 characters';
    }

    if (!email) {
      next.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      next.email = 'Invalid email format';
    }

    if (!password) {
      next.password = 'Password is required';
    } else if (password.length < 6) {
      next.password = 'At least 6 characters';
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

      setErrors({});
      setIsLoading(true);

      await userApi.create({ username, email, password });

      showToast(
        'Account created successfully. Please check your email to verify.',
        'success',
      );
      navigate('/login');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Signup failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${import.meta.env.SERVER_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen w-full bg-primary-50 flex flex-col items-center justify-between px-5 pt-14 pb-10 overflow-hidden relative">
      <DecorativeBlobs />

      <Header />

      <main className="w-full max-w-sm flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-700 leading-tight">
            Create an account
          </h1>
          <p className="mt-1.5 text-sm text-primary-700/50">
            Sign up to start your conversations
          </p>
        </div>

        <Button
          id="btn-google-signup"
          variant="outline"
          size="lg"
          fullWidth
          leftIcon={<GoogleIcon />}
          onClick={handleGoogleSignup}
        >
          Sign up with Google
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-primary-700/10" />
          <span className="text-xs text-secondary/70 font-medium">
            or sign up with email
          </span>
          <div className="flex-1 h-px bg-primary-700/10" />
        </div>

        <form
          id="form-signup"
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4"
        >
          <Input
            id="input-username"
            label="Username"
            type="text"
            placeholder="your_username"
            autoComplete="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);

              if (errors.username)
                setErrors((p) => ({ ...p, username: undefined }));
            }}
            leftIcon={<Icon iconSlug="user" className="w-[18px] h-[18px]" />}
            error={errors.username}
          />

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

          <Input
            id="input-password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="new-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);

              if (errors.password)
                setErrors((p) => ({ ...p, password: undefined }));
            }}
            leftIcon={<Icon iconSlug="lock" className="w-[18px] h-[18px]" />}
            error={errors.password}
            rightAction={
              <button
                type="button"
                id="btn-toggle-password"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((v) => !v)}
                className="text-secondary/50 p-1 active:text-secondary transition-colors duration-150"
              >
                {showPassword ? (
                  <Icon iconSlug="eyeOff" className="w-[18px] h-[18px]" />
                ) : (
                  <Icon iconSlug="eye" className="w-[18px] h-[18px]" />
                )}
              </button>
            }
          />

          <Button
            id="btn-submit-signup"
            type="submit"
            size="lg"
            fullWidth
            isLoading={isLoading}
            className="mt-1"
          >
            {isLoading ? 'Signing up…' : 'Sign up'}
          </Button>
        </form>
      </main>

      <footer className="text-sm text-primary-700/50 text-center">
        Already have an account?{' '}
        <Link id="link-login" to="/login" underline={false}>
          Sign in
        </Link>
      </footer>
    </div>
  );
};

export default SignupPage;
