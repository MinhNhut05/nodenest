/**
 * Validation functions cho User
 */

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateUser(data) {
  const errors = [];

  // Required
  if (!data.name || !data.name.trim()) {
    errors.push('Name is required');
  }

  if (!data.email || !data.email.trim()) {
    errors.push('Email is required');
  }

  // Format - Email
  if (data.email && !emailRegex.test(data.email)) {
    errors.push('Invalid email format');
  }

  // Range - Age
  if (data.age !== undefined && data.age !== null) {
    if (typeof data.age !== 'number' || isNaN(data.age)) {
      errors.push('Age must be a number');
    } else if (data.age < 0 || data.age > 150) {
      errors.push('Age must be between 0 and 150');
    }
  }

  // Length - Name
  if (data.name && (data.name.length < 2 || data.name.length > 50)) {
    errors.push('Name must be 2-50 characters');
  }

  return { valid: errors.length === 0, errors };
}
