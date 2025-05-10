use anyhow::Result;
use reqwest::{Client, Method, header::{HeaderMap, HeaderName, HeaderValue}};
use serde::{Serialize, Deserialize};
use std::collections::HashMap;
use std::str::FromStr;
use std::time::Instant;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum HttpMethod {
    GET,
    POST,
    PUT,
    DELETE,
    PATCH,
    HEAD,
    OPTIONS,
}

impl HttpMethod {
    fn to_reqwest_method(&self) -> Method {
        match self {
            HttpMethod::GET => Method::GET,
            HttpMethod::POST => Method::POST,
            HttpMethod::PUT => Method::PUT,
            HttpMethod::DELETE => Method::DELETE,
            HttpMethod::PATCH => Method::PATCH,
            HttpMethod::HEAD => Method::HEAD,
            HttpMethod::OPTIONS => Method::OPTIONS,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ApiRequest {
    pub url: String,
    pub method: HttpMethod,
    pub headers: HashMap<String, String>,
    pub params: HashMap<String, String>,
    pub body: Option<serde_json::Value>,
    pub timeout_ms: Option<u64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiResponse {
    pub status: u16,
    pub headers: HashMap<String, String>,
    pub body: Option<serde_json::Value>,
    pub duration_ms: u64,
    pub size_bytes: usize,
}

pub async fn make_request(request: ApiRequest) -> Result<ApiResponse> {
    let start_time = Instant::now();
    let client = Client::new();

    // Parse URL and add query parameters
    let mut url = url::Url::parse(&request.url)?;
    
    // Add query parameters
    for (key, value) in &request.params {
        url.query_pairs_mut().append_pair(key, value);
    }

    // Convert headers
    let mut headers = HeaderMap::new();
    for (key, value) in &request.headers {
        headers.insert(
            HeaderName::from_str(key)?,
            HeaderValue::from_str(value)?
        );
    }

    // Create the request
    let method = request.method.to_reqwest_method();
    let mut req_builder = client.request(method, url).headers(headers);

    // Add body if present
    if let Some(body) = request.body {
        req_builder = req_builder.json(&body);
    }

    // Add timeout if specified
    if let Some(timeout) = request.timeout_ms {
        req_builder = req_builder.timeout(std::time::Duration::from_millis(timeout));
    }

    // Send the request
    let response = req_builder.send().await?;
    
    // Process response
    let status = response.status().as_u16();
    
    // Convert response headers
    let mut response_headers = HashMap::new();
    for (key, value) in response.headers() {
        if let Ok(v) = value.to_str() {
            response_headers.insert(key.as_str().to_string(), v.to_string());
        }
    }
    
    // Get response body
    let body_bytes = response.bytes().await?;
    let size_bytes = body_bytes.len();
    
    // Try to parse as JSON, fall back to string if not valid JSON
    let body = if !body_bytes.is_empty() {
        match serde_json::from_slice(&body_bytes) {
            Ok(json) => Some(json),
            Err(_) => {
                // If not valid JSON, convert to string
                match std::str::from_utf8(&body_bytes) {
                    Ok(s) => Some(serde_json::Value::String(s.to_string())),
                    Err(_) => None, // Not valid UTF-8
                }
            }
        }
    } else {
        None
    };
    
    let duration_ms = start_time.elapsed().as_millis() as u64;
    
    Ok(ApiResponse {
        status,
        headers: response_headers,
        body,
        duration_ms,
        size_bytes,
    })
}