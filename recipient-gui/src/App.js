 
import './App.css';
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Recipient from './components/RecipientComponent/Recipient';
import Presenter from './components/PresenterComponent/Presenter';
import Event from './components/EventComponent/Event';

function App() {
  const [selectedComponent, setSelectedComponent] = useState('Recipient');

  const handleComponentSelect = (component) => {
    setSelectedComponent(component);
  };
  return (
    <div className="App">
      <Navbar onSelect={handleComponentSelect} />
      <div>
        {selectedComponent === 'Recipient' && <Recipient />}
        {selectedComponent === 'Presenter' && <Presenter />}
        {selectedComponent === 'Event' && <Event />}
      </div>
    </div>
  );
}

export default App;
