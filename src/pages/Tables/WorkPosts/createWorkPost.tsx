import WorkPostAddPage from '@/components/Tools/WorkPosts/workPostAdd';
import Head from 'next/head';

const createWorkPost = () => {
  return (
  <>
      <Head>
      <title>Harbor Hotel</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <meta name="description" content="Generated by create next app" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

      <WorkPostAddPage />
  </>
  );
};

export default createWorkPost;