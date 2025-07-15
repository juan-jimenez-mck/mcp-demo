import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { EmailStatus } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  findEmailById(emailId: number) {
    return this.prisma.email.findUnique({
      where: { id: emailId },
    });
  }

  sendEmail(emailId: number) {
    return this.prisma.email.update({
      where: { id: emailId },
      data: { status: EmailStatus.SENT },
    });
  }
}
