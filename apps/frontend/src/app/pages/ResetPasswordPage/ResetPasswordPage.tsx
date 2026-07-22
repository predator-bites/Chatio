import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

export const ResetPasswordPage: React.FC = () => {
  const { id, passwordChangeUrl } = useParams<{
    id: string;
    passwordChangeUrl: string;
  }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ password?: string }>({});

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

      if (!id || !passwordChangeUrl) {
        showToast('Invalid password reset link', 'error');
        return;
      }

      const next = validate();

      if (Object.keys(next).length) {
        setErrors(next);
        return;
      }

      setErrors({});
      setIsLoading(true);

      await userApi.resetPassword(id, passwordChangeUrl, { password });

      showToast(
        'Password updated successfully! You can now sign in.',
        'success',
      );
      navigate('/login');
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to reset password',
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
            Create new password
          </h1>
          <p className="mt-1.5 text-sm text-primary-700/50">
            Enter your new password below.
          </p>
        </div>

        <form
          id="form-reset-password"
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4"
        >
          <Input
            id="input-new-password"
            label="New Password"
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
            id="btn-submit-new-password"
            type="submit"
            size="lg"
            fullWidth
            isLoading={isLoading}
            className="mt-1"
          >
            {isLoading ? 'Updating…' : 'Update Password'}
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

export default ResetPasswordPage;
