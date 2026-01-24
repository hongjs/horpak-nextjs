import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { getUser } from 'lib/firebaseUtil'

const withAdmin = (handler: any) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req })
    if (!session || !session.user || !session.user.email) {
      res.status(401).send('Unauthorized')
      return
    }

    try {
      const user = await getUser(session.user.email)
      if (!user || !user.active || !user.admin) {
        res.status(401).send('Unauthorized')
        return
      }

      return handler(req, res)
    } catch (error) {
      res.status(500).send(error)
    }
  }
}

export default withAdmin
