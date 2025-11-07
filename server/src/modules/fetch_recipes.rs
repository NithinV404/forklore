use crate::modules::file_utils;
use actix_web::{HttpResponse, Responder};
const PATH: &str = "recipes/recipes.json";

pub async fn get_recipes() -> impl Responder {
    match file_utils::FileUtils::read_file(PATH) {
        Ok(data) => HttpResponse::Ok().json(&data),
        Err(_) => HttpResponse::NotFound().finish(),
    }
}
