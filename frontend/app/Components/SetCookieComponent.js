import React, { useState, useEffect } from 'react';
import styles from '../page.module.css';

function SetCookieComponent() {
    const [interests, setInterests] = useState('');
    const [buttonFlag, setButtonFlag] = useState(false);
    const handleInterestsChange = (event) => {
        setButtonFlag(true)
        setInterests(event.target.value);
    };

    useEffect(()=>{
        /*
        In cross-domain requests, browsers do not send cookies by default. 
        We can explicitly instruct the browser to send cookies by using the 
        credentials: "include" option in your request.
        */
        fetch('http://127.0.0.1:8000/get-cookie', {
            credentials: 'include' // This setting in crucial to add cookies to cross-domain request header
        })
        .then(response => response.json())
        .then(json => setInterests(json))
        .catch(error => console.error(error));
    }, [buttonFlag]);

    const handleSubmit = (event) => {
        event.preventDefault();

        // Send data to server to update the cookie
        fetch('http://127.0.0.1:8000/set-cookie', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({interests: interests}),
            credentials: 'include' // This setting in crucial to add cookies into browser
        })
        .then(response => {
            if (response.ok) {
                alert('Cookie is set successfully!');
                setButtonFlag(false)
            } else {
                alert('Failed to set Cookie!');
            }
        })
        .catch(error => console.error('Error:', error));
    };

    return (
        <div className={styles.cookieHostField}>
            {interests == "" || buttonFlag? 
                <><form onSubmit={handleSubmit} className={styles.cookieInputForm}>
                    <label className={styles.cookieDisplay} htmlFor="interests">Interests:</label>
                    <div className={`${styles.addTag} ${styles.cookieDisplay}`}>
                        <span className={styles.cookieDisplay}>{interests == "" ? "Type your interests, separated by commas" : interests}</span>
                        <input v-model={interests} className={styles.cookieDisplay} type="text" id="interests" name="interests" value={interests} placeholder={interests == "" ? "Type your interests, separated by commas" : interests} onChange={handleInterestsChange} />
                    </div>



                    <button type="submit" className={styles.cookieDisplay}>Save Interests</button>
                </form>
                <button onClick={() => setButtonFlag(false)}>Back</button></>
                :
                <button onClick={() => setButtonFlag(true)}>Update Interests</button>
            }

        </div>
    );
}

export default SetCookieComponent;
