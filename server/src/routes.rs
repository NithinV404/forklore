use crate::modules::{delete_recipes, fetch_recipes};
use actix_web::web;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(web::resource("/").route(web::get().to(fetch_recipes::get_recipes)));
    cfg.service(
        web::resource("delete/{id}").route(web::delete().to(delete_recipes::delete_recipe)),
    );
}
