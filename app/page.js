import Header from "../components/Header";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroContent}>
            <h1 id="hero-title">Discover our product</h1>
            <p>
              Explore thoughtfully curated pieces designed to bring
              <br className={styles.desktopBreak} /> quality, creativity, and a little inspiration into your
              <br className={styles.desktopBreak} /> everyday life.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
