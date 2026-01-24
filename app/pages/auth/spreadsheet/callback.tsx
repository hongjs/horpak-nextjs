import type { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { auth } from 'lib/spreadsheetUtil'

const SpreadsheetAuthcallback: React.FC = () => {
  return <div>Redirect..</div>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const code = context.query?.code
  if (code) {
    const session = await getSession({ req: context.req })
    const user = session?.user?.email || 'N/A'
    await auth(code as string, user)
  }
  return {
    redirect: {
      permanent: false,
      destination: '/admin/datasource'
    },
    props: {}
  }
}

export default SpreadsheetAuthcallback
