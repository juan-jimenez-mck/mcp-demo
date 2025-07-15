import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ConfigModule } from '@nestjs/config';
import { AgentModule } from 'src/agents/agent.module';

@Module({
  imports: [ConfigModule, AgentModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
