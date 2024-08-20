use crate::modules::file_utils;
use actix_web::{web, HttpResponse, Responder};
use serde_json::json;

pub async fn delete_recipe(path: web::Path<String>) -> impl Responder {
    let id = path.into_inner();
    let mut recipes = file_utils::FileUtils::read_file("recipes/recipes.json").unwrap();
    if let Some(array) = recipes.as_array_mut() {
        for (index, recipe) in array.iter().enumerate() {
            if recipe["idMeal"] == id {
                // Remove the recipe from the array
                array.remove(index);
                // Write the updated array back to the file
                file_utils::FileUtils::write_file("recipes/recipes.json", &recipes);
                return HttpResponse::Ok().json(json!({"message": "Recipe deleted successfully"}));
            }
        }
    }
    HttpResponse::NotFound().json(json!({"message": "Recipe not found"}))
}
