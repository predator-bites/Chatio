import React from 'react';

interface DecorativeBlobsProps {
  className?: string;
}

export const DecorativeBlobs: React.FC<DecorativeBlobsProps> = ({
  className = '',
}) => {
  return (
    <div className={`pointer-events-none ${className}`}>
      <div
        aria-hidden
        className="absolute -top-24 -right-24 w-72 md:w-96 h-72 md:h-96 rounded-full bg-secondary/20 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute top-1/3 -left-32 w-64 md:w-80 h-64 md:h-80 rounded-full bg-primary-700/5 blur-2xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute -bottom-24 right-1/4 w-64 md:w-80 h-64 md:h-80 rounded-full bg-secondary/15 blur-3xl pointer-events-none"
      />
    </div>
  );
};

export default DecorativeBlobs;
