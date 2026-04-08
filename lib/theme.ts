import { Colors } from '../constants/colors';
import { TicketStatus } from './types';

export function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function getStatusColor(status: TicketStatus): string {
  const map: Record<TicketStatus, string> = {
    open: Colors.statusOpen,
    assigned: Colors.statusAssigned,
    in_progress: Colors.statusInProgress,
    resolved: Colors.statusResolved,
    closed: Colors.statusClosed,
  };
  return map[status] ?? Colors.statusClosed;
}

export function getUrgencyColor(urgency: 1 | 2 | 3): string {
  if (urgency === 3) return Colors.urgencyHigh;
  if (urgency === 2) return Colors.urgencyMedium;
  return Colors.urgencyLow;
}

export function getUrgencyLabel(urgency: 1 | 2 | 3): string {
  if (urgency === 3) return 'High';
  if (urgency === 2) return 'Medium';
  return 'Low';
}

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
