import React, { useState } from 'react';
import {
  Button,
  Input,
  Link,
  Icon,
  DecorativeBlobs,
  Header,
  ShowPasswordButton,
} from '../../components';
import { authApi } from '../../service/api.service';
import { useToast } from '../../hooks/useToast';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const { showToast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const navigate = useNavigate();

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (errors.username) {
      setErrors((prev) => ({ ...prev, username: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const validate = () => {
    const next: typeof errors = {};

    if (!username) {
      next.username = 'Username is required';
    } else if (username.length < 2) {
      next.username = 'At least 2 characters';
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

      const loggedInUser = await authApi.login({ username, password });

      localStorage.setItem('chatio_user', JSON.stringify(loggedInUser));
      navigate('/chat');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Login failed', 'error');
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
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-primary-700/50">
            Sign in to continue your conversations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-primary-700/10" />
          <span className="text-xs text-secondary/70 font-medium">
            Sign in with email
          </span>
          <div className="flex-1 h-px bg-primary-700/10" />
        </div>

        <form
          id="form-login"
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4"
        >
          <Input
            id="input-username"
            label="Username"
            type="text"
            placeholder="Enter your username"
            autoComplete="username"
            value={username}
            onChange={handleUsernameChange}
            leftIcon={<Icon iconSlug="user" className="w-[18px] h-[18px]" />}
            error={errors.username}
          />

          <Input
            id="input-password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={handlePasswordChange}
            leftIcon={<Icon iconSlug="lock" className="w-[18px] h-[18px]" />}
            error={errors.password}
            rightAction={
              <ShowPasswordButton
                showPassword={showPassword}
                onToggle={handleTogglePassword}
              />
            }
          />

          <div className="flex justify-end -mt-1">
            <Link
              id="link-forgot-password"
              to="/forgot-password"
              underline={false}
              className="text-sm"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            id="btn-submit-login"
            type="submit"
            size="lg"
            fullWidth
            isLoading={isLoading}
            className="mt-1"
          >
            {isLoading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </main>

      <footer className="text-sm text-primary-700/50 text-center">
        Don't have an account?{' '}
        <Link id="link-register" to="/signup" underline={false}>
          Create one
        </Link>
      </footer>
    </div>
  );
};

export default LoginPage;
