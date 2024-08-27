use crate::modules::file_utils::{FileUtils, Recipe};
use actix_multipart::Multipart;
use actix_web::{Error, HttpResponse};
use futures::StreamExt;
use serde_json::{json, Map, Value};
use std::fs::File;
use std::io::Write;
use uuid::Uuid;

struct RecipeDataUser {
    recipe_id: String,
    instructions: String,
    ingredients: Vec<String>,
    measure_value: Vec<String>,
    measure_unit: Vec<String>,
    recipe_name: String,
    category: String,
    tags: String,
    area: String,
    mealthumb: Option<String>,
    youtube: String,
    source: String,
}

pub async fn add_recipe_user(mut payload: Multipart) -> Result<HttpResponse, Error> {
    let mut recipe_data = RecipeDataUser {
        recipe_id: format!("U_{}", Uuid::new_v4().to_string()),
        recipe_name: String::new(),
        ingredients: Vec::new(),
        measure_value: Vec::new(),
        measure_unit: Vec::new(),
        category: String::new(),
        tags: String::new(),
        area: String::new(),
        mealthumb: Some(String::new()),
        youtube: String::new(),
        source: String::new(),
        instructions: String::new(),
    };

    while let Some(item) = payload.next().await {
        let mut field = item?;

        // Collect the bytes from the field
        let mut bytes = Vec::new();
        while let Some(chunk) = field.next().await {
            let data = chunk?;
            bytes.extend_from_slice(&data);
        }

        // Process the collected bytes as needed
        // The payload is unwrapped to retrive different data sent from the client
        match field.content_disposition().unwrap().get_name().unwrap() {
            "file" => {
                let content_str = String::from_utf8(bytes.clone()).unwrap();
                if bytes.is_empty() {
                    recipe_data.mealthumb = Some(String::new());
                } else if content_str.starts_with("https://") || content_str.starts_with("http://")
                {
                    recipe_data.mealthumb = Some(content_str.clone());
                } else {
                    if FileUtils::folder_exists("recipes/images", true) {
                        let filename = format!("recipes/images/{}.jpg", recipe_data.recipe_id);
                        let mut file = File::create(filename)?;
                        file.write_all(&bytes).expect("Failed to write file");
                        recipe_data.mealthumb = Some(format!(
                            "http://localhost:5000/recipes/images/{}.jpg",
                            recipe_data.recipe_id
                        ));
                    }
                }
            }
            "recipename" => {
                recipe_data.recipe_name = String::from_utf8(bytes.clone()).unwrap();
            }
            "recipeingredients" => {
                let ingredients_str = String::from_utf8(bytes.clone()).unwrap();
                recipe_data.ingredients = serde_json::from_str(&ingredients_str).unwrap();
            }
            "recipemeasureunit" => {
                let measureunit_str = String::from_utf8(bytes.clone()).unwrap();
                recipe_data.measure_unit = serde_json::from_str(&measureunit_str).unwrap();
            }
            "recipemeasurevalue" => {
                let measurevalue_str = String::from_utf8(bytes.clone()).unwrap();
                recipe_data.measure_value = serde_json::from_str(&measurevalue_str).unwrap();
            }
            "recipeinstructions" => {
                recipe_data.instructions = String::from_utf8(bytes.clone()).unwrap()
            }
            "recipeyoutube" => {
                recipe_data.youtube = String::from_utf8(bytes.clone()).unwrap();
            }
            "recipecategory" => {
                recipe_data.category = String::from_utf8(bytes.clone()).unwrap();
            }
            "recipetags" => {
                recipe_data.tags = String::from_utf8(bytes.clone()).unwrap();
            }
            "recipearea" => {
                recipe_data.area = String::from_utf8(bytes.clone()).unwrap();
            }
            "recipesource" => {
                recipe_data.source = String::from_utf8(bytes.clone()).unwrap();
            }
            _ => {
                // Handle any other cases here
            }
        }
    }

    // Construct the JSON object in the desired order
    let mut recipe_json = Map::new();
    recipe_json.insert("recipe_name".to_string(), json!(recipe_data.recipe_name));

    println!("{:?}", recipe_data.ingredients);
    for i in 0..20 {
        let ingredient = recipe_data
            .ingredients
            .get(i)
            .map(|s| json!(s))
            .unwrap_or(Value::Null);
        recipe_json.insert(format!("strIngredient{}", i + 1), ingredient);
    }

    for i in 0..20 {
        let measure = if let (Some(value), Some(unit)) = (
            recipe_data.measure_value.get(i),
            recipe_data.measure_unit.get(i),
        ) {
            json!(format!("{}{}", value, unit).trim())
        } else {
            Value::Null
        };
        recipe_json.insert(format!("strMeasure{}", i + 1), measure);
    }
    recipe_json.insert("strMeal".to_string(), json!(recipe_data.recipe_name));
    recipe_json.insert("idMeal".to_string(), json!(recipe_data.recipe_id));
    recipe_json.insert("strCategory".to_string(), json!(recipe_data.category));
    recipe_json.insert("strTags".to_string(), json!(recipe_data.tags));
    recipe_json.insert("strArea".to_string(), json!(recipe_data.area));
    recipe_json.insert("strMealThumb".to_string(), json!(recipe_data.mealthumb));
    recipe_json.insert("strYoutube".to_string(), json!(recipe_data.youtube));
    recipe_json.insert("strSource".to_string(), json!(recipe_data.source));
    recipe_json.insert(
        "strInstructions".to_string(),
        json!(recipe_data.instructions),
    );

    // Convert the Map to a Value to preserve the order
    let mut existing_recipes = FileUtils::read_file("recipes/recipes.json").unwrap();

    // Convert the new recipe JSON to a Recipe object
    let new_recipe: Recipe =
        serde_json::from_value(Value::Object(recipe_json)).expect("Failed to convert to Recipe");

    // Append the new recipe to the list of existing recipes
    existing_recipes.push(new_recipe);

    // Write the updated list back to the file
    FileUtils::write_file("recipes/recipes.json", existing_recipes).unwrap();

    Ok(HttpResponse::Ok().body("Recipe added successfully"))
}
