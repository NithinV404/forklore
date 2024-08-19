mod file_utils;

// Checks if the folder and file exists, if not it creates them
const PATH: &str = "recipes/recipes.json";
fn main() {
    println!(
        "{}",
        file_utils::FileUtils::file_exists("recipes/recipes.json", true)
    );
    println!("{:?}", file_utils::FileUtils::read_file(PATH));
}
