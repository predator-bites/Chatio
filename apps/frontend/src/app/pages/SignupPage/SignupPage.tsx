import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Input,
  Link,
  Icon,
  DecorativeBlobs,
  Header,
  ShowPasswordButton,
} from '../../components';
import { userApi } from '../../service/api.service';
import { useToast } from '../../hooks/useToast';

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

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (errors.username) {
      setErrors((prev) => ({ ...prev, username: undefined }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
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
            onChange={handleUsernameChange}
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
            onChange={handleEmailChange}
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
