mod file_utils;
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

// Checks if the folder and file exists, if not it creates them



fn main()
{
    println!("{}", file_utils::FileUtils::folder_exists("recipes", false));
    println!("{}", file_utils::FileUtils::file_exists("recipes/recipes.json", true));
}