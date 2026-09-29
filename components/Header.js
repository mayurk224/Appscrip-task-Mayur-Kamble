import styles from "./Header.module.css";

const navigationItems = ["Shop", "Skills", "Stories", "About", "Contact us"];

function Icon({ name }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    wishlist: <path d="M20.8 8.6c0 5.2-8.8 10-8.8 10s-8.8-4.8-8.8-10A4.6 4.6 0 0 1 12 6a4.6 4.6 0 0 1 8.8 2.6Z" />,
    cart: <><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 1.9-1.5L22 8H6" /><circle cx="10" cy="21" r="1" /><circle cx="19" cy="21" r="1" /></>,
    profile: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <a className={styles.logo} href="/" aria-label="Logo home">
          <svg aria-hidden="true" viewBox="0 0 40 40" fill="none">
            <path d="M20 2 37 11.5v17L20 38 3 28.5v-17L20 2Z" stroke="currentColor" strokeWidth="2" />
            <path d="m12 25 8-14 8 14M15 20h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        <a href="/" className={styles.storeName}>SHOP<span>STORE</span></a>

        <div className={styles.actions} aria-label="Store actions">
          <button className={styles.iconButton} type="button" aria-label="Search"><Icon name="search" /></button>
          <button className={styles.iconButton} type="button" aria-label="Wishlist"><Icon name="wishlist" /></button>
          <button className={styles.iconButton} type="button" aria-label="Shopping cart"><Icon name="cart" /></button>
          <button className={`${styles.iconButton} ${styles.profileButton}`} type="button" aria-label="Profile"><Icon name="profile" /></button>
          <label className={styles.languageLabel}>
            <span className={styles.visuallyHidden}>Language</span>
            <select aria-label="Language" defaultValue="en">
              <option value="en">ENG</option>
              <option value="fr">FRA</option>
              <option value="de">DEU</option>
            </select>
          </label>
        </div>
      </div>

      <nav className={styles.navigation} aria-label="Main navigation">
        {navigationItems.map((item) => <a href="#" key={item}>{item}</a>)}
      </nav>
    </header>
  );
}
