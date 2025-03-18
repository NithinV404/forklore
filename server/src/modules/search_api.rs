use actix_web::{web, HttpResponse};
use futures::StreamExt;
use reqwest;
use serde_json::Value;

const SEARCH_API_URL: &str = "https://www.themealdb.com/api/json/v1/1/";

pub async fn search_api(mut payload: web::Payload) -> HttpResponse {
    let mut data: Value = Value::Null;
    while let Some(item) = payload.next().await {
        let bytes = match item {
            Ok(bytes) => bytes,
            Err(_) => return HttpResponse::BadRequest().finish(),
        };
        data = serde_json::from_slice(&bytes).unwrap();
    }

    let search_value = data["search_value"].as_str().unwrap();
    let search_type = data["search_type"].as_str().unwrap();

    let api_url = match search_type {
        "name" => {
            format!("{}{}", SEARCH_API_URL, "search.php?s=")
        }
        "category" => {
            format!("{}{}", SEARCH_API_URL, "filter.php?c=")
        }
        "area" => {
            format!("{}{}", SEARCH_API_URL, "filter.php?a=")
        }
        "ingredient" => {
            format!("{}{}", SEARCH_API_URL, "filter.php?i=")
        }
        "id" => {
            format!("{}{}", SEARCH_API_URL, "lookup.php?i=")
        }
        _ => return HttpResponse::BadRequest().finish(),
    };

    match reqwest::get(format!("{}{}", &api_url, search_value)).await {
        Ok(response) => match response.json::<Value>().await {
            Ok(json) => HttpResponse::Ok().json(json),
            Err(_) => HttpResponse::InternalServerError().finish(),
        },
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}
