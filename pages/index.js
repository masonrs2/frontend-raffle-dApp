import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Header from "../components/Header"
import EnterLottery from "../components/EnterLottery";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Decentralized Lottery</title>
        <meta name="description" content="Smart Contract Lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <EnterLottery />
    </div>
  );
}
