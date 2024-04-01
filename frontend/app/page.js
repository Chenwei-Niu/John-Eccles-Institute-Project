"use client";

import styles from './page.module.css';
import TopComponent from './Components/TopComponent'
import FooterComponent from './Components/FooterComponent';

import SearchAndSeminarsComponent from './Components/SearchAndSeminarsComponent'
export default function Home() {


  return(
    <div className={styles.main}>
      <TopComponent />

      <SearchAndSeminarsComponent />
      <FooterComponent />
    </div>
    
  )
}

