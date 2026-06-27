import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseStrategy } from 'src/shared/strategies/response.strategy';
import { WikiStateController } from './wiki-state.controller';
import { WikiStateEntity } from './wiki-state.entity';
import { WikiStateService } from './wiki-state.service';

@Module({
  imports: [TypeOrmModule.forFeature([WikiStateEntity])],
  controllers: [WikiStateController],
  providers: [WikiStateService, ResponseStrategy],
})
export class WikiModule {}
