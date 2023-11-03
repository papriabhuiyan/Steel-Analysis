

import React, { useState } from 'react';
import './App.css';

const elements = [
  'Chromium', 'Nickel', 'Molybdenum', 'Carbon', 'Manganese',
  'Phosphorus', 'Sulfur', 'Silicon', 'Nitrogen', 'Iron'
];

const App = () => {
  const [initialWeight, setInitialWeight] = useState('');
  const [initialComposition, setInitialComposition] = useState(new Array(elements.length).fill(''));
  const [finalComposition, setFinalComposition] = useState(new Array(elements.length).fill(''));
  const [elementsToAdd, setElementsToAdd] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const calculateElementAdditions = (initialWeight, initialComp, finalComp) => {
    let totalAddedWeight = 0;
    let newTotalWeight = initialWeight;
    const additions = initialComp.map((ic, i) => {
      const currentWeight = (initialWeight * ic) / 100;
      const targetWeight = (newTotalWeight * finalComp[i]) / 100;
      const addition = Math.max(0, targetWeight - currentWeight);
      totalAddedWeight += addition;
      return addition;
    });

    newTotalWeight += totalAddedWeight;

    let adjustmentNeeded = true;
    while (adjustmentNeeded) {
      adjustmentNeeded = false;
      additions.forEach((addition, i) => {
        const currentWeight = (initialWeight * initialComp[i]) / 100 + addition;
        const targetWeight = (newTotalWeight * finalComp[i]) / 100;
        const additionalAddition = targetWeight - currentWeight;
        if (additionalAddition > 0.01) {
          additions[i] += additionalAddition;
          totalAddedWeight += additionalAddition;
          newTotalWeight += additionalAddition;
          adjustmentNeeded = true;
        }
      });
    }

    return additions.map(addition => addition.toFixed(2));
  };

  const handleInitialCompositionChange = (index, value) => {
    const newComposition = [...initialComposition];
    newComposition[index] = value;
    setInitialComposition(newComposition);
  };

  const handleFinalCompositionChange = (index, value) => {
    const newComposition = [...finalComposition];
    newComposition[index] = value;
    setFinalComposition(newComposition);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage(''); // Reset error message
    const initialCompTotal = initialComposition.reduce((acc, curr) => acc + parseFloat(curr || 0), 0);
    const finalCompTotal = finalComposition.reduce((acc, curr) => acc + parseFloat(curr || 0), 0);
    if (initialCompTotal !== 100 && finalCompTotal !== 100){
      setErrorMessage('Compositions need to add up to 100.');
      return;
    }
    else if (initialCompTotal !== 100) {
        setErrorMessage('Initial composition needs to add up to 100.');
        return;
      }
    else if (finalCompTotal !== 100) {
        setErrorMessage('Final composition needs to add up to 100.');
        return;
      }

    const initialCompArray = initialComposition.map(Number);
    const finalCompArray = finalComposition.map(Number);
    const compositionsEqual = initialCompArray.every((value, index) => value === finalCompArray[index]);

    if (compositionsEqual) {
      setErrorMessage('Elements do not need to be added.');
      return;
    }
    const additions = calculateElementAdditions(parseFloat(initialWeight), initialCompArray, finalCompArray);
    setElementsToAdd(additions);
  };

  return (
    // <div>
    //   <h1>Composition Adjustment Calculator</h1>
    //   {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    //   <form onSubmit={handleSubmit}>
    //     <div>
    //       <label>
    //         Initial Weight in grams:
    //         <input
    //           type="number"
    //           step="0.001"
    //           value={initialWeight}
    //           onChange={(e) => setInitialWeight(e.target.value)}
    //           required
    //         />
    //       </label>
    //     </div>

    //     {elements.map((element, index) => (
    //       <div key={element}>
    //         <label>
    //           Initial {element} (%):
    //           <input
    //             type="number"
    //             step="0.001"
    //             value={initialComposition[index]}
    //             onChange={(e) => handleInitialCompositionChange(index, e.target.value)}
    //             required
    //             min="0"
    //             max="100"
    //           />
    //         </label>
    //         <label>
    //           Final {element} (%):
    //           <input
    //             type="number"
    //             step="0.001"
    //             value={finalComposition[index]}
    //             onChange={(e) => handleFinalCompositionChange(index, e.target.value)}
    //             required
    //             min="0"
    //             max="100"
    //           />
    //         </label>
    //       </div>
    //     ))}

    //     <button type="submit">Calculate</button>
    //   </form>

    //   {elementsToAdd.length > 0 && (
    //     <div>
    //       <h2>Amount to add for each element (in grams):</h2>
    //       <ul>
    //         {elementsToAdd.map((amount, index) => (
    //           <li key={index}>
    //             {elements[index]}: {amount} grams
    //           </li>
    //         ))}
    //       </ul>
    //     </div>
    //   )}
    // </div>



<div>
  <div className='main-div'>
  <h1 className='text-color'>Composition Adjustment Calculator</h1>
  {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
  <form onSubmit={handleSubmit}>
    <table>
      <thead>
        <tr>
          <th className='header-color'>Element</th>
          <th className='header-color'>Initial (%)</th>
          <th className='header-color'>Final (%)</th>
        </tr>
      </thead>
      <tbody>
        {elements.map((element, index) => (
          <tr key={element}>
            <td className='text-color'>{element}</td>
            <td>
              <input
                className='custom-input'
                type="number"
                step="0.001"
                value={initialComposition[index]}
                onChange={(e) => handleInitialCompositionChange(index, e.target.value)}
                required
                min="0"
                max="100"
              />
            </td>
            <td>
              <input
                className='custom-input'
                type="number"
                step="0.001"
                value={finalComposition[index]}
                onChange={(e) => handleFinalCompositionChange(index, e.target.value)}
                required
                min="0"
                max="100"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <div className="initial-weight-div">
      <label className='text-color'>
        Initial Weight in grams:
        <input
          className='custom-input'
          type="number"
          step="0.001"
          value={initialWeight}
          onChange={(e) => setInitialWeight(e.target.value)}
          min="0"
          max="10000"
          required
        />
      </label>
    </div>

    <button className='custom-button' type="submit">Calculate</button>
  </form>
  </div>
  {/* {elementsToAdd.length > 0 && (
    <div>
      <h2>Amount to add for each element (in grams):</h2>
      <ul>
        {elementsToAdd.map((amount, index) => (
          <li key={index}>
            {elements[index]}: {amount} grams
          </li>
        ))}
      </ul>
    </div>
  )} */}
  <div className='results text-color'>
  {elementsToAdd.length > 0 && (
  <div>
    <h2>Amount to add for each element (in grams):    </h2>
    <ul style={{ listStyleType: 'none', padding: 0 }}>
      {elementsToAdd.map((amount, index) => (
        <li key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>{elements[index]}:</span>
          <span>{amount} grams</span>
        </li>
      ))}
    </ul>
  </div>
)}
</div>
</div>

  );
};

export default App;


