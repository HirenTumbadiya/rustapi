import { useState } from 'react';
import { ApiRequest, HttpMethod } from '../types/types';

interface RequestPanelProps {
  request: ApiRequest;
  onRequestChange: (request: ApiRequest) => void;
  onSendRequest: (request: ApiRequest) => void;
  isLoading: boolean;
}

export default function RequestPanel({ 
  request, 
  onRequestChange, 
  onSendRequest,
  isLoading
}: RequestPanelProps) {
  const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'body'>('params');

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onRequestChange({
      ...request,
      method: e.target.value as HttpMethod
    });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onRequestChange({
      ...request,
      url: e.target.value
    });
  };

  const handleSendRequest = () => {
    onSendRequest(request);
  };

  const handleAddParam = () => {
    onRequestChange({
      ...request,
      params: {
        ...request.params,
        '': ''
      }
    });
  };

  const handleParamChange = (key: string, newKey: string, value: string) => {
    const newParams = { ...request.params };
    if (key !== newKey) {
      delete newParams[key];
    }
    newParams[newKey] = value;
    
    onRequestChange({
      ...request,
      params: newParams
    });
  };

  const handleRemoveParam = (key: string) => {
    const newParams = { ...request.params };
    delete newParams[key];
    
    onRequestChange({
      ...request,
      params: newParams
    });
  };

  const handleAddHeader = () => {
    onRequestChange({
      ...request,
      headers: {
        ...request.headers,
        '': ''
      }
    });
  };

  const handleHeaderChange = (key: string, newKey: string, value: string) => {
    const newHeaders = { ...request.headers };
    if (key !== newKey) {
      delete newHeaders[key];
    }
    newHeaders[newKey] = value;
    
    onRequestChange({
      ...request,
      headers: newHeaders
    });
  };

  const handleRemoveHeader = (key: string) => {
    const newHeaders = { ...request.headers };
    delete newHeaders[key];
    
    onRequestChange({
      ...request,
      headers: newHeaders
    });
  };

  const handleBodyChange = (body: string) => {
    try {
      const parsedBody = body.trim() ? JSON.parse(body) : undefined;
      onRequestChange({
        ...request,
        body: parsedBody
      });
    } catch (e) {
      // Keep the raw string if it's not valid JSON
      onRequestChange({
        ...request,
        body: body
      });
    }
  };

  return (
    <div className="request-panel">
      <div className="request-url-bar">
        <select 
          className="method-select"
          value={request.method}
          onChange={handleMethodChange}
        >
          {Object.values(HttpMethod).map(method => (
            <option key={method} value={method}>{method}</option>
          ))}
        </select>
        
        <input
          type="text"
          className="url-input"
          placeholder="Enter request URL"
          value={request.url}
          onChange={handleUrlChange}
        />
        
        <button 
          className="send-button"
          onClick={handleSendRequest}
          disabled={isLoading || !request.url}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
      
      <div className="request-tabs">
        <div className="tab-headers">
          <button 
            className={`tab-button ${activeTab === 'params' ? 'active' : ''}`}
            onClick={() => setActiveTab('params')}
          >
            Params
          </button>
          <button 
            className={`tab-button ${activeTab === 'headers' ? 'active' : ''}`}
            onClick={() => setActiveTab('headers')}
          >
            Headers
          </button>
          <button 
            className={`tab-button ${activeTab === 'body' ? 'active' : ''}`}
            onClick={() => setActiveTab('body')}
          >
            Body
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'params' && (
            <div className="params-tab">
              <table className="params-table">
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>Value</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(request.params).map(([key, value]) => (
                    <tr key={key}>
                      <td>
                        <input 
                          type="text" 
                          value={key} 
                          onChange={(e) => handleParamChange(key, e.target.value, value)}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          value={value} 
                          onChange={(e) => handleParamChange(key, key, e.target.value)}
                        />
                      </td>
                      <td>
                        <button onClick={() => handleRemoveParam(key)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="add-param-button" onClick={handleAddParam}>
                Add Parameter
              </button>
            </div>
          )}
          
          {activeTab === 'headers' && (
            <div className="headers-tab">
              <table className="headers-table">
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>Value</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(request.headers).map(([key, value]) => (
                    <tr key={key}>
                      <td>
                        <input 
                          type="text" 
                          value={key} 
                          onChange={(e) => handleHeaderChange(key, e.target.value, value)}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          value={value} 
                          onChange={(e) => handleHeaderChange(key, key, e.target.value)}
                        />
                      </td>
                      <td>
                        <button onClick={() => handleRemoveHeader(key)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="add-header-button" onClick={handleAddHeader}>
                Add Header
              </button>
            </div>
          )}
          
          {activeTab === 'body' && (
            <div className="body-tab">
              <textarea
                className="body-editor"
                placeholder="Enter request body (JSON)"
                value={request.body ? 
                  (typeof request.body === 'string' ? 
                    request.body : 
                    JSON.stringify(request.body, null, 2)
                  ) : 
                  ''
                }
                onChange={(e) => handleBodyChange(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}