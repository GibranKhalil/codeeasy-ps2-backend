import type { Tutorial } from 'src/models/tutorial/entities/tutorial.entity';

export class Category {
  id: number;
  name: string;
  tutorials: Tutorial[];
}
