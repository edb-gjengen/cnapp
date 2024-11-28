export interface Venue {
  id: string;
  slug: string;
  title: string;
  preposition: string;
  url: string;
}

export interface EventOccurrence {
  id: string;
  start: string;
  end?: string;
  venue: Venue;
}

export interface EventType {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  nextOccurrence: EventOccurrence;
  futureOccurrencesCount: number;
}

export interface MembershipType {
  membership_type: string;
  end_date: string;
}

export interface UserType {
  first_name: string;
  last_name: string;
  email: string;
  last_membership: MembershipType | null;
  is_volunteer: boolean;
  is_member: boolean;
  username: string | null;
}
