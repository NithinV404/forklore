use crate::modules::file_utils;
use actix_web::HttpResponse;

const RECIPE_FILE_PATH: &str = "./recipes/recipes.json";

pub async fn saved_recipes() -> Result<HttpResponse, Box<dyn std::error::Error>> {
    let recipes = file_utils::FileUtils::read_file(RECIPE_FILE_PATH)?;
    Ok(HttpResponse::Ok().json(recipes))
}
