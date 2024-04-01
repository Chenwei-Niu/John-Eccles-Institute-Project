"use client";

import styles from './page.module.css';
import TopComponent from './Components/TopComponent'
import FooterComponent from './Components/FooterComponent';
import SetCookieComponent from './Components/SetCookieComponent';
import SearchAndSeminarsComponent from './Components/SearchAndSeminarsComponent'
export default function Home() {
  const handleCookieUpdate= () =>{
    fetch('http://127.0.0.1:8000/get-events',{
      credentials: 'include' // This setting in crucial to add cookies to cross-domain request header
    })
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error(error));
  }

  return(
    <div className={styles.main}>
      <TopComponent />
      <SetCookieComponent refreshEventList={handleCookieUpdate}/>
      <SearchAndSeminarsComponent />
      <FooterComponent />
    </div>
    
  )
}

