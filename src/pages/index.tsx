import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { SearchIcon } from "@heroicons/react/solid";
import Footer from "~/components/Footer";
import Meta from "~/components/Meta";

const Home: NextPage = () => {
  const router = useRouter();

  const [tweetURL, setTweetURL] = useState("");

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const tweetId = tweetURL.match(/status\/(\d+)/)?.[1];
    router.push(`/drop/${tweetId}`);
  };

  return (
    <div className="hero min-h-screen">
      <Meta />
      <div className="hero-content text-center">
        <div className="max-w-sm md:max-w-md">
          <div className="flex flex-col space-y-10">
            <div className="text-7xl font-black text-white lg:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-fuchsia-500 to-orange-400">
              <h1>Pick up</h1>
              <h1>Your ENS</h1>
            </div>
            <p className="text-xl">
              You asked everyone to drop their ENS in a tweet thread. Now you
              need to pick them all up.
            </p>
            <form onSubmit={submitForm}>
              <div className="form-control">
                <div className="input-group">
                  <input
                    id="tweet"
                    value={tweetURL}
                    onChange={(e) => setTweetURL(e.target.value)}
                    placeholder="Tweet URL"
                    type="text"
                    className="input input-bordered w-full"
                  />
                  <button className="btn btn-square" type="submit">
                    <SearchIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </form>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
