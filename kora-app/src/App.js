import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvlUtr7jQmc0n362yuXI2GjvtSktOmP6Y",
  authDomain: "kora-9a853.firebaseapp.com",
  projectId: "kora-9a853",
  storageBucket: "kora-9a853.appspot.com",
  messagingSenderId: "175730100980",
  appId: "1:175730100980:web:c0c6a02c6deaff76e32ca1"
};