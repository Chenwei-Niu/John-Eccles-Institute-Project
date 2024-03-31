import React, { useState } from 'react';

function SetCookieComponent() {
    const [interests, setInterests] = useState('');

    const handleInterestsChange = (event) => {
        setInterests(event.target.value);
    };


    const handleSubmit = (event) => {
        event.preventDefault();

        // Send data to server to update the cookie
        fetch('http://127.0.0.1:8000/set_cookie', {
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
                <input type="text" id="interests" name="interests" value={interests} placeholder={"Type your interests, separated by commas"} onChange={handleInterestsChange} /><br /><br />
                
                
                <button type="submit">Save Interests</button>
            </form>
        </div>
    );
}

export default SetCookieComponent;
