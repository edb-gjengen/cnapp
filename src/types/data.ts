export interface EventType {
  start_time: string;
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
}
