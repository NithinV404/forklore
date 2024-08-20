use serde_json::{Error, Value};
use std::fs::{File, OpenOptions};
use std::io::{Read, Write};
use std::path::Path;

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

    pub fn write_file(path: &str, content: &Value) {
        let mut file = File::create(path).expect("Failed to create file");
        file.write_all(content.to_string().as_bytes())
            .expect("Failed to write to file");
    }

    // pub fn write_file(path: &str, content: &str) {}
}
