use actix_web::{web, HttpResponse};
use futures::StreamExt;
use reqwest;
use serde_json::Value;

const SEARCH_API_URL: &str = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

pub async fn search_api(mut payload: web::Payload) -> HttpResponse {
    let mut data: Value = Value::Null;
    while let Some(item) = payload.next().await {
        let bytes = item.unwrap();
        data = serde_json::from_slice(&bytes).unwrap();
    }
    let recipe_name = data["recipeName"].as_str().unwrap_or("Unknown");
    let return_data = reqwest::get(&format!("{}{}", SEARCH_API_URL, recipe_name))
        .await
        .unwrap()
        .text()
        .await
        .unwrap();
    HttpResponse::Ok().json(return_data)
}
