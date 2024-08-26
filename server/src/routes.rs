use crate::modules::{add_recipe_user, delete_recipes, edit_recipe, fetch_recipes};
use actix_files as fs;
use actix_web::web;

pub fn config(cfg: &mut web::ServiceConfig) {
    // Serve static files
    cfg.service(fs::Files::new("recipes/images", "recipes/images").show_files_listing());

    // Define routes
    cfg.service(web::resource("/").route(web::get().to(fetch_recipes::get_recipes)));
    cfg.service(
        web::resource("delete/{id}").route(web::delete().to(delete_recipes::delete_recipes)),
    );
    cfg.service(web::resource("addrecipe").route(web::post().to(add_recipe_user::add_recipe_user)));
    cfg.service(web::resource("editrecipe").route(web::post().to(edit_recipe::edit_recipe)));
}
