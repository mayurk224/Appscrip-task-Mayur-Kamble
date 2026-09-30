"use client";

import { useState } from "react";
import styles from "./Footer.module.css";

const brandLinks = ["About Us", "Stories", "Artisans", "Boutiques", "Contact Us", "EU Compliances Docs"];
const quickLinks = ["Orders & Shipping", "Join/Login as a Seller", "Payment & Pricing", "Return & Refunds", "FAQs", "Privacy Policy", "Terms & Conditions"];

function SocialIcon({ type }) {
  return type === "instagram" ? (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.8" r=".8" fill="currentColor" stroke="none" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.2 8.5H2.1V22h3.1V8.5ZM3.65 2A1.82 1.82 0 1 0 3.7 5.64 1.82 1.82 0 0 0 3.65 2ZM22 13.2c0-4.06-2.17-5.96-5.06-5.96a4.37 4.37 0 0 0-3.94 2.17V8.5H9.9V22H13v-7.23c0-1.9.36-3.74 2.72-3.74 2.33 0 2.36 2.17 2.36 3.86V22h3.1l.82-8.8Z" />
    </svg>
  );
}

function LinkList({ links }) {
  return (
    <ul className={styles.linkList}>
      {links.map((link) => <li key={link}><a href="#">{link}</a></li>)}
    </ul>
  );
}

function FooterAccordion({ title, children, brand = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = `footer-${title.toLowerCase().replaceAll(" ", "-")}`;
  const headingClass = `${styles.accordionHeading}${brand ? ` ${styles.brand}` : ""}`;

  return (
    <>
      <h2 className={`${headingClass} ${styles.desktopAccordionHeading}`}>{title}</h2>
      <button
        className={`${headingClass} ${styles.mobileAccordionHeading}`}
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((open) => !open)}
      >
        {title}
      </button>
      <div id={contentId} className={`${styles.accordionContent} ${isOpen ? styles.accordionOpen : ""}`}>
        {children}
      </div>
    </>
  );
}

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <section className={styles.topSection} aria-label="Newsletter and contact information">
          <div className={styles.newsletter}>
            <h2>BE THE FIRST TO KNOW</h2>
            <p className={styles.desktopDescription}>Sign up for updates from mettā muse.</p>
            <p className={styles.mobileDescription}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. this is simply dummy text.</p>
            <form className={styles.newsletterForm}>
              <label className={styles.visuallyHidden} htmlFor="newsletter-email">Email address</label>
              <input id="newsletter-email" type="email" placeholder="Enter your e-mail..." />
              <button type="button">SUBSCRIBE</button>
            </form>
          </div>

          <div className={styles.contactCurrency}>
            <div className={styles.contact}>
              <h2><span className={styles.desktopContactHeading}>CONTACT US</span><span className={styles.mobileContactHeading}>CALL US</span></h2>
              <div className={styles.contactDetails}>
                <a href="tel:+442211335360">+44 221 133 5360</a>
                <span className={styles.contactSeparator} aria-hidden="true">•</span>
                <a href="mailto:customercare@mettamuse.com">customercare@mettamuse.com</a>
              </div>
            </div>
            <div className={styles.currency}>
              <h2>CURRENCY</h2>
              <p className={styles.currencyName}><span className={styles.flag} aria-label="United States flag" role="img">🇺🇸</span><span>• USD</span></p>
              <p className={styles.currencyNote}>Transactions will be completed in Euro and a currency reference is available on hover.</p>
            </div>
          </div>
        </section>

        <div className={styles.divider} />

        <section className={styles.bottomSection} aria-label="Footer links and payment information">
          <nav className={styles.footerColumn} aria-label="About mettā muse">
            <FooterAccordion title="mettā muse" brand><LinkList links={brandLinks} /></FooterAccordion>
          </nav>

          <nav className={styles.footerColumn} aria-label="Quick links">
            <FooterAccordion title="QUICK LINKS"><LinkList links={quickLinks} /></FooterAccordion>
          </nav>

          <div className={styles.footerColumn}>
            <FooterAccordion title="FOLLOW US">
                <div className={styles.socialLinks}>
                  <a href="https://www.instagram.com/" aria-label="Instagram"><SocialIcon type="instagram" /></a>
                  <a href="https://www.linkedin.com/" aria-label="LinkedIn"><SocialIcon type="linkedin" /></a>
                </div>
            </FooterAccordion>
            <div className={styles.paymentSection}>
              <h2 className={styles.paymentHeading}>mettā muse ACCEPTS</h2>
              <ul className={styles.paymentMethods} aria-label="Accepted payment methods">
                <li className={styles.googlePay}>Google Pay</li>
                <li className={styles.mastercard}><span aria-hidden="true"><i /><i /></span><span className={styles.visuallyHidden}>Mastercard</span></li>
                <li className={styles.paypal}>PayPal</li>
                <li className={styles.amex}>AMEX</li>
                <li className={styles.applePay}>● Pay</li>
                <li className={styles.upi}>UPI</li>
              </ul>
            </div>
          </div>
        </section>

        <p className={styles.copyright}>Copyright © 2023 mettamuse. All rights reserved.</p>
      </div>
    </footer>
  );
}
