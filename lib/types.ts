export type Role = 'resident' | 'secretary' | 'treasurer' | 'chairman' | 'vendor';

export type TicketStatus = 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed';

export type TicketCategory =
  | 'plumbing'
  | 'electrical'
  | 'civil'
  | 'security'
  | 'noise'
  | 'parking'
  | 'elevator'
  | 'common_area'
  | 'other';

export type TicketUrgency = 1 | 2 | 3;

export interface Ticket {
  id: string;
  category: TicketCategory;
  subcategory: string;
  description: string;
  status: TicketStatus;
  urgency: TicketUrgency;
  flat_number: string;
  assigned_vendor_id?: string;
  created_at: string;
  resolved_at?: string;
}

export interface Notice {
  id: string;
  title: string;
  body: string;
  category: string;
  created_by: string;
  created_at: string;
  is_important: boolean;
}

export interface Poll {
  id: string;
  question: string;
  question_hi?: string;
  options: string[];
  votes: number[];
  total_votes: number;
  my_vote: number | null;
  expires_at: string;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string;
  phone: string;
  flat_number: string;
  role: Role;
  society_id: string;
  lang_pref: 'en' | 'hi';
}

export const categoryMeta: Record<TicketCategory, { emoji: string; label: string; color: string }> = {
  plumbing:    { emoji: '🔧', label: 'Plumbing',     color: '#1A6BE8' },
  electrical:  { emoji: '⚡', label: 'Electrical',   color: '#F59E0B' },
  civil:       { emoji: '🏗️', label: 'Civil',        color: '#8B5CF6' },
  security:    { emoji: '🛡️', label: 'Security',     color: '#EF4444' },
  noise:       { emoji: '🔊', label: 'Noise',        color: '#F97316' },
  parking:     { emoji: '🅿️', label: 'Parking',      color: '#6366F1' },
  elevator:    { emoji: '🛗', label: 'Elevator',     color: '#0891B2' },
  common_area: { emoji: '🌿', label: 'Common Area',  color: '#18A86A' },
  other:       { emoji: '📋', label: 'Other',        color: '#9E9890' },
};
