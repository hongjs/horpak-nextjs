import type { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { auth } from 'lib/spreadsheetUtil';

const SpreadsheetAuthcallback: React.FC = () => {
  return <div>Redirect..</div>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const code = context.query?.code;
  if (code) {
    const session = await getSession({ req: context.req });
    const user = session?.user?.email || 'N/A';
    auth(code as string, user);
  }
  return {
    props: { code },
  };
};

export default SpreadsheetAuthcallback;
