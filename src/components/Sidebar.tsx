import { useState } from 'react';
import { ApiRequest, HttpMethod, RequestCollection, SavedRequest } from '../types/types';

interface SidebarProps {
  onSelectRequest: (request: ApiRequest) => void;
}

// Example collections for demonstration purposes
const EXAMPLE_COLLECTIONS: RequestCollection[] = [
  {
    id: 'collection1',
    name: 'Example APIs',
    requests: [
      {
        id: 'req1',
        name: 'Get Users',
        request: {
          url: 'https://jsonplaceholder.typicode.com/users',
          method: HttpMethod.GET,
          headers: {},
          params: {},
        },
      },
      {
        id: 'req2',
        name: 'Get Posts',
        request: {
          url: 'https://jsonplaceholder.typicode.com/posts',
          method: HttpMethod.GET,
          headers: {},
          params: {},
        },
      },
      {
        id: 'req3',
        name: 'Create Post',
        request: {
          url: 'https://jsonplaceholder.typicode.com/posts',
          method: HttpMethod.POST,
          headers: {
            'Content-Type': 'application/json',
          },
          params: {},
          body: {
            title: 'foo',
            body: 'bar',
            userId: 1,
          },
        },
      },
    ],
  },
];

export default function Sidebar({ onSelectRequest }: SidebarProps) {
  // const [collections, setCollections] = useState<RequestCollection[]>(EXAMPLE_COLLECTIONS);
  const collections = EXAMPLE_COLLECTIONS;
  const [expandedCollections, setExpandedCollections] = useState<Record<string, boolean>>({
    'collection1': true
  });

  const toggleCollection = (collectionId: string) => {
    setExpandedCollections(prev => ({
      ...prev,
      [collectionId]: !prev[collectionId]
    }));
  };

  const selectRequest = (request: SavedRequest) => {
    onSelectRequest(request.request);
  };

  // Future implementation will include adding/editing/deleting collections and requests

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>RustAPI</h2>
        <button className="new-collection-btn">+ New Collection</button>
      </div>
      
      <div className="collections">
        {collections.map(collection => (
          <div key={collection.id} className="collection">
            <div 
              className="collection-header"
              onClick={() => toggleCollection(collection.id)}
            >
              <span className="expand-icon">
                {expandedCollections[collection.id] ? '▼' : '►'}
              </span>
              <span className="collection-name">{collection.name}</span>
            </div>
            
            {expandedCollections[collection.id] && (
              <div className="requests">
                {collection.requests.map(request => (
                  <div 
                    key={request.id} 
                    className="request-item"
                    onClick={() => selectRequest(request)}
                  >
                    <span className={`method-badge ${request.request.method.toLowerCase()}`}>
                      {request.request.method}
                    </span>
                    <span className="request-name">{request.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}