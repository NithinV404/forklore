use serde_json::{Error, Value};
use std::fs::OpenOptions;
use std::io::Read;
use std::path::Path;

// #[derive(Deserialize, Debug)]
// #[allow(non_snake_case)]
// struct Meal {
//     idMeal: String,
//     strMeal: String,
//     strDrinkAlternate: Option<String>,
//     strCategory: String,
//     strArea: Option<String>,
//     strInstructions: Option<String>,
//     strMealThumb: Option<String>,
//     strTags: Option<String>,
//     strYoutube: Option<String>,
//     strIngredient1: Option<String>,
//     strIngredient2: Option<String>,
//     strIngredient3: Option<String>,
//     strIngredient4: Option<String>,
//     strIngredient5: Option<String>,
//     strIngredient6: Option<String>,
//     strIngredient7: Option<String>,
//     strIngredient8: Option<String>,
//     strIngredient9: Option<String>,
//     strIngredient10: Option<String>,
//     strIngredient11: Option<String>,
//     strIngredient12: Option<String>,
//     strIngredient13: Option<String>,
//     strIngredient14: Option<String>,
//     strIngredient15: Option<String>,
//     strIngredient16: Option<String>,
//     strIngredient17: Option<String>,
//     strIngredient18: Option<String>,
//     strIngredient19: Option<String>,
//     strIngredient20: Option<String>,
//     strMeasure1: Option<String>,
//     strMeasure2: Option<String>,
//     strMeasure3: Option<String>,
//     strMeasure4: Option<String>,
//     strMeasure5: Option<String>,
//     strMeasure6: Option<String>,
//     strMeasure7: Option<String>,
//     strMeasure8: Option<String>,
//     strMeasure9: Option<String>,
//     strMeasure10: Option<String>,
//     strMeasure11: Option<String>,
//     strMeasure12: Option<String>,
//     strMeasure13: Option<String>,
//     strMeasure14: Option<String>,
//     strMeasure15: Option<String>,
//     strMeasure16: Option<String>,
//     strMeasure17: Option<String>,
//     strMeasure18: Option<String>,
//     strMeasure19: Option<String>,
//     strMeasure20: Option<String>,
//     strSource: Option<String>,
//     strImageSource: Option<String>,
//     strCreativeCommonsConfirmed: Option<String>,
//     dateModified: Option<String>,
// }

#[allow(dead_code)]
pub struct FileUtils;

#[allow(dead_code)]
impl FileUtils {
    // Checks if the folder exists, if not it creates it
    pub fn folder_exists(path: &str, create: bool) -> bool {
        if !Path::new(path).exists() {
            if create {
                std::fs::create_dir(path).expect("Failed to create directory");
                println!("Folder created");
            }
            return false;
        }
        return true;
    }

    // Checks if the file exists, if not it creates it with folder as specified in the path
    pub fn file_exists(path: &str, create: bool) -> bool {
        if OpenOptions::new().read(true).open(path).is_ok() {
            return true;
        } else {
            if create {
                Self::folder_exists(path, true);
                OpenOptions::new()
                    .read(true)
                    .write(true)
                    .create(true)
                    .open(path)
                    .expect("Failed to open or create file");
                println!("File created");
            }
            return false;
        }
    }

    pub fn read_file(path: &str) -> Result<Value, Error> {
        let mut file = OpenOptions::new()
            .read(true)
            .open(path)
            .expect("Failed to open file");

        let mut contents = String::new();
        file.read_to_string(&mut contents)
            .expect("Failed to read file");

        let json: Value = serde_json::from_str(&contents)?;
        Ok(json)
    }

    // pub fn write_file(path: &str, content: &str) {}
}
