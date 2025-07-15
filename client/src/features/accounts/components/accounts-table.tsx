import type { CollapsibleTableColumn } from '@/components/ui/collapsible-table/types';
import type { Account } from '../types';
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
import { getAccounts } from '../api';
import { Badge } from '@/components/ui/badge';

export default function AccountsTable() {
  /**
   * Search term
   */
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Query to get accounts
   */
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['accounts'],
    queryFn: getAccounts,
  });

  const filteredAccounts = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.filter(
      (account) =>
        account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.industry?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [data, searchTerm]);

  const COLUMNS: CollapsibleTableColumn<Account>[] = [
    {
      id: 'id',
      header: 'ID',
      accessorKey: 'id',
      cellRenderer(account) {
        return numeral(account.id).format(NumberFormats.WHOLE);
      },
    },
    {
      id: 'name',
      header: 'Name',
      accessorKey: 'name',
    },
    {
      id: 'description',
      header: 'Description',
      accessorKey: 'description',
    },
    {
      id: 'industry',
      header: 'Industry',
      accessorKey: 'industry',
      cellRenderer(account) {
        return <Badge variant="outline">{account.industry}</Badge>;
      },
    },
    {
      id: 'contact',
      header: 'Contact',
      accessorKey: 'contact',
      cellRenderer(account) {
        return <div>{account.contact.name}</div>;
      },
    },
    {
      id: 'credit_limit',
      header: 'Credit Limit',
      accessorKey: 'creditLimit',
      align: 'text-right',
      cellRenderer(account) {
        return numeral(account.creditLimit).format(NumberFormats.ACCOUNTING);
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
        data={filteredAccounts}
        actions={[]}
        renderDetails={() => <div>Details</div>}
      />
    </div>
  );
}
