import { useState } from "react";
import "./App.css";
import RequestPanel from "./components/RequestPanel";
import ResponsePanel from "./components/ResponsePanel";
import Sidebar from "./components/Sidebar";
import { ApiRequest, ApiResponse, HttpMethod } from "./types/types";
import { invoke } from "@tauri-apps/api/core";
import { CustomTitlebar } from "./components/TitleBar";

function App() {
  const [activeRequest, setActiveRequest] = useState<ApiRequest>({
    url: "",
    method: HttpMethod.GET,
    headers: {},
    params: {},
    body: undefined,
    timeout_ms: 30000,
  });

  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="main-desktop">
      <CustomTitlebar />
      <main className="app-container">
        <Sidebar onSelectRequest={(request) => setActiveRequest(request)} />
        <div className="main-content">
          <RequestPanel
            request={activeRequest}
            onRequestChange={setActiveRequest}
            onSendRequest={async (req) => {
              setIsLoading(true);
              try {
                // This will be implemented to call the Tauri backend
                // const response = await window.__TAURI__.invoke('send_request', { request: req });
                const response = await invoke("send_request", { request: req });
                setResponse(response as ApiResponse);
              } catch (error) {
                console.error("Error sending request:", error);
                setResponse({
                  status: 0,
                  headers: {},
                  body: { error: String(error) },
                  duration_ms: 0,
                  size_bytes: 0,
                });
              } finally {
                setIsLoading(false);
              }
            }}
            isLoading={isLoading}
          />
          <ResponsePanel response={response} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}

export default App;
