#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod api_client;

use api_client::{make_request, ApiRequest, ApiResponse, HttpMethod};
use std::collections::HashMap;
use std::sync::Mutex;
use tauri::State;

// Define a state to store environment variables
struct AppState {
    environment_variables: Mutex<HashMap<String, String>>,
}

// Commands that will be called from the frontend
#[tauri::command]
async fn send_request(
    request: ApiRequest,
    state: State<'_, AppState>,
) -> Result<ApiResponse, String> {
    //     // Apply environment variables to the request
    //     let env_vars = state.environment_variables.lock().unwrap();

    //     let env_vars = {
    //     let guard = state.environment_variables.lock().unwrap();
    //     guard.clone() // Clone or extract the needed values
    // };

    let env_vars = {
        let guard = state.environment_variables.lock().unwrap();
        guard.clone() // Clone the HashMap to avoid holding the MutexGuard
    };
    
    let request_with_env = replace_env_vars(request, &env_vars);

    make_request(request_with_env)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn set_env_var(key: String, value: String, state: State<'_, AppState>) {
    let mut env_vars = state.environment_variables.lock().unwrap();
    env_vars.insert(key, value);
}

#[tauri::command]
fn get_env_var(key: String, state: State<'_, AppState>) -> Option<String> {
    let env_vars = state.environment_variables.lock().unwrap();
    env_vars.get(&key).cloned()
}

#[tauri::command]
fn get_all_env_vars(state: State<'_, AppState>) -> HashMap<String, String> {
    let env_vars = state.environment_variables.lock().unwrap();
    env_vars.clone()
}

// Helper function to replace environment variables in the request
fn replace_env_vars(request: ApiRequest, env_vars: &HashMap<String, String>) -> ApiRequest {
    let mut new_request = request.clone();

    // Replace in URL
    for (key, value) in env_vars {
        let placeholder = format!("{{{{{}}}}}", key);
        new_request.url = new_request.url.replace(&placeholder, value);
    }

    // Replace in headers
    for (_, value) in new_request.headers.iter_mut() {
        for (key, env_value) in env_vars {
            let placeholder = format!("{{{{{}}}}}", key);
            *value = value.replace(&placeholder, env_value);
        }
    }

    // Replace in body if it's a string
    if let Some(serde_json::Value::String(s)) = new_request.body.as_ref() {
        let mut new_body = s.clone();
        for (key, value) in env_vars {
            let placeholder = format!("{{{{{}}}}}", key);
            new_body = new_body.replace(&placeholder, value);
        }
        new_request.body = Some(serde_json::Value::String(new_body));
    }

    new_request
}

fn main() {
    tauri::Builder::default()
        .manage(AppState {
            environment_variables: Mutex::new(HashMap::new()),
        })
        .invoke_handler(tauri::generate_handler![
            send_request,
            set_env_var,
            get_env_var,
            get_all_env_vars,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
