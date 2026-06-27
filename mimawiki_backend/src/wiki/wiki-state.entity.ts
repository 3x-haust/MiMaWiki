import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import type { WikiStatePayload } from './wiki-state.types';

@Entity('wiki_state')
export class WikiStateEntity {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'jsonb' })
  payload: WikiStatePayload;

  @UpdateDateColumn()
  updatedAt: Date;
}
