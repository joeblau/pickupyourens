import Head from "next/head";

const Meta = () => {
  const title = "Pick up Your ENS";
  const description =
    "Collect all of the ENS wallet addresses from a drop your ens campaign";
  const url = "https://pickupyourens.xyz";
  const image = "https://pickupyourens.xyz/images/og-image.png";
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@atomizexyz" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <meta property="og:url" content={url} key="ogurl" />
      <meta property="og:image" content={image} key="ogimage" />
      <meta property="og:site_name" content={title} key="ogsitename" />
      <meta property="og:title" content={title} key="ogtitle" />
      <meta property="og:description" content={description} key="ogdesc" />

      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default Meta;
