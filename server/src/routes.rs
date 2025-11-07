use crate::modules::{
    add_recipe_api, add_recipe_user, delete_recipes, edit_recipe, get_recipes, ie_recipes,
    saved_recipes, search_api,
};
use actix_files as fs;
use actix_web::web;

pub fn config(cfg: &mut web::ServiceConfig) {
    // Serve images
    cfg.service(
        fs::Files::new("/recipes/images", "recipes/images")
            .show_files_listing()
            .prefer_utf8(true)
            .use_last_modified(true),
    );

    // API routes without static file serving
    cfg.service(web::resource("/").route(web::get().to(get_recipes::get_recipes)));
    cfg.service(
        web::resource("/delete/{id}").route(web::delete().to(delete_recipes::delete_recipes)),
    );
    cfg.service(
        web::resource("/addrecipe").route(web::post().to(add_recipe_user::add_recipe_user)),
    );
    cfg.service(web::resource("/editrecipe").route(web::post().to(edit_recipe::edit_recipe)));
    cfg.service(web::resource("/search").route(web::post().to(search_api::search_api)));
    cfg.service(web::resource("/add").route(web::post().to(add_recipe_api::add_recipe_api)));
    cfg.service(web::resource("/saved").route(web::get().to(saved_recipes::saved_recipes)));
    cfg.service(web::resource("/export").route(web::get().to(ie_recipes::export_recipes)));
    cfg.service(web::resource("/import").route(web::post().to(ie_recipes::import_recipes)));
}
