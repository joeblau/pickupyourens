import { useRouter } from "next/router";
import Head from "next/head";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import Footer from "../../components/footer";
import { BanIcon } from "@heroicons/react/solid";

const DropPage = () => {
  const router = useRouter();
  const { tweetId, next_token } = router.query;

  const dropLink = next_token
    ? `/api/${tweetId}?next_token=${next_token}`
    : `/api/${tweetId}`;
  const { data: results } = useSWR(dropLink);

  const shortAddress = (address: string) => {
    if (address && address.length > 0) {
      return (
        address.substring(0, 6) + "..." + address.substring(address.length - 4)
      );
    }
    return "";
  };

  const UserRow = ({ user }: any) => {
    const ens = user.text.match(/ (.*\.eth)/g)?.[0] as string;
    const address = user.text.match(/^0x[a-fA-F0-9]{40}/g)?.[0] as string;

    return (
      <tr>
        <td>
          <div className="flex items-center space-x-3">
            <div className="avatar">
              <div className="mask mask-squircle w-12 h-12">
                <Image
                  src={user.profile_image_url}
                  alt={user.name}
                  layout="fill" // required
                  objectFit="cover" // change to suit your needs
                />
              </div>
            </div>
            <div>
              <div className="font-bold">{user.name}</div>
              <div className="text-sm opacity-50">{user.username}</div>
            </div>
          </div>
        </td>
        <td>
          {ens && ens}
          {address && shortAddress(address)}
        </td>
        <th>
          <button className="btn btn-ghost btn-xs">
            <Link href={`https://twitter.com/${user.username}`}>
              <a>View on Twitter</a>
            </Link>
          </button>
        </th>
      </tr>
    );
  };

  const SkeletonRow = () => {
    return (
      <tr>
        <td>
          <div className="flex items-center space-x-3">
            <div className="avatar">
              <div className="mask mask-squircle w-12 h-12 skeleton"></div>
            </div>
            <div className="flex flex-col space-y-1">
              <div className="w-64 h-5 rounded-md skeleton"></div>
              <div className="w-32 h-4 rounded-md skeleton"></div>
            </div>
          </div>
        </td>
        <td>
          <div className="w-24 h-6 rounded-md skeleton"></div>
        </td>
        <th>
          <div className="w-24 h-4 rounded-md skeleton"></div>
        </th>
      </tr>
    );
  };

  return (
    <div className="hero">
      <Head>
        <title>Pick up Your ENS</title>
        <meta name="description" content="Pick up your ENS drop" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="hero-content text-center flex flex-col">
        <Link href="/">
          <a>
            <div className="text-2xl font-black text-white lg:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-fuchsia-500 to-orange-400">
              <h1>Pick up</h1>
              <h1>Your ENS</h1>
            </div>
          </a>
        </Link>
        {results ? (
          <div className="overflow-x-auto w-full flex flex-col space-y-8">
            {tweetId === "undefined" || results?.status == 404 ? (
              <div className="alert alert-error shadow-lg">
                <div>
                  <BanIcon className="h-6 w-6" />
                  <span>Not a drop</span>
                </div>
              </div>
            ) : (
              <>
                <div className="flex">
                  <Link href="https://www.3rm.co/">
                    <a className="btn">Download All</a>
                  </Link>
                </div>
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>ENS / Address</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {results?.data?.map((user: any, index: number) => (
                      <UserRow key={index} user={user} />
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th>Name</th>
                      <th>ENS / Address</th>
                      <th></th>
                    </tr>
                  </tfoot>
                </table>
                <div className="flex space-x-2 justify-center">
                  {next_token ? (
                    <Link href={`/drop/${tweetId}`}>
                      <a className="btn">Page 1</a>
                    </Link>
                  ) : (
                    <div className="btn btn-disabled">Page 1</div>
                  )}
                  {results?.meta?.next_token ? (
                    <Link
                      href={`/drop/${tweetId}?next_token=${results?.meta.next_token}`}
                    >
                      <a className="btn">Next Page</a>
                    </Link>
                  ) : (
                    <div className="btn btn-disabled">Next Page</div>
                  )}
                </div>
              </>
            )}
            <Footer />
          </div>
        ) : (
          <div className="overflow-x-auto w-full flex flex-col space-y-8">
            <div>
              <div className="w-36 h-12 rounded-md skeleton"></div>
            </div>
            <table className="table w-full w-72">
              <thead>
                <tr>
                  <th>
                    <div className="w-32 h-4 rounded-sm skeleton"></div>
                  </th>
                  <th>
                    <div className="w-32 h-4 rounded-sm skeleton"></div>
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {[...Array(10)].map((x, i) => (
                  <SkeletonRow key={i} />
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th>
                    <div className="w-32 h-4 rounded-sm skeleton"></div>
                  </th>
                  <th>
                    <div className="w-32 h-4 rounded-sm skeleton"></div>
                  </th>
                  <th></th>
                </tr>
              </tfoot>
            </table>
            <div className="flex space-x-2 justify-center">
              <div className="w-32 h-12 rounded-md skeleton"></div>
              <div className="w-40 h-12 rounded-md skeleton"></div>
            </div>
            <Footer />
          </div>
        )}
      </div>
    </div>
  );
};

export default DropPage;
