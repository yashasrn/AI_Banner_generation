import React from 'react';

const ThemeSelector = ({ setUserInputs }) => {
  const handleThemeChange = (event) => {
    setUserInputs(prevInputs => ({
      ...prevInputs,
      theme: event.target.value
    }));
  };

  return (
    <div>
      <label>Select Theme:</label>
      <select onChange={handleThemeChange}>
        <option value="">Select a theme</option>
        <option value="Summer Sale">Summer Sale</option>
        <option value="Winter Wonderland">Winter Wonderland</option>
        {/* Add more options as needed */}
      </select>
    </div>
  );
};

export default ThemeSelector;
