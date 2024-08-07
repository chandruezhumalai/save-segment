import React, { useState } from 'react';
import './App.css';

function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [schemas, setSchemas] = useState([{ label: 'First Name', value: 'first_name', inputValue: '' }]);
  const [availableSchemas, setAvailableSchemas] = useState([
    { label: 'First Name', value: 'first_name' },
    { label: 'Last Name', value: 'last_name' },
    { label: 'Gender', value: 'gender' },
    { label: 'Age', value: 'age' },
    { label: 'Account Name', value: 'account_name' },
    { label: 'City', value: 'city' },
    { label: 'State', value: 'state' }
  ]);
  const [dropdownValue, setDropdownValue] = useState('');

  const handleAddSchema = () => {
    const unselectedSchemas = availableSchemas.filter(schema => 
      !schemas.some(selected => selected.value === schema.value)
    );
    if (unselectedSchemas.length > 0) {
      setSchemas([...schemas, { ...unselectedSchemas[0], inputValue: '' }]);
    }
  };

  const handleSchemaChange = (index, newValue) => {
    const newSchemas = schemas.map((schema, idx) => 
      idx === index ? { ...schema, value: newValue, label: availableSchemas.find(s => s.value === newValue).label } : schema
    );
    setSchemas(newSchemas);
  };

  const handleSchemaInputChange = (index, newValue) => {
    const newSchemas = schemas.map((schema, idx) => 
      idx === index ? { ...schema, inputValue: newValue } : schema
    );
    setSchemas(newSchemas);
  };

  const handleRemoveSchema = (index) => {
    setSchemas(schemas.filter((_, idx) => idx !== index));
  };

  const handleAddSchemaFromDropdown = () => {
    const selectedSchema = availableSchemas.find(s => s.value === dropdownValue);
    if (selectedSchema) {
      setSchemas([...schemas, { ...selectedSchema, inputValue: '' }]);
      setDropdownValue('');
    }
  };

  const handleSaveSegment = async () => {
    if (!segmentName || schemas.some(schema => !schema.inputValue)) {
      alert('Please fill in all fields before saving.');
      return;
    }

    const data = {
      segment_name: segmentName,
      schema: schemas.map(({ value, inputValue }) => ({ [value]: inputValue }))
    };

    console.log('Data to be sent:', data);

    try {
      const response = await fetch('https://webhook.site/YOUR_WEBHOOK_URL', { // Replace with your webhook URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      console.log('Data successfully sent to webhook.');
      setShowPopup(false); // Close the popup
      setSegmentName('');
      setSchemas([{ label: 'First Name', value: 'first_name', inputValue: '' }]);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  const handleCancel = () => {
    setShowPopup(false);
    setSegmentName('');
    setSchemas([{ label: 'First Name', value: 'first_name', inputValue: '' }]);
  };

  return (
    <div className="App">
      <button onClick={() => setShowPopup(true)} className="main-button">Save Segment</button>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            <h2>Saving Segment</h2>
            <p>Enter the Name of the Segment</p>
            <input 
              type="text" 
              placeholder="Name of the segment" 
              value={segmentName} 
              onChange={(e) => setSegmentName(e.target.value)}
              className="input-field"
            />
            <p>To save your segment, you need to add the schemas to build the query</p>
            <div className="schema-box">
              {schemas.map((schema, index) => (
                <div key={index} className="schema-row">
                  <select 
                    value={schema.value} 
                    onChange={(e) => handleSchemaChange(index, e.target.value)}
                    className="schema-select"
                  >
                    {availableSchemas.map((s, idx) => (
                      <option key={idx} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  <input 
                    type="text" 
                    value={schema.inputValue} 
                    onChange={(e) => handleSchemaInputChange(index, e.target.value)}
                    placeholder={`Enter ${schema.label}`}
                    className="input-field"
                  />
                  <button 
                    type="button" 
                    className="close-button" 
                    onClick={() => handleRemoveSchema(index)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <div className="button-group">
              <select 
                className="schema-dropdown"
                value={dropdownValue}
                onChange={(e) => setDropdownValue(e.target.value)}
              >
                <option value="">Add Schema to Segment</option>
                {availableSchemas.map((schema, idx) => (
                  <option key={idx} value={schema.value}>
                    {schema.label} (Value: {schema.value})
                  </option>
                ))}
              </select>
              <button onClick={handleAddSchemaFromDropdown} className="add-schema-button">Add Selected Schema</button>
            </div>
            <a href="#add-schema" onClick={handleAddSchema} className="add-new-schema-text">+ Add New Schema</a>
            <div className="footer-buttons">
              <button onClick={handleSaveSegment} className="save-button">Save the Segment</button>
              <button onClick={handleCancel} className="cancel-button">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
