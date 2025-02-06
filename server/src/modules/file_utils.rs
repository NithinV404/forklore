use serde::{Deserialize, Serialize};
use serde_json::Error;
use std::fs::{File, OpenOptions};
use std::io::{self, Read};
use std::path::Path;

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct Recipe {
    pub idMeal: String,
    pub strMeal: String,
    pub strDrinkAlternate: Option<String>,
    pub strCategory: String,
    pub strArea: String,
    pub strInstructions: String,
    pub strMealThumb: String,
    pub strTags: Option<String>,
    pub strYoutube: String,
    pub strIngredient1: Option<String>,
    pub strIngredient2: Option<String>,
    pub strIngredient3: Option<String>,
    pub strIngredient4: Option<String>,
    pub strIngredient5: Option<String>,
    pub strIngredient6: Option<String>,
    pub strIngredient7: Option<String>,
    pub strIngredient8: Option<String>,
    pub strIngredient9: Option<String>,
    pub strIngredient10: Option<String>,
    pub strIngredient11: Option<String>,
    pub strIngredient12: Option<String>,
    pub strIngredient13: Option<String>,
    pub strIngredient14: Option<String>,
    pub strIngredient15: Option<String>,
    pub strIngredient16: Option<String>,
    pub strIngredient17: Option<String>,
    pub strIngredient18: Option<String>,
    pub strIngredient19: Option<String>,
    pub strIngredient20: Option<String>,
    pub strMeasure1: Option<String>,
    pub strMeasure2: Option<String>,
    pub strMeasure3: Option<String>,
    pub strMeasure4: Option<String>,
    pub strMeasure5: Option<String>,
    pub strMeasure6: Option<String>,
    pub strMeasure7: Option<String>,
    pub strMeasure8: Option<String>,
    pub strMeasure9: Option<String>,
    pub strMeasure10: Option<String>,
    pub strMeasure11: Option<String>,
    pub strMeasure12: Option<String>,
    pub strMeasure13: Option<String>,
    pub strMeasure14: Option<String>,
    pub strMeasure15: Option<String>,
    pub strMeasure16: Option<String>,
    pub strMeasure17: Option<String>,
    pub strMeasure18: Option<String>,
    pub strMeasure19: Option<String>,
    pub strMeasure20: Option<String>,
    pub strSource: Option<String>,
    pub strImageSource: Option<String>,
    pub strCreativeCommonsConfirmed: Option<String>,
    pub dateModified: Option<String>,
}

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
                let dir_path = Path::new(path).parent().unwrap();
                Self::folder_exists(dir_path.to_str().unwrap(), true);
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

    pub fn read_file(path: &str) -> Result<Vec<Recipe>, Error> {
        Self::file_exists(path, true);
        let mut file = File::open(path).expect("Failed to open file");
        let mut contents = String::new();
        file.read_to_string(&mut contents)
            .expect("Failed to read file");

        if contents.trim().is_empty() {
            return Ok(vec![]);
        }

        let data: Vec<Recipe> = serde_json::from_str(&contents)?;
        Ok(data)
    }

    pub fn write_file(path: &str, content: Vec<Recipe>) -> Result<(), io::Error> {
        let file = OpenOptions::new()
            .write(true)
            .create(true)
            .truncate(true)
            .open(path)?;
        serde_json::to_writer(file, &content)?;
        Ok(())
    }

    pub fn remove_file(path: &str) -> Result<(), io::Error> {
        std::fs::remove_file(path)?;
        Ok(())
    }
}
