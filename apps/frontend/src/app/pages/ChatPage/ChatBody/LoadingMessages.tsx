import React from 'react';
import { Loader } from '../../../components';

export const LoadingMessages: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center flex-col gap-3 text-primary-400">
      <Loader size="lg" />
      <p className="text-sm">Loading messages...</p>
    </div>
  );
};

export default LoadingMessages;
