import React, { useState, useEffect } from 'react';

function SetCookieComponent() {
    const [interests, setInterests] = useState('');

    const handleInterestsChange = (event) => {
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
    }, []);

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
            } else {
                alert('Failed to set Cookie!');
            }
        })
        .catch(error => console.error('Error:', error));
    };

    return (
        <div>
            <h1>Interests Settings</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="interests">Interests:</label>
                <input type="text" id="interests" name="interests" value={interests} placeholder={interests == "" ? "Type your interests, separated by commas" : interests} onChange={handleInterestsChange} /><br /><br />
                
                
                <button type="submit">Save Interests</button>
            </form>
        </div>
    );
}

export default SetCookieComponent;
