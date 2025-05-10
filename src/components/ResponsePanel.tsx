import { useState } from 'react';
import { ApiResponse } from '../types/types';

interface ResponsePanelProps {
  response: ApiResponse | null;
  isLoading: boolean;
}

export default function ResponsePanel({ response, isLoading }: ResponsePanelProps) {
  const [activeTab, setActiveTab] = useState<'body' | 'headers'>('body');

  if (isLoading) {
    return (
      <div className="response-panel loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="response-panel empty">
        <div className="no-response">
          <p>Send a request to see the response</p>
        </div>
      </div>
    );
  }

  const getStatusClass = () => {
    if (response.status >= 200 && response.status < 300) return 'success';
    if (response.status >= 400) return 'error';
    return 'neutral';
  };

  const formatBody = () => {
    if (!response.body) return 'No body returned';
    
    try {
      if (typeof response.body === 'string') {
        // Try to parse as JSON for pretty printing
        const parsedJson = JSON.parse(response.body);
        return JSON.stringify(parsedJson, null, 2);
      } else {
        return JSON.stringify(response.body, null, 2);
      }
    } catch (e) {
      // If it's not JSON, return as is
      return response.body.toString();
    }
  };

  return (
    <div className="response-panel">
      <div className="response-header">
        <div className={`status-badge ${getStatusClass()}`}>
          {response.status}
        </div>
        <div className="response-meta">
          <span>{response.duration_ms} ms</span>
          <span>{(response.size_bytes / 1024).toFixed(2)} KB</span>
        </div>
      </div>
      
      <div className="response-tabs">
        <div className="tab-headers">
          <button 
            className={`tab-button ${activeTab === 'body' ? 'active' : ''}`}
            onClick={() => setActiveTab('body')}
          >
            Body
          </button>
          <button 
            className={`tab-button ${activeTab === 'headers' ? 'active' : ''}`}
            onClick={() => setActiveTab('headers')}
          >
            Headers
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'body' && (
            <div className="body-tab">
              <pre className="response-body">{formatBody()}</pre>
            </div>
          )}
          
          {activeTab === 'headers' && (
            <div className="headers-tab">
              <table className="headers-table">
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(response.headers).map(([key, value]) => (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}