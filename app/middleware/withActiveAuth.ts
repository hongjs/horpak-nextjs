import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { getUser, checkAdmin } from 'lib/firebaseUtil'

const withActiveAuth = (handler: any) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req })
    if (!session || !session.user || !session.user.email) {
      res.status(401).send('Unauthorized')
      return
    }

    try {
      // allow all users to login without checking active flag until we has Admin
      const noAdmin = await checkAdmin()
      if (noAdmin) return handler(req, res)

      const user = await getUser(session.user.email)
      if (!user || !user.active) {
        res.status(401).send('Unauthorized')
        return
      }

      return handler(req, res)
    } catch (error) {
      res.status(500).send(error)
    }
  }
}

export default withActiveAuth
