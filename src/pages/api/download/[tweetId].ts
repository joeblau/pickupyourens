import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import { getDrop } from "~/lib/getDrop";
import Twitter from "twitter-api-v2";

const alchemyAPIKey = process.env.ALCHEMY_API_KEY as string;

const provider = new ethers.providers.JsonRpcProvider(
  `https://eth-mainnet.g.alchemy.com/v2/${alchemyAPIKey}`
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { tweetId, next_token } = req.query as {
    tweetId: string;
    next_token: string;
  };

  // loop while value exists
  let keepGoing = true;
  let username = null;
  let nextDrop = {
    tweetId,
    next_token,
  };

  const addresses = [];
  while (keepGoing) {
    const { meta, data: drops, user }: any = await getDrop(nextDrop);
    username = user?.username;

    for (const drop of drops) {
      const ens = (drop.text.match(/ (.*\.eth)/g)?.[0] as string).trim();

      if (ens) {
        const address = await provider.resolveName(ens);
        drop.ens = { name: ens, address };
        addresses.push(drop);
      }
    }

    if (meta?.next_token) {
      nextDrop = { tweetId, next_token: meta?.next_token };
    } else {
      keepGoing = false;
    }
  }

  res.status(200).json(addresses);

  if (username) {
    const client = new Twitter({
      appKey: process.env.TWITTER_CONSUMER_KEY,
      appSecret: process.env.TWITTER_CONSUMER_SECRET,
      accessToken: process.env.TWITTER_TOKEN,
      accessSecret: process.env.TWITTER_TOKEN_SECRET,
    });

    const status = `@${username} just picked up their ENS at https://pickupyourens.xyz #dropyourens → #pickupyourens`;

    client.v1.tweet(status);
  }
}
