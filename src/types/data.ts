export interface EventType {
  start_time: string;
  end_time: string;
  content: {
    rendered: string;
  };
  venue: string;
  title: {
    decoded: string;
  };
  thumbnail: {
    medium_large: string;
  };
  price_regular: string;
  price_member: string;
  ticket_url: string;
  facebook_url: string;
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
}
