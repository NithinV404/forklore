mod modules;
mod routes;
use actix_cors::Cors;
use actix_web::{App, HttpServer};
use std::io;

#[actix_web::main]
async fn main() -> io::Result<()> {
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
    .bind(("127.0.0.1", 5000))?
    .run()
    .await
}
