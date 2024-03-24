import logo from './logo.svg';
import './App.css';
import './scripts/api.js';
import { fetchData, sendData } from './scripts/api.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p className='text-6xl'>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={()=>sendData("Test")}>sendData</button>
        <button onClick={()=>fetchData()}>fetchData</button>
      </header>
    </div>
  );
}

export default App;
