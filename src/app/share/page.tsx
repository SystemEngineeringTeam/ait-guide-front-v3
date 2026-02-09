import PageLayout from '@/layout/PageLayout';
import ShareMapPage from '@/page/ShareMapPage';

export default function Page() {
  return (
    <PageLayout>
      <ShareMapPage />
    </PageLayout>
  );
}

export const dynamic = 'force-static';
