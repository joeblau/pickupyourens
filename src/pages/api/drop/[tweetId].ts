import type { NextApiRequest, NextApiResponse } from "next";
import { getDrop } from "~/lib/getDrop";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { tweetId, next_token } = req.query as {
    tweetId: string;
    next_token: string;
  };

  try {
    const result = await getDrop({ tweetId, next_token });
    res.status(200).json(result);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
}
