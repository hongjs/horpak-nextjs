import type { GetServerSideProps } from 'next';

import { generateAuthUrl } from 'lib/spreadsheetUtil';

const SpreadsheetAuth: React.FC = () => {
  return <div>Redirect..</div>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const authUrl = generateAuthUrl();
  return {
    redirect: {
      permanent: false,
      destination: authUrl,
    },
    props: {},
  };
};

export default SpreadsheetAuth;
