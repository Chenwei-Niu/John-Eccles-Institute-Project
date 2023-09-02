"use client";

import { useEffect, useState } from 'react';
import styles from './page.module.css'

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/get-events')
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error(error));
  }, []);

  return(
    <div className={styles.main}>
      {data ? data.map(item => 
        <div key={item.id} className={styles.eventCard}>
          <p>{item.title}</p>
          <p>{item.date}</p>
          <p>{item.venue}</p>
          <p>{item.description}</p>
        </div>
      ): 'Loading...'}
    </div>
  )
}
