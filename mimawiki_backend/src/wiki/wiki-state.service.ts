import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WikiStateEntity } from './wiki-state.entity';
import {
  normalizeWikiPayload,
  type WikiStatePayload,
} from './wiki-state.types';

const WIKI_STATE_ID = 'mimawiki';

@Injectable()
export class WikiStateService {
  constructor(
    @InjectRepository(WikiStateEntity)
    private readonly wikiStateRepository: Repository<WikiStateEntity>,
  ) {}

  async getState(): Promise<WikiStatePayload> {
    const state = await this.wikiStateRepository.findOne({
      where: { id: WIKI_STATE_ID },
    });

    return normalizeWikiPayload(state?.payload);
  }

  async replaceState(payload: unknown): Promise<WikiStatePayload> {
    const normalizedPayload = normalizeWikiPayload(payload);
    await this.wikiStateRepository.save(
      this.wikiStateRepository.create({
        id: WIKI_STATE_ID,
        payload: normalizedPayload,
      }),
    );

    return normalizedPayload;
  }
}
