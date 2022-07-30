import { Client } from "twitter-api-sdk";

export const getDrop = async ({ tweetId, next_token }) => {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN as string;
  const client = new Client(bearerToken);

  const tweet = await client.tweets.findTweetById(tweetId, {
    "tweet.fields": ["conversation_id"],
  });

  const text = tweet?.data?.text.toLowerCase();
  const { conversation_id } = tweet.data as { conversation_id: string };

  // if text contains "drop your ens"
  if (text?.match(/drop your ens/)) {
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
    return results;
  } else {
    return { message: "not an ENS drop tweet", status: 404 };
  }
};
