import { AnimatePresence } from "framer-motion";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { modalState, modalTypeState } from "../atoms/modalAtom";
import Feed from "../components/Feed";
import Header from "../components/Header";
import Modal from "../components/Modal";
import Sidebar from "../components/Sidebar";
import Widgets from "../components/Widgets";
import { connectToDatabase } from "../utils/mongodb";

export default function Home({ posts, articles }) {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/home");
    },
  });
  const [modalOpen, setModalOpen] = useRecoilState(modalState);
  const [modalType, setModalType] = useRecoilState(modalTypeState);

  return (
    <div className="bg-[#F3F2EF] dark:bg-black dark:text-white h-screen overflow-y-scroll md:space-y-6">
      <Head>
        <title>{`${session.user.name} | LinkedIn` || "Feed | LinkedIn"}</title>
        <meta
          name="description"
          content="Make the most of your professional life"
        />
        <link rel="icon" href="/linkedin.png" />
      </Head>
      <Header />
      <main className="flex justify-center gap-x-5 px-4 sm:px-12">
        <div className="flex flex-col md:flex-row gap-5">
          <Sidebar />
          <Feed posts={posts} />
        </div>
        <Widgets articles={articles} />
        <AnimatePresence>
          {modalOpen && (
            <Modal handleClose={() => setModalOpen(false)} type={modalType} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (!session) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }
  const { db } = await connectToDatabase();
  const posts = await db
    .collection("posts")
    .find()
    .sort({ timestamp: -1 })
    .toArray();

  const results = await fetch(
    `https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=${process.env.NEWS_API_KEY}`
  ).then((res) => res.json());
  return {
    props: {
      session,
      articles: results.articles,
      posts: posts.map(
        ({ _id, input, photoUrl, username, userImg, email, createdAt }) => ({
          _id: _id.toString(),
          input,
          photoUrl,
          username,
          email,
          userImg,
          createdAt,
        })
      ),
    },
  };
};
