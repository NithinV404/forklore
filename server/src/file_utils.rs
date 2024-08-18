use std::fs::OpenOptions;
use std::path::Path;

#[allow(dead_code)]
pub struct FileUtils;

#[allow(dead_code)]
impl FileUtils {

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

    pub fn file_exists(path: &str, create:bool)-> bool {
        if OpenOptions::new().read(true).open(path).is_ok() {return true}
        else {
            if create {
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
}