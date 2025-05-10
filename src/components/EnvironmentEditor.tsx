import { useState, useEffect } from 'react';
import { Environment } from '../types/types';
import { v4 as uuidv4 } from 'uuid';

interface EnvironmentEditorProps {
  environment?: Environment;
  onSave: (env: Environment) => void;
  onCancel: () => void;
}

export default function EnvironmentEditor({ 
  environment, 
  onSave, 
  onCancel 
}: EnvironmentEditorProps) {
  const [name, setName] = useState('');
  const [variables, setVariables] = useState<Record<string, string>>({});

  useEffect(() => {
    if (environment) {
      setName(environment.name);
      setVariables(environment.variables);
    } else {
      setName('');
      setVariables({});
    }
  }, [environment]);

  const handleSave = () => {
    const envToSave: Environment = {
      id: environment?.id || uuidv4(),
      name,
      variables,
    };
    onSave(envToSave);
  };

  const handleAddVariable = () => {
    setVariables({
      ...variables,
      '': '',
    });
  };

  const handleVariableChange = (key: string, newKey: string, value: string) => {
    const newVars = { ...variables };
    if (key !== newKey) {
      delete newVars[key];
    }
    newVars[newKey] = value;
    setVariables(newVars);
  };

  const handleRemoveVariable = (key: string) => {
    const newVars = { ...variables };
    delete newVars[key];
    setVariables(newVars);
  };

  return (
    <div className="environment-editor">
      <h2>{environment ? 'Edit Environment' : 'New Environment'}</h2>
      
      <div className="form-group">
        <label>Name:</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Environment Name"
        />
      </div>
      
      <div className="form-group">
        <h3>Variables</h3>
        <table className="variables-table">
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(variables).map(([key, value]) => (
              <tr key={key}>
                <td>
                  <input 
                    type="text" 
                    value={key} 
                    onChange={(e) => handleVariableChange(key, e.target.value, value)}
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    value={value} 
                    onChange={(e) => handleVariableChange(key, key, e.target.value)}
                  />
                </td>
                <td>
                  <button onClick={() => handleRemoveVariable(key)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="add-variable-button" onClick={handleAddVariable}>
          Add Variable
        </button>
      </div>
      
      <div className="form-actions">
        <button onClick={onCancel}>Cancel</button>
        <button 
          className="save-button" 
          onClick={handleSave}
          disabled={!name.trim()}
        >
          Save
        </button>
      </div>
    </div>
  );
}