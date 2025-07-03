import React from 'react';
import PaisList from './components/PaisList';
import MedallaList from './components/MedallaList';

function App() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>App de Países y Medallas</h1>
      <PaisList />
      <hr />
      <MedallaList />
    </div>
  );
}

export default App;
