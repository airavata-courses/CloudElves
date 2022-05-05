from pydantic import BaseSettings

class Settings(BaseSettings):
    CUSTOS_HOST: str = "js-157-36.jetstream-cloud.org"
    CUSTOS_PORT: str = "32036"
    CUSTOS_CLIENT_ID: str = "custos-elvjqfo7bvpbq4oflw1p-10000104"
    CUSTOS_CLIENT_SECRET: str = "tau9aGzpcRDFhAjZ2wVhGqGVYN8Gq20kuCqXXvJ5"
    
    ADMIN_USER: str = "madhkr"
    ADMIN_PASS: str = "password"

    class Config:
        env_file = ".env"

