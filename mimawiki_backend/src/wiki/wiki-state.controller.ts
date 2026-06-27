import { Body, Controller, Get, Put } from '@nestjs/common';
import { ResponseStrategy } from 'src/shared/strategies/response.strategy';
import { WikiStateService } from './wiki-state.service';

@Controller('wiki')
export class WikiStateController {
  constructor(
    private readonly wikiStateService: WikiStateService,
    private readonly responseStrategy: ResponseStrategy,
  ) {}

  @Get('state')
  async getState() {
    return this.responseStrategy.success(
      '위키 상태 조회 성공',
      await this.wikiStateService.getState(),
    );
  }

  @Put('state')
  async replaceState(@Body() payload: unknown) {
    return this.responseStrategy.success(
      '위키 상태 저장 성공',
      await this.wikiStateService.replaceState(payload),
    );
  }
}
