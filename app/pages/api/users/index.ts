import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from 'lib/firebaseUtil'
import { withAuth } from 'middleware'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const users: any[] = []
      const snapshot = await db.collection('users').get()
      snapshot.forEach((doc: any) => {
        users.push({ id: doc.id, ...doc.data() })
      })
      res.send(users)
    } catch (error) {
      res.status(500).send(error)
    }
  }
}

export default withAuth(handler)
