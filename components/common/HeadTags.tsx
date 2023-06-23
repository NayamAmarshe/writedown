import Head from "next/head";
import React from "react";

type HeadTagsProps = {
  title: string;
  ogImage: string;
  description: string;
  ogUrl: string;
};

const HeadTags = ({ title, ogImage, description, ogUrl }: HeadTagsProps) => {
  return (
    <Head>
      <link rel="manifest" href="/manifest.json" />
      <link rel="apple-touch-icon" href="/icons/icon-180x180.png" />
      <meta name="theme-color" content="#e2e8f0" />
      <link rel="icon" type="image/png" href="/icons/favicon-32x32.png" />
      <link
        href="/icons/favicon-16x16.png"
        rel="icon"
        type="image/png"
        sizes="16x16"
      />
      <link
        href="/icons/favicon-32x32.png"
        rel="icon"
        type="image/png"
        sizes="32x32"
      />
      <meta name="application-name" content="writedown" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      {/* META TAGS */}
      <title>{title}</title>
      <meta
        name="apple-mobile-web-app-title"
        content="writedown - Notes made simple"
      />
      <meta name="description" content={description} key="description" />
      {/* TWITTER */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={ogUrl} />
      <meta name="twitter:title" content={title} />
      <meta
        name="twitter:description"
        content={description}
        key="twitter-description"
      />
      <meta name="twitter:image" content={ogImage} key="twitter-image" />
      {/* OG */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} key="og-title" />
      <meta
        property="og:description"
        content={description}
        key="og-description"
      />
      <meta property="og:site_name" content="writedown" />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:image" content={ogImage} key="og-image" />
    </Head>
  );
};

export default HeadTags;
