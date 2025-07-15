import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.account.findMany({
      include: {
        salesRep: true,
        contact: true,
        address: true,
        territory: true,
        orderingPattern: true,
      },
    });
  }
}
