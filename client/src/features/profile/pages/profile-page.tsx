import Page from '@/components/layout/page';
import ProfilePageActions from '../components/profile-page-actions';

export default function ProfilePage() {
  return (
    <Page title="Profile" actions={<ProfilePageActions />}>
      Profile
    </Page>
  );
}
