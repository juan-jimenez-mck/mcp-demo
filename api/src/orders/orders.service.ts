import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.order.findMany({
      include: {
        account: true,
        salesRep: true,
        items: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        account: {
          include: {
            address: true,
            contact: true,
            territory: true,
          },
        },
        salesRep: true,
        items: {
          include: {
            promotion: true,
            product: {
              include: {
                category: true,
                subcategory: true,
              },
            },
          },
        },
      },
    });
  }
}
