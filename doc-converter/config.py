from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    cors_allow_origins: list = []
    cors_allow_credentials: bool = False
    cors_allow_methods: list = []
    cors_allow_headers: list = []
    
    model_config = SettingsConfigDict(
        env_file=".env",
    )
        