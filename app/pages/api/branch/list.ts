import type { NextApiRequest, NextApiResponse } from "next";
import { withActiveAuth } from "middleware";
import clientPromise from "lib/mongodb";
import keys from "config/keys";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const client = await clientPromise;
    const db = client.db(keys.DB_NAME);

    const branches = await db.collection("branches").find({}).toArray();

    res.json(branches);
  }
};

export default withActiveAuth(handler);
