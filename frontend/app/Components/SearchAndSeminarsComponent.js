
import { useEffect, useState } from 'react';
import styles from '../page.module.css';
import SetCookieComponent from './SetCookieComponent';

export default function SearchAndSeminarsComponent() {
  const [data, setData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  
  useEffect(() => {
    fetch('http://127.0.0.1:8000/get-events',{
      credentials: 'include' // This setting in crucial to add cookies to cross-domain request header
    })
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error(error));
  }, []);

  const handleCookieUpdate= () =>{
    fetch('http://127.0.0.1:8000/get-events',{
      credentials: 'include' // This setting in crucial to add cookies to cross-domain request header
    })
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error(error));
  }
  const handleSearchInputChange = (event) => {
    console.log(searchTerm)
    setSearchTerm(event.target.value)
    searchEvents(event.target.value)
  }

  const searchEvents = (keywords) => {
    fetch('http://127.0.0.1:8000/search-events?' +  new URLSearchParams({
        searchTerm: keywords,
      }),{
        credentials: 'include' // This setting in crucial to add cookies to cross-domain request header
      })
      .then(response => response.json())
      .then(json => setSearchResult(json))
      .catch(error => console.error(error));
  }

  const handleBackToTop = () => {
        var timer  = null;
        cancelAnimationFrame(timer);
        //get current miliseconds
        var startTime = +new Date();     
        //get the current scroll height
        var b = document.body.scrollTop || document.documentElement.scrollTop;
        var d = 500;
        var c = b;
        timer = requestAnimationFrame(function func(){
            var t = d - Math.max(0,startTime - (+new Date()) + d);
            document.documentElement.scrollTop = document.body.scrollTop = t * (-c) / d + b;
            timer = requestAnimationFrame(func);
            if(t == d){
              cancelAnimationFrame(timer);
            }
        });
  }

  const renderEvent = (item) => {
    return (
      <div key={item.id} className={styles.eventCard}>
        <div className={`${styles.left} ${styles.twoThird}`}>
          <div className={`${styles.left} ${styles.tickBox}`}>
            <input type="checkbox" style={{float:'left', zoom:'200%'}}/>
          </div>
          <div className={`${styles.left} ${styles.infoBox}`}>
            <a href={`${item.url}`}>
            <p className={styles.seminarTitle}>{`${item.title}`}</p>
            
            <p className={styles.dateAndVenue}style={{fontWeight:650}}>{`Date: `}</p><p className={styles.dateAndVenue}>{`${item.date}`}</p>
            <div>
              <p className={styles.dateAndVenue}style={{fontWeight:650}}>{`Venue: `}</p><p className={styles.dateAndVenue}>{`${item.venue}`}</p>
            </div>
            <div className={styles.ellipsisDescriptionContainer}><p style={{fontWeight:650}}>{`Description:`}</p>{`${item.description}`}</div>
            </a>
          </div>

        </div>
        <div className={`${styles.right} ${styles.oneThird} ${styles.nomargintop} ${styles.padtop} ${styles.padbottom} ${styles.nomarginbottom}`}>
          <a href={`${item.url}`}> 
            <img typeof="foaf:Image" src="https://jcsmr.anu.edu.au/files/styles/anu_doublenarrow_440_248/public/Samantha%20Barton%20copy.jpg?itok=Cek2oTxI" width="440" height="248" alt="Dr Samantha Barton"/>
          </a>
        </div>
        <div className='clear'>
        </div>
      </div>

    )
  }

  return(
    <><SetCookieComponent refreshEventList={handleCookieUpdate}/>
    <div className={styles.searchAndSeminarWrapper}>
      {/* <from className={styles.form} onSubmit={searchEvents}> */}
        <input className={styles.searchInput} 
          type="text"  value={searchTerm} 
          placeholder={"search"} 
          onChange={handleSearchInputChange} />
      {/* </from> */}
      {searchTerm ? searchResult.map(event => renderEvent(event)): 
        data ? data.map(event => renderEvent(event)) : 'loading...'
      }
      <div className={styles.backToTopBox} onClick={handleBackToTop}>
        <div className={styles.backToTopBoxIn}></div>
      </div>
    </div>
    </>
  )
}

