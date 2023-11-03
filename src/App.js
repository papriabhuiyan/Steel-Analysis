
// import React, { useState } from 'react';

// const App = () => {
//   const [initialWeight, setInitialWeight] = useState('');
//   const [initialComposition, setInitialComposition] = useState('');
//   const [finalComposition, setFinalComposition] = useState('');
//   const [elementsToAdd, setElementsToAdd] = useState([]);

//   const calculateElementAdditions = (initialWeight, initialComp, finalComp) => {
//     const elementsToAdd = new Array(initialComp.length).fill(0);
//     let totalAddedWeight = 0;
//     let newTotalWeight = initialWeight;

//     for (let i = 0; i < initialComp.length; i++) {
//       const currentWeight = (initialWeight * initialComp[i]) / 100;
//       const targetWeight = (newTotalWeight * finalComp[i]) / 100;
//       const addition = Math.max(0, targetWeight - currentWeight);
//       elementsToAdd[i] += addition;
//       totalAddedWeight += addition;
//     }

//     newTotalWeight += totalAddedWeight;

//     let adjustmentNeeded = true;
//     while (adjustmentNeeded) {
//       adjustmentNeeded = false;
//       for (let i = 0; i < initialComp.length; i++) {
//         const currentWeight = (initialWeight * initialComp[i]) / 100 + elementsToAdd[i];
//         const targetWeight = (newTotalWeight * finalComp[i]) / 100;
//         const addition = targetWeight - currentWeight;
//         if (addition > 0.01) {
//           elementsToAdd[i] += addition;
//           totalAddedWeight += addition;
//           newTotalWeight += addition;
//           adjustmentNeeded = true;
//         }
//       }
//     }

//     return elementsToAdd.map(addition => addition.toFixed(2));
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const initialCompArray = initialComposition.split(' ').map(Number);
//     const finalCompArray = finalComposition.split(' ').map(Number);
//     const additions = calculateElementAdditions(parseFloat(initialWeight), initialCompArray, finalCompArray);
//     setElementsToAdd(additions);
//   };

//   return (
//     <div>
//       <h1>Composition Adjustment Calculator</h1>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>
//             Initial Weight in grams:
//             <input
//               type="number"
//               value={initialWeight}
//               onChange={(e) => setInitialWeight(e.target.value)}
//               required
//             />
//           </label>
//         </div>
//         <div>
//           <label>
//             Initial Composition (%):
//             <input
//               type="text"
//               value={initialComposition}
//               onChange={(e) => setInitialComposition(e.target.value)}
//               required
//               placeholder="20 10 15 ..."
//             />
//           </label>
//         </div>
//         <div>
//           <label>
//             Final Composition (%):
//             <input
//               type="text"
//               value={finalComposition}
//               onChange={(e) => setFinalComposition(e.target.value)}
//               required
//               placeholder="15 15 10 ..."
//             />
//           </label>
//         </div>
//         <button type="submit">Calculate</button>
//       </form>

//       {elementsToAdd.length > 0 && (
//         <div>
//           <h2>Amount to add for each element (in grams):</h2>
//           <ul>
//             {elementsToAdd.map((amount, index) => (
//               <li key={index}>
//                 Element {index + 1}: {amount} grams
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;





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
  <h1>Composition Adjustment Calculator</h1>
  {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
  <form onSubmit={handleSubmit}>
    <table>
      <thead>
        <tr>
          <th>Element</th>
          <th>Initial (%)</th>
          <th>Final (%)</th>
        </tr>
      </thead>
      <tbody>
        {elements.map((element, index) => (
          <tr key={element}>
            <td>{element}</td>
            <td>
              <input
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
      <label>
        Initial Weight in grams:
        <input
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

    <button type="submit">Calculate</button>
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
  <div className='results'>
  {elementsToAdd.length > 0 && (
  <div>
    <h2>Amount to add for each element (in grams):</h2>
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


