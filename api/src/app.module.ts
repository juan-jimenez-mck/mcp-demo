import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { AccountsModule } from './accounts/accounts.module';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './core/prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { HealthModule } from './health/health.module';
import { AgentModule } from './agents/agent.module';

@Module({
  imports: [
    OrdersModule,
    AccountsModule,
    ProductsModule,
    PrismaModule,
    UsersModule,
    ChatModule,
    AuthModule,
    NotificationsModule,
    HealthModule,
    AgentModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
