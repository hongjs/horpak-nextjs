import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import keys from "config/keys";

const endpoint = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    if (!keys.TURNSTILE_SECRET) {
      return res.json({ success: true });
    }

    try {
      const body = `secret=${encodeURIComponent(
        keys.TURNSTILE_SECRET,
      )}&response=${encodeURIComponent(req.body.token)}`;

      const result = await axios.post(endpoint, body, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const { data } = result;
      if (data.success) {
        return res.json({ success: true });
      } else {
        res.status(400).send({ success: false });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
};

export default handler;
