import PageLayout from '@/layout/PageLayout';
import MapPage from '@/page/MapPage';

export default function Page() {
  return (
    <PageLayout>
      <MapPage />
    </PageLayout>
  );
}

export const dynamic = 'force-static';
