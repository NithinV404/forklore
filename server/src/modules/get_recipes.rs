use actix_web::HttpResponse;
use serde_json::Value;
const API_URL: &str = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

pub async fn get_recipes() -> HttpResponse {
    match reqwest::get(API_URL).await {
        Ok(response) => match response.json::<Value>().await {
            Ok(json) => HttpResponse::Ok().json(json),
            Err(_) => HttpResponse::InternalServerError().finish(),
        },
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}
