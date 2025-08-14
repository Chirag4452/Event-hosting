// Event types available for registration
export const EVENT_TYPES: readonly string[] = [
  'Workshop',
  'Seminar',
  'Conference',
  'Training',
  'Webinar',
  'Hackathon',
  'Meetup',
  'Exhibition',
  'Competition',
  'Other',
] as const;

// Participant types for registration
export const PARTICIPANT_TYPES: readonly string[] = [
  'Student',
  'Professional',
  'Academic',
  'Industry Expert',
  'Volunteer',
  'Organizer',
  'Speaker',
  'Attendee',
  'Other',
] as const;

// TypeScript types derived from constants
export type EventType = typeof EVENT_TYPES[number];
export type ParticipantType = typeof PARTICIPANT_TYPES[number];

// Age groups for better categorization
export const AGE_GROUPS: readonly string[] = [
  'Under 18',
  '18-25',
  '26-35',
  '36-45',
  '46-55',
  '56-65',
  'Over 65',
] as const;

export type AgeGroup = typeof AGE_GROUPS[number];

// Form field labels and placeholders
export const FORM_LABELS = {
  name: 'Full Name',
  email: 'Email Address',
  phone: 'Phone Number',
  event_type: 'Event Type',
  participant_type: 'Participant Type',
  emergency_contact: 'Emergency Contact',
  age: 'Age',
} as const;

// Validation error messages
export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  invalid_email: 'Please enter a valid email address',
  invalid_phone: 'Please enter a valid phone number',
  name_too_short: 'Name must be at least 3 characters long',
  name_too_long: 'Name cannot exceed 50 characters',
  age_invalid: 'Please enter a valid age between 1 and 120',
} as const;
