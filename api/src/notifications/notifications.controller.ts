import { Controller, Get, Post, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('emails/:id')
  findEmailById(@Param('id') id: string) {
    return this.notificationsService.findEmailById(+id);
  }

  @Post('emails/:id/send')
  sendEmail(@Param('id') id: string) {
    return this.notificationsService.sendEmail(+id);
  }
}
