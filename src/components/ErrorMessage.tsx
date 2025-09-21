import React from 'react';

interface ErrorMessageProps {
  message: string;
  title?: string;
  code?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, title = 'Error', code }) => {
  return (
    <div data-testid="error-message" className="mt-4 p-4 bg-red-900 border border-red-700 text-red-200 rounded">
      <p className="font-bold">{title}</p>
      {code && <p className="text-sm text-red-300">Code: {code}</p>}
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
