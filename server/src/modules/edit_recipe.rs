use crate::modules::add_recipe_user;
use actix_multipart::Multipart;
use actix_web::{HttpResponse, Responder};

pub async fn edit_recipe(payload: Multipart) -> impl Responder {
    if add_recipe_user::add_recipe_user(payload).await.is_ok() {
        return HttpResponse::Ok().body("Edited recipe");
    } else {
        return HttpResponse::BadRequest().body("Failed to edit recipe");
    }
}
