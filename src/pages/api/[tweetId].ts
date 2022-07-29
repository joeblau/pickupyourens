import { Client } from "twitter-api-sdk";
import type { NextApiRequest, NextApiResponse } from "next";
import next from "next";
import Error from "next/error";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { tweetId, next_token } = req.query as {
    tweetId: string;
    next_token: string;
  };

  const bearerToken = process.env.TWITTER_BEARER_TOKEN as string;
  const client = new Client(bearerToken);
  try {
    const tweet = await client.tweets.findTweetById(tweetId, {
      "tweet.fields": ["conversation_id"],
    });

    const text = tweet?.data?.text.toLowerCase();

    // if text contains "drop your ens"
    if (text?.match(/drop your ens/)) {
      const { conversation_id } = tweet.data as { conversation_id: string };

      const tweets = await client.tweets.tweetsRecentSearch({
        query: conversation_id,
        "tweet.fields": ["author_id"],
        next_token: next_token,
      });

      const userIds = tweets.data?.map((tweet) => tweet.author_id ?? "");

      const users = await client.users.findUsersById({
        ids: userIds ?? [],
        "user.fields": [
          "created_at",
          "entities",
          "location",
          "name",
          "profile_image_url",
          "description",
          "pinned_tweet_id",
          "protected",
          "public_metrics",
          "url",
          "username",
          "verified",
          "withheld",
        ],
      });

      const zipped = tweets.data?.map((tweet, index) => ({
        ...tweet,
        ...users.data?.[index],
      }));

      const results = {
        data: zipped,
        meta: tweets.meta,
      };

      res.status(200).json(results);
    } else {
      res.status(404).json({ message: "not an ENS drop tweet", status: 404 });
    }
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
}
