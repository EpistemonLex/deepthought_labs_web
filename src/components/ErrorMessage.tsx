import React from 'react';

interface ErrorMessageProps {
  /** The main error message to display. */
  message: string;
  /** An optional title for the error message box. Defaults to 'Error'. */
  title?: string;
  /** An optional error code to display. */
  code?: string;
}

/**
 * A component to display a formatted error message.
 * It shows a title, a message, and an optional error code in a styled box.
 */
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
