/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import useField from 'hooks';

export default function LoginForm({ show, handleLogin }) {
  const { reset: resetUsername, ...username } = useField('username', 'InputUsername', 'text');
  const { reset: resetPassword, ...password } = useField('password', 'InputPassword', 'password');

  if (!show) return null;

  return (
    <form>
      <div>
        username
        <input {...username} />
      </div>
      <div>
        password
        <input {...password} />
      </div>
      <button
        type="button"
        id="login_button"
        onClick={() => handleLogin(username.value, password.value)}
      >
        login
      </button>
    </form>
  );
}
