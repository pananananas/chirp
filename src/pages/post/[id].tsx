import Head from "next/head";
import { NextPage } from "next";

const SinglePostPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <main className="flex h-screen justify-center">
        <div> Post View </div>
      </main>
    </>
  );
};
export default SinglePostPage;
