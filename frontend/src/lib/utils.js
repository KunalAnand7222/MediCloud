import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatTime(time) {
  return time;
}

export function formatDateTime(date) {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

export function getStatusColor(status) {
  const colors = {
    pending: 'badge-warning',
    confirmed: 'badge-info',
    completed: 'badge-success',
    cancelled: 'badge-danger',
    'no-show': 'badge-danger',
    active: 'badge-success',
    resolved: 'badge-info',
    chronic: 'badge-warning',
  };
  return colors[status] || 'badge-info';
}

export function getInitials(name) {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
];

export const SPECIALIZATIONS = [
  'General Medicine', 'Cardiology', 'Neurology', 'Orthopedics', 'Dermatology',
  'Pediatrics', 'Gynecology', 'Ophthalmology', 'Psychiatry', 'Oncology',
  'Urology', 'ENT', 'Endocrinology', 'Gastroenterology', 'Pulmonology',
  'Nephrology', 'Rheumatology', 'Radiology', 'Anesthesiology', 'Surgery',
];
