import Head from "next/head";
import { NextPage } from "next";
import { api } from "~/utils/api";

const ProfilePage: NextPage = () => {
  const { data, isLoading } = api.profile.getUserByUsername.useQuery({
    username: "pananananas",
  });

  if (isLoading) return <div> Loading </div>;

  if (!data) return <div> User not found </div>;

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <main className="flex h-screen justify-center">
        <div> {data.username} </div>
      </main>
    </>
  );
};

// import { createProxySSGHelpers } from "@trpc/react-query/ssg";

// export const getStaticProps = async (context) => {
  
// }



export default ProfilePage;
