import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

const withAuth = (handler: any) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req })
    if (session && session.user) {
      return handler(req, res)
    }
    res.status(401).send('Unauthorized')
  }
}

export default withAuth
