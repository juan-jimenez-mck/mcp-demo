"""
Application configuration settings and environment management.

This module provides centralized configuration using Pydantic settings with
environment variable support, validation, and type safety.

Loads and validates configuration from environment variables and .env files.
Provides type-safe access to all application settings including database,
MCP, and feature flag configurations.
"""

import os
from functools import lru_cache

from dotenv import load_dotenv
from pydantic import field_validator
from pydantic_settings import BaseSettings

# Load environment variables from .env file
load_dotenv()


class Settings(BaseSettings):
    """
    Application configuration settings with environment variable support.
    """

    # App Configuration
    app_name: str = "MCP Server"
    app_version: str = "1.0.0"
    debug: bool = os.getenv("DEBUG", "False").lower() == "true"
    environment: str = "development"

    # Configuration
    host: str = os.getenv("HOST")
    port: int = os.getenv("PORT")
    transport: str = os.getenv("TRANSPORT")

    # Database
    database_url: str = os.getenv("DATABASE_URL")

    # Anthropic
    anthropic_model: str = os.getenv("ANTHROPIC_MODEL")
    anthropic_api_key: str = os.getenv("ANTHROPIC_API_KEY")
    anthropic_slim_model: str = os.getenv("ANTHROPIC_CHEAP_MODEL")
    anthropic_max_tokens: int = os.getenv("ANTHROPIC_MAX_TOKENS")

    # Logging
    log_level: str = "INFO"
    log_format: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

    @field_validator("environment")
    @classmethod
    def validate_environment(cls, v):
        """
        Validate the environment.
        """
        allowed = ["development", "staging", "production", "testing"]
        if v not in allowed:
            raise ValueError(f"Environment must be one of: {allowed}")
        return v

    @property
    def is_development(self) -> bool:
        """
        Check if the environment is development.
        """
        return self.environment == "development"

    @property
    def is_production(self) -> bool:
        """
        Check if the environment is production.
        """
        return self.environment == "production"

    class Config:
        """
        Pydantic settings configuration.
        """

        env_file = ".env"
        case_sensitive = False
        # Allow environment variables to override
        env_prefix = ""


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


# Global settings instance
settings = get_settings()
