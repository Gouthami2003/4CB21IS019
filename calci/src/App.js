import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const WINDOW_SIZE = 10;
const TEST_SERVER_URL = 'http://localhost:5000/numbers'; // Use the mock server URL

const isValidId = (id) => {
  return ['p', 'f', 'e', 'r'].includes(id);
};

// Fetch numbers from test server
const fetchNumbers = async (type) => {
  try {
    const response = await axios.get(`${TEST_SERVER_URL}/${type}`);
    console.log('API Response:', response); // Log the full response
    if (response.data && Array.isArray(response.data)) {
      return response.data.filter((num, index, self) => self.indexOf(num) === index); // Ensure unique numbers
    }
    console.error('Invalid response data:', response.data);
  } catch (error) {
    console.error('Error fetching numbers:', error);
  }
  return [];
};

// Calculate average of an array of numbers
const calculateAverage = (numbers) => {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return (sum / numbers.length).toFixed(2);
};

function App() {
  const [numberType, setNumberType] = useState('');
  const [numberWindow, setNumberWindow] = useState([]);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleNumberTypeChange = (e) => {
    setNumberType(e.target.value);
  };

  const handleFetchNumbers = async () => {
    if (!isValidId(numberType)) {
      setError('Invalid number ID');
      return;
    }

    setError(null);
    const windowPrevState = [...numberWindow];
    const numbers = await fetchNumbers(numberType);
    
    if (numbers.length === 0) {
      setError('Error fetching numbers');
      return;
    }

    let newWindow = [...numberWindow, ...numbers];
    if (newWindow.length > WINDOW_SIZE) {
      newWindow = newWindow.slice(-WINDOW_SIZE);
    }

    const average = calculateAverage(newWindow);
    setNumberWindow(newWindow);
    setResponse({
      windowPrevState,
      windowCurrState: newWindow,
      numbers,
      avg: parseFloat(average)
    });
  };

  return (
    <div className="App">
      <h1>Average Calculator Microservice</h1>
      <div>
        <label>
          Enter number ID (p, f, e, r):
          <input type="text" value={numberType} onChange={handleNumberTypeChange} />
        </label>
        <button onClick={handleFetchNumbers}>Fetch Numbers</button>
      </div>
      {error && (
        <div style={{ color: 'red' }}>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      )}
      {response && (
        <div>
          <h2>Response</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
