import { useQuery } from '@tanstack/react-query';
import { getOrderById } from '../api';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import numeral from 'numeral';
import { NumberFormats } from '@/lib/constants';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DateTime } from 'luxon';
import { Badge } from '@/components/ui/badge';
import { useChatStore } from '@/features/chat/store';
import { X } from 'lucide-react';

export type OrderFormPanelProps = {
  orderId: number;
};

export default function OrderFormPanel({ orderId }: OrderFormPanelProps) {
  const { setArtifactPanelOpen } = useChatStore();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderById(orderId),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const total = order?.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );

  return (
    <Card className="h-full gap-0 overflow-y-auto rounded-none border-0 py-0">
      <CardHeader className="gap-0 p-0">
        <div className="flex justify-end">
          <Button
            variant="ghost"
            className="h-4 w-4 cursor-pointer p-0"
            onClick={() => setArtifactPanelOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex h-full flex-col gap-4 overflow-y-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              <span>Order No. {order?.id}</span>
              <Badge variant="outline">{order?.status}</Badge>
            </CardTitle>
            <CardDescription className="text-xs">
              Created{' '}
              {DateTime.fromISO(
                order?.createdAt ?? Date.now().toString(),
              ).toLocaleString(DateTime.DATE_FULL)}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <h5 className="text-xs font-bold">Account</h5>
            <p className="text-xs">{order?.account.name}</p>
            <h5 className="text-xs font-bold">Territory</h5>
            <p className="text-xs">{order?.account.territory.name}</p>
            <h5 className="text-xs font-bold">Ship To</h5>
            <p className="text-xs">{order?.account.territory.description}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
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
                {order?.items.map((item) => (
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
      </CardContent>
      <CardFooter className="flex justify-end gap-2 px-8 py-2">
        <div className="flex gap-5">
          <Button variant="outline">Publish</Button>
          <Button>Save</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
