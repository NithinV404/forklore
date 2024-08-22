use crate::modules::file_utils;
use actix_web::{web, HttpResponse, Responder};
use serde_json::json;

pub async fn delete_recipes(path: web::Path<String>) -> impl Responder {
    let id = path.into_inner();
    let mut recipes = file_utils::FileUtils::read_file("recipes/recipes.json").unwrap();
    println!("recipes: {:?}", recipes);

    // Retain only the recipes that do not match the given id
    let original_len = recipes.len();
    recipes.retain(|recipe| recipe.idMeal != id);

    if recipes.len() == original_len {
        return HttpResponse::NotFound().json(json!({"message": "Recipe not found"}));
    }

    // Write the updated array back to the file
    file_utils::FileUtils::write_file("recipes/recipes.json", recipes).unwrap();
    HttpResponse::Ok().json(json!({"message": "Recipe deleted successfully"}))
}
