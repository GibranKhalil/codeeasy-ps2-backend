type AvailableInteractions =
  | 'stars'
  | 'likes'
  | 'views'
  | 'forks'
  | 'downloads';

export type Interactions = Record<AvailableInteractions, number>;
