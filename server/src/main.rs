mod modules;
mod routes;
use actix_cors::Cors;
use actix_web::{App, HttpServer};
use std::io;

#[actix_web::main]
async fn main() -> io::Result<()> {
    dotenvy::dotenv().ok();

    let host = std::env::var("HOST").unwrap_or_else(|_| "127.0.0.1".to_string());
    let port: u16 = std::env::var("PORT")
        .unwrap_or_else(|_| "5000".to_string())
        .parse()
        .expect("PORT must be a number");

    HttpServer::new(|| {
        App::new()
            .wrap(
                Cors::default()
                    .allow_any_origin()
                    .allow_any_method()
                    .allow_any_header(),
            )
            .configure(routes::config)
    })
    .bind((host, port))?
    .run()
    .await
}
