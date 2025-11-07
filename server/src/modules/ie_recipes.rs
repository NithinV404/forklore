use crate::modules::file_utils::FileUtils;
use actix_files::NamedFile;
use actix_multipart::Multipart;
use actix_web::{
    http::header::{ContentDisposition, DispositionParam, DispositionType},
    HttpResponse,
};
use futures::StreamExt;
use std::collections::HashSet;
use std::path::PathBuf;

const RECIPES_FILE_PATH: &str = "./recipes/recipes.json";

pub async fn export_recipes() -> Result<NamedFile, actix_web::Error> {
    let path = PathBuf::from(RECIPES_FILE_PATH);
    let file = NamedFile::open(path)?;
    Ok(file.set_content_disposition(ContentDisposition {
        disposition: DispositionType::Attachment,
        parameters: vec![DispositionParam::Filename("recipes.json".to_string())],
    }))
}

pub async fn import_recipes(
    mut payload: Multipart,
) -> Result<HttpResponse, Box<dyn std::error::Error>> {
    while let Some(item) = payload.next().await {
        let mut field = item?;
        if let Some(cd) = field.content_disposition() {
            if let Some(name) = cd.get_name() {
                if name == "file" {
                    let mut bytes = Vec::new();
                    while let Some(chunk) = field.next().await {
                        let data = chunk?;
                        bytes.extend_from_slice(&data);
                    }
                    let content = String::from_utf8(bytes)?;
                    let imported = FileUtils::validate_and_parse_recipes(&content)?;
                    let mut existing = FileUtils::read_file(RECIPES_FILE_PATH)?;
                    let existing_ids: HashSet<_> = existing.iter().map(|r| &r.idMeal).collect();
                    let new_recipes: Vec<_> = imported
                        .into_iter()
                        .filter(|r| !existing_ids.contains(&r.idMeal))
                        .collect();
                    existing.extend(new_recipes);
                    FileUtils::write_file(RECIPES_FILE_PATH, existing)?;
                    return Ok(HttpResponse::Ok().body("Recipes imported successfully"));
                }
            }
        }
    }
    Ok(HttpResponse::BadRequest().body("No file provided"))
}
