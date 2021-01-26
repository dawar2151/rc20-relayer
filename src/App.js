import React from 'react';
import logo from './logo.png';
import './App.css';
import  Transaction from './components/Transaction';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
        </a>
      </header>
      <Transaction />
    </div>
  );
}

export default App;
