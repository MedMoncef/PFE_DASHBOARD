import AnnouncementPage from '@/components/Tools/Announcements/announcementDetail';
import Head from 'next/head';

const announcementDetails = () => {
  return (
  <>
      <Head>
      <title>Harbor Hotel</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <meta name="description" content="Generated by create next app" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

      <AnnouncementPage />
  </>
  );
};

export default announcementDetails;