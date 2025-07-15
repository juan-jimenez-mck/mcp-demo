import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { AuthToken } from 'src/auth/auth.decorator';
import {
  generateText,
  streamText,
  experimental_createMCPClient as createMCPClient,
} from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { Response } from 'express';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { AgentService } from 'src/agents/agent.service';

@Controller('chat')
export class ChatController {
  private readonly _mcpUrl: string;
  private readonly _llmModel: string;
  private readonly _llmSlimModel: string;

  constructor(
    private readonly chatService: ChatService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly agentService: AgentService,
  ) {
    this._mcpUrl = this.configService.get('MCPSERVER_URL') || '';
    this._llmModel = this.configService.get('ANTHROPIC_MODEL') || '';
    this._llmSlimModel = this.configService.get('ANTHROPIC_SLIM_MODEL') || '';
  }

  @Post()
  async create(
    @Body() createChatDto: CreateChatDto,
    @AuthToken() userId: string,
    @Res() res: Response,
  ) {
    const { message, sessionId, context } = createChatDto;
    let sessionIdUsed = sessionId;

    const user = await this.prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!sessionIdUsed) {
      const session = await this.prisma.chatSession.create({
        data: {
          userId: Number(userId),
        },
      });
      sessionIdUsed = session.id;
    }

    await this.prisma.chatMessage.create({
      data: {
        sessionId: sessionIdUsed,
        content: message,
        role: user.role,
        context,
      },
    });

    const session = await this.prisma.chatSession.findUnique({
      where: {
        id: sessionIdUsed,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    res.write(
      `${JSON.stringify({
        type: 'status',
        sessionID: sessionIdUsed,
        content: '...',
      })}\n\n`,
    );

    const mcpClient = await createMCPClient({
      transport: {
        type: 'sse',
        url: this._mcpUrl,
      },
    });

    const tools = await mcpClient.tools();

    try {
      const result = streamText({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        model: anthropic(this._llmModel),
        system: this.agentService.inject_llm_instructions_by_role(user),
        maxSteps: 8,
        tools,
        messages: [
          {
            role: 'user',
            content: this.agentService.append_context_to_message(
              context ?? '',
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
              session?.messages[session.messages.length - 1]?.content ?? '',
            ),
          },
        ],
      });

      let outputText = '';

      // Stream the response
      for await (const chunk of result.fullStream) {
        if (chunk.type === 'text-delta') {
          outputText += chunk.textDelta;
          res.write(
            `${JSON.stringify({
              type: 'delta',
              content: chunk.textDelta,
            })}\n\n`,
          );
        }
      }

      if (outputText) {
        const metadata = this.agentService.extract_metadata(outputText);
        await this.prisma.chatMessage.create({
          data: {
            sessionId: sessionIdUsed,
            content: outputText,
            role: 'assistant',
            metadata,
          },
        });

        if (metadata) {
          res.write(
            `${JSON.stringify({
              type: 'metadata',
              content: metadata,
            })}\n\n`,
          );
        }
      }

      if (!session?.title) {
        const titleResult = await generateText({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
          model: anthropic(this._llmSlimModel),
          messages: [
            {
              role: 'user',
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
              content: `Generate a 3 to 4 word title for the following chat session, do not include any special characters except for spaces: ${session?.messages?.map((m) => (m?.content as string) ?? '').join('\n\n') ?? ''}`,
            },
          ],
        });

        await this.prisma.chatSession.update({
          where: { id: sessionIdUsed },
          data: { title: titleResult.text },
        });
      }

      res.end();
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Streaming failed' });
    }
  }

  @Get('sessions')
  findAllSessions(@AuthToken() token: string) {
    return this.chatService.findUserSessions(Number(token));
  }

  @Get('sessions/:id')
  findChatSession(@Param('id') id: string) {
    return this.chatService.findChatSession(Number(id));
  }
}
