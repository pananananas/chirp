/* eslint-disable @typescript-eslint/consistent-type-imports */
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

//removed:  SignIn, SignOutButton,
import { SignInButton, useUser } from "@clerk/clerk-react";
import { api } from "~/utils/api";
import { RouterOutputs } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LoadingSpinner, LoadingPage } from "~/components/loading";
import { useState } from "react";
import toast from "react-hot-toast";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();

  const [input, setInput] = useState("");

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage)
        if (errorMessage[0]) toast.error(errorMessage[0]);
        else toast.error("Failed to post your emoji!");
      setInput("");
    },
  });

  if (!user) return null;

  console.log(user);

  return (
    <div className="flex w-full gap-4">
      <Image
        src={user.profileImageUrl}
        alt="profile image"
        className="h-14 w-14 rounded-full"
        width={50}
        height={50}
      />
      <input
        placeholder="Type some emojis!"
        className="grow bg-transparent outline-none "
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input !== "") mutate({ content: input });
          }
        }}
        disabled={isPosting}
      />
      {input !== "" && !isPosting && (
        <button
          onClick={() => {
            mutate({ content: input });
          }}
          className=" rounded-md px-4 py-2 text-slate-100"
        >
          Post
        </button>
      )}
      {isPosting && (
        <div className="flex items-center justify-center pr-5">
          <LoadingSpinner size={20} />
        </div>
      )}
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  return (
    <div key={post.id} className="flex gap-4 border-b border-slate-400 p-4">
      <Link href={`/@${author.username}`}>
        <Image
          src={author.profileImageUrl}
          className="h-14 w-14 rounded-full"
          alt={`@${author.username}'s profile pic`}
          width={50}
          height={50}
        />
      </Link>
      <div className="flex flex-col">
        <div className="flex text-slate-300">
          <Link href={`/@${author.username}`}>
            <span className="">{author.username}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="ml-2 text-slate-500">
              {`· ${dayjs(post.createdAt).fromNow()}`}
            </span>
          </Link>
        </div>
        <Link href={`/post/${post.id}`}>
          <span className="text-xl">{post.content}</span>
        </Link>
      </div>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <LoadingPage />;

  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

export default function Home() {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  api.posts.getAll.useQuery();

  // Return empdy div if user is not loaded
  if (!userLoaded) return <div />;

  return (
    <main className="flex h-screen justify-center">
      <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
        <div className="flex border-b border-slate-400 p-4">
          {!isSignedIn && (
            <div className="flex justify-center">
              <SignInButton />
            </div>
          )}
          {isSignedIn && <CreatePostWizard />}
        </div>
        <Feed />
      </div>
    </main>
  );
};
