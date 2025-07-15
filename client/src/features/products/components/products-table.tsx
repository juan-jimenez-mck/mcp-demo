import type { CollapsibleTableColumn } from '@/components/ui/collapsible-table/types';
import type { Product } from '../types';
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
import { getProducts } from '../api';

export default function ProductsTable() {
  /**
   * Search term
   */
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Query to get products
   */
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const filteredProducts = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        product.subcategory.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        product.id.toString().includes(searchTerm.toLowerCase()),
    );
  }, [data, searchTerm]);

  const COLUMNS: CollapsibleTableColumn<Product>[] = [
    {
      id: 'id',
      header: 'ID',
      accessorKey: 'id',
      cellRenderer(product) {
        return numeral(product.id).format(NumberFormats.WHOLE);
      },
    },
    {
      id: 'sku',
      header: 'SKU',
      accessorKey: 'sku',
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
      id: 'category',
      header: 'Category',
      accessorKey: 'category',
      cellRenderer(product) {
        return `${product.category.name} - ${product.subcategory.name}`;
      },
    },
    {
      id: 'price',
      header: 'Price',
      accessorKey: 'price',
      align: 'text-right',
      cellRenderer(product) {
        return numeral(product.price).format(NumberFormats.ACCOUNTING);
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
        data={filteredProducts}
        actions={[]}
        renderDetails={() => <div>Details</div>}
      />
    </div>
  );
}
