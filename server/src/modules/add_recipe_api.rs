use crate::modules::file_utils::FileUtils;
use actix_web::{web, HttpResponse};
use futures::StreamExt;
use serde_json::Value;

use super::file_utils::Recipe;

const SEARCH_API_URL: &str = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

pub async fn add_recipe_api(mut payload: web::Payload) -> HttpResponse {
    let mut return_data: Value = Value::Null;
    while let Some(item) = payload.next().await {
        return_data = serde_json::from_slice(&item.unwrap()).unwrap();
    }
    //Check if recipe already exists
    let recipe_id = return_data["recipeId"].as_str().unwrap_or("Unknown");
    let mut recipe_json = FileUtils::read_file("recipes/recipes.json").unwrap();
    if recipe_json.iter().any(|r| r.idMeal == recipe_id) {
        return HttpResponse::Ok().body("Recipe already exists");
    }
    let recipe_data = reqwest::get(&format!("{}{}", SEARCH_API_URL, recipe_id))
        .await
        .unwrap()
        .text()
        .await
        .unwrap();

    let recipe_value: Value = serde_json::from_str(&recipe_data).unwrap();
    let new_recipe: Recipe = serde_json::from_value(recipe_value["meals"][0].clone()).unwrap();

    recipe_json.push(new_recipe);
    FileUtils::write_file("recipes/recipes.json", recipe_json).unwrap();
    HttpResponse::Ok().body("Recipe added Successfully")
}
