import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ToastProvider } from './components/ToastProvider';
import { lazy, Suspense } from 'react';
import { Loader } from './components';

const HelloPage = lazy(() => import('./pages/HelloPage/HelloPage'));
const LoginPage = lazy(() => import('./pages/LoginPage/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage/SignupPage'));
const SubmitPage = lazy(() => import('./pages/SubmitPage/SubmitPage'));
const ForgotPasswordPage = lazy(
  () => import('./pages/ForgotPasswordPage/ForgotPasswordPage'),
);
const ResetPasswordPage = lazy(
  () => import('./pages/ResetPasswordPage/ResetPasswordPage'),
);
const ChatPage = lazy(() => import('./pages/ChatPage/ChatPage'));
const JoinRoomPage = lazy(() => import('./pages/JoinRoomPage/JoinRoomPage'));

export function App() {
  return (
    <ToastProvider>
      <Router>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<HelloPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route
              path="/room/join/:roomId/:inviteUrl"
              element={<JoinRoomPage />}
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/user/:id/:submitUrl" element={<SubmitPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="/user/reset/:id/:passwordChangeUrl"
              element={<ResetPasswordPage />}
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </ToastProvider>
  );
}

export default App;
