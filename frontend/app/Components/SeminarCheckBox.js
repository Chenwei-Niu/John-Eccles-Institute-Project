import React, { useState,useEffect } from 'react';

export default function SeminarCheckbox({ id, setData,selectedSeminars }) {
  const [isChecked, setIsChecked] = useState(false);
  useEffect(() => {
    if (selectedSeminars && selectedSeminars.includes(id)) {
        setIsChecked(true);
      } else {
        setIsChecked(false);
      }

  }, [selectedSeminars]);
//   const handleCheckboxChange = () => {
//     setIsChecked(prevChecked => !prevChecked);

//     if (!isChecked) {
//       setSelectedSeminars(prevSelectedSeminars => [...prevSelectedSeminars, id]);
//     } else {
//       setSelectedSeminars(prevSelectedSeminars => prevSelectedSeminars.filter(seminarId => seminarId !== id));
//     }
//     console.log(prevSelectedSeminars)
//   };
  
  const handleCheckboxChange = () => {
    if (isChecked == true){
        setIsChecked(false)
        fetch('http://127.0.0.1:8000/remove-selected-seminars',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({selected: id}),
            credentials: 'include' // This setting in crucial to add cookies into browser
        })
        .then(response => response.json())
        .then(json => setData(json))
        .catch(error => console.error(error));
    } else {
        setIsChecked(true)
        fetch('http://127.0.0.1:8000/add-selected-seminars',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({selected: id}),
            credentials: 'include' // This setting in crucial to add cookies into browser
        })
        .then(response => response.json())
        .then(json => setData(json))
        .catch(error => console.error(error));
    }

  }

  return (
    <div>
      <label>
        <input 
          type="checkbox" 
          checked={isChecked} 
          onChange={handleCheckboxChange} 
          style={{float:'left', zoom:'200%'}}
        />
      </label>
    </div>
  );
}