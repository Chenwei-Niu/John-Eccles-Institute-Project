"use client";

import { useEffect, useState } from 'react';
import {createRoot} from 'react-dom/client';
import styles from './page.module.css';
import TopComponent from './Components/TopComponent'
import FooterComponent from './Components/FooterComponent';

export default function Home() {
  const [data, setData] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);
  const [searchResult, setSearchResult] = useState([]);
  
  useEffect(() => {
    fetch('http://127.0.0.1:8000/get-events')
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error(error));
  }, []);

  const handleSearchInputChange = (event) => {
    console.log(searchTerm)
    setSearchTerm(event.target.value)
    searchEvents(event.target.value)
  }

  const searchEvents = (keywords) => {
    fetch('http://127.0.0.1:8000/search-events?' +  new URLSearchParams({
        searchTerm: keywords,
      }))
      .then(response => response.json())
      .then(json => setSearchResult(json))
      .catch(error => console.error(error));
  }

  const renderEvent = (item) => {
    return (
      <div key={item.id} className={styles.eventCard}>
        <a href={`${item.url}`}>
        <p className={styles.seminarTitle}>{`${item.title}`}</p>
        <p>{`Date: ${item.date}`}</p>
        <p>{`Venue: ${item.venue}`}</p>
        <p className={styles.ellipsisDescriptionContainer}><div style={{fontWeight:650}}>{`Description:`}</div>{`${item.description}`}</p>
        </a>
      </div>
    )
  }

  return(
    <div className={styles.main}>
      <TopComponent />
      {/* <from className={styles.form} onSubmit={searchEvents}> */}
        <input className={styles.searchInput} 
          type="text"  value={searchTerm} 
          placeholder={"search"} 
          onChange={handleSearchInputChange} />
      {/* </from> */}
      {searchTerm ? searchResult.map(event => renderEvent(event)): 
        data ? data.map(event => renderEvent(event)) : 'loading...'
      }
      <FooterComponent />
    </div>
    
  )
}

