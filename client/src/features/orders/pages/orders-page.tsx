import Page from '@/components/layout/page';
import OrdersTable from '../components/orders-table';

export default function OrdersPage() {
  return (
    <Page title="Orders">
      <OrdersTable />
    </Page>
  );
}
