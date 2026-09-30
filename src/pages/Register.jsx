import React, { useState } from 'react';
import { userService, validateRegistration } from '../services/userService';
import { authService } from '../services/authService';
import { AuthCard, AuthField } from '../components/AuthCard';

const FIELDS = [
  { key: 'name', label: 'Full Name', type: 'text', autoComplete: 'name' },
  { key: 'email', label: 'Email Address', type: 'email', autoComplete: 'email' },
  { key: 'phone', label: 'Phone Number (optional)', type: 'tel', autoComplete: 'tel' },
  { key: 'password', label: 'Password', type: 'password', autoComplete: 'new-password', hint: 'At least 8 characters' },
  { key: 'confirmPassword', label: 'Confirm Password', type: 'password', autoComplete: 'new-password' }
];

export const Register = ({ navigate, onRegistered }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const updateField = (key, value) => {
    setForm({ ...form, [key]: value });
    if (errors[key]) setErrors(({ [key]: _removed, ...rest }) => rest);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateRegistration(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await userService.register(form);
      const user = await authService.login(form.email, form.password);
      onRegistered(user);
      navigate('/');
    } catch (err) {
      setFormError(err.message || 'Could not create your account. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <AuthCard subtitle="Create your account" onSubmit={handleSubmit}>
      {FIELDS.map(({ key, label, type, autoComplete, hint }) => (
        <AuthField
          key={key}
          id={`register-${key}`}
          label={label}
          type={type}
          autoComplete={autoComplete}
          required={key !== 'phone'}
          error={errors[key]}
          hint={hint}
          value={form[key]}
          onChange={(e) => updateField(key, e.target.value)}
        />
      ))}

      {formError && (
        <div role="alert" style={{ color: '#dc2626', fontSize: '0.82rem', fontWeight: 600 }}>{formError}</div>
      )}

      <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
        {submitting ? 'Creating account...' : 'Create account'}
      </button>

      <div style={{ fontSize: '0.82rem', color: '#64748b', textAlign: 'center' }}>
        Already have an account?{' '}
        <button type="button" onClick={() => navigate('/')} style={{ color: '#09090b', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          Sign in
        </button>
      </div>
    </AuthCard>
  );
};
