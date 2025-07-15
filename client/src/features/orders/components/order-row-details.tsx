import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { NumberFormats } from '@/lib/constants';
import type { Order } from '@/features/orders/types';
import numeral from 'numeral';
import { useMemo } from 'react';

export type OrderRowDetailsProps = {
  order: Order;
};

export default function OrderRowDetails({ order }: OrderRowDetailsProps) {
  /**
   * Total price of the order
   */
  const total = useMemo(() => {
    return order.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    );
  }, [order]);

  return (
    <div className="px-10">
      <Card>
        <CardContent>
          <Table className="text-xs">
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">SKU</TableHead>
                <TableHead className="text-xs">Product</TableHead>
                <TableHead className="text-xs">Category</TableHead>
                <TableHead className="text-xs">Currency</TableHead>
                <TableHead className="text-right text-xs">Price</TableHead>
                <TableHead className="text-right text-xs">Quantity</TableHead>
                <TableHead className="text-right text-xs">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.product.sku}</TableCell>
                  <TableCell>{item.product.name}</TableCell>
                  <TableCell>
                    {item.product.category.name} -{' '}
                    {item.product.subcategory.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {item.product.currency}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {numeral(item.product.price).format(
                      NumberFormats.ACCOUNTING,
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {numeral(item.quantity).format(NumberFormats.WHOLE)}
                  </TableCell>
                  <TableCell className="text-right">
                    {numeral(item.product.price * item.quantity).format(
                      NumberFormats.ACCOUNTING,
                    )}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={1} className="font-bold">
                  Total
                </TableCell>
                <TableCell colSpan={6} className="text-right font-bold">
                  {numeral(total).format(NumberFormats.ACCOUNTING)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
