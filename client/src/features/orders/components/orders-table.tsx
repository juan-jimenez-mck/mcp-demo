import type { CollapsibleTableColumn } from '@/components/ui/collapsible-table/types';
import type { Order } from '../types';
import numeral from 'numeral';
import { NumberFormats } from '@/lib/constants';
import CollapsibleTable from '@/components/ui/collapsible-table/components/collapsible-table';
import SearchBar from '@/components/ui/search-bar';
import {
  RefetchControl,
  RefetchIntervalOptions,
} from '@/components/ui/refetch-control';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getOrders } from '../api';
import { Badge } from '@/components/ui/badge';
import { DateTime } from 'luxon';
import OrderRowDetails from './order-row-details';

export default function OrdersTable() {
  /**
   * Search term
   */
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Query to get orders
   */
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
  });

  const filteredOrders = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.filter(
      (order) =>
        order.account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm.toLowerCase()),
    );
  }, [data, searchTerm]);

  const COLUMNS: CollapsibleTableColumn<Order>[] = [
    {
      id: 'id',
      header: 'ID',
      accessorKey: 'id',
      cellRenderer(order) {
        return numeral(order.id).format(NumberFormats.WHOLE);
      },
    },
    {
      id: 'account',
      header: 'Account',
      accessorKey: 'account',
      cellRenderer(order) {
        return <div>{order.account.name}</div>;
      },
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      align: 'text-center',
      cellRenderer(order) {
        return <Badge variant="outline">{order.status}</Badge>;
      },
    },
    {
      id: 'paymentStatus',
      header: 'Payment Status',
      accessorKey: 'paymentStatus',
      align: 'text-center',
      cellRenderer(order) {
        return <Badge variant="outline">{order.paymentStatus}</Badge>;
      },
    },
    {
      id: 'collectionDate',
      header: 'Collection Date',
      accessorKey: 'collectionDate',
      cellRenderer(order) {
        if (order.collectionDate) {
          return DateTime.fromISO(order.collectionDate).toLocaleString(
            DateTime.DATE_MED,
          );
        }

        return '-';
      },
    },
    {
      id: 'createdAt',
      header: 'Created At',
      accessorKey: 'createdAt',
      cellRenderer(order) {
        return DateTime.fromISO(order.createdAt).toLocaleString(
          DateTime.DATE_MED,
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-4">
        <SearchBar
          onChange={(value) => setSearchTerm(value)}
          placeholder="Search accounts"
        />
        <RefetchControl
          selectedInterval={RefetchIntervalOptions.OFF}
          onIntervalChange={() => {}}
          onRefresh={refetch}
        />
      </div>
      <CollapsibleTable
        columns={COLUMNS}
        loading={isLoading}
        data={filteredOrders}
        actions={[]}
        renderDetails={(order) => <OrderRowDetails order={order} />}
      />
    </div>
  );
}
