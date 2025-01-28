mod modules;
mod routes;
use actix_cors::Cors;
use actix_files as fs;
use actix_web::{App, HttpServer};
use std::{env, io};

#[actix_web::main]
async fn main() -> io::Result<()> {
    // Start static file server
    let binary_path = env::current_exe()?;
    let exe_dir = binary_path.parent().unwrap();
    let public_path = format!("{}/public", exe_dir.to_str().unwrap());
    let static_server = HttpServer::new(move || {
        App::new()
            .wrap(
                Cors::default()
                    .allow_any_origin()
                    .allow_any_method()
                    .allow_any_header(),
            )
            .service(fs::Files::new("/", &public_path).index_file("index.html"))
    })
    .bind(("127.0.0.1", 8000))?
    .run();

    // Start API server
    let api_server = HttpServer::new(|| {
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
    .run();

    // Run both servers
    futures::future::try_join(static_server, api_server).await?;
    Ok(())
}
