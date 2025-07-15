"""
Utility functions for the MCP server.
"""

import functools
import inspect
import json
import logging
import os
import time
from collections.abc import Callable
from datetime import datetime
from typing import Any

import psutil

logger = logging.getLogger("mcpserver.utils")


def get_log_level_from_env(default: str = "INFO") -> int:
    """Get log level from environment or settings."""
    env_level = os.getenv("LOG_LEVEL", default).upper()
    return getattr(logging, env_level, logging.INFO)


def format_log(value: Any, max_length: int = 100) -> str:
    """Format a value for logging, truncating if too long."""
    try:
        if isinstance(value, dict | list):
            formatted = json.dumps(value, default=str, separators=(",", ":"))
        else:
            formatted = repr(value)

        if len(formatted) > max_length:
            return formatted[: max_length - 3] + "..."
        return formatted
    except (TypeError, ValueError, AttributeError):
        return f"<{type(value).__name__} object>"


def function_logger(
    log_level: int | str | None = None,
    log_args: bool = True,
    log_return: bool = False,
    log_execution_time: bool = True,
    max_arg_length: int = 100,
    exclude_args: set[str] | None = None,
    sensitive_args: set[str] | None = None,
    prefix: str = "TOOL",
):
    """
    Create a logging decorator with specified configuration.

    Args:
        log_level: Logging level (int, string, or None for env default)
        log_args: Whether to log function arguments
        log_return: Whether to log return values
        log_execution_time: Whether to log execution time
        max_arg_length: Maximum length for argument values in logs
        exclude_args: Set of argument names to exclude from logging
        sensitive_args: Set of argument names to mask in logs

    Returns:
        Decorator function
    """
    # Resolve log level
    if log_level is None:
        resolved_log_level = get_log_level_from_env()
    elif isinstance(log_level, str):
        resolved_log_level = getattr(logging, log_level.upper(), logging.INFO)
    else:
        resolved_log_level = log_level

    # Set defaults
    if exclude_args is None:
        exclude_args = set()
    if sensitive_args is None:
        sensitive_args = {"password", "token", "key", "secret", "auth", "credential"}

    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            start_time = time.time()
            func_name = func.__name__

            # Early exit if log level not enabled
            if not logger.isEnabledFor(resolved_log_level):
                return func(*args, **kwargs)

            # Log function entry
            if log_args:
                try:
                    sig = inspect.signature(func)
                    bound_args = sig.bind(*args, **kwargs)
                    bound_args.apply_defaults()

                    # Format arguments with filtering
                    arg_strs = []
                    for name, value in bound_args.arguments.items():
                        if name in exclude_args:
                            continue
                        elif name in sensitive_args:
                            arg_strs.append(f"{name}=***")
                        else:
                            formatted_value = format_log(value, max_arg_length)
                            arg_strs.append(f"{name}={formatted_value}")

                    args_display = ", ".join(arg_strs)
                    logger.log(
                        resolved_log_level,
                        "🔧 %s: %s | ARGS: %s",
                        prefix,
                        func_name,
                        args_display,
                    )
                except (TypeError, ValueError, AttributeError) as e:
                    logger.log(
                        resolved_log_level,
                        "→ %s(<args parsing error: %s>)",
                        func_name,
                        e,
                    )
            else:
                logger.log(resolved_log_level, "🔧 %s: %s", prefix, func_name)

            # Execute function and handle exceptions
            try:
                result = func(*args, **kwargs)

                # Log execution time and return value
                if log_execution_time:
                    execution_time = time.time() - start_time
                    time_str = f" [{execution_time:.3f}s]"
                else:
                    time_str = ""

                if log_return:
                    result_str = format_log(result, max_arg_length)
                    logger.log(
                        resolved_log_level,
                        "✅ %s: %s | RESULT: %s%s",
                        prefix,
                        func_name,
                        result_str,
                        time_str,
                    )
                else:
                    logger.log(
                        resolved_log_level,
                        "✅ %s: %s | COMPLETED%s",
                        prefix,
                        func_name,
                        time_str,
                    )

                return result

            except Exception as e:
                execution_time = time.time() - start_time
                logger.error(
                    "❌ %s: %s | FAILED after %.3fs | ERROR: %s: %s",
                    prefix,
                    func_name,
                    execution_time,
                    type(e).__name__,
                    e,
                )
                raise

        return wrapper

    return decorator


def setup_structured_logging(
    log_level: str,
    log_format: str = "json",
    include_timestamp: bool = True,
    include_level: bool = True,
    include_module: bool = True,
) -> None:
    """
    Setup structured logging for optimal log analysis.

    Args:
        log_level: Logging level (string)
        log_format: Format type ('json', 'text', 'compact')
        include_timestamp: Whether to include timestamps
        include_level: Whether to include log levels
        include_module: Whether to include module names
    """
    log_level_num = getattr(logging, log_level.upper(), logging.INFO)

    # Create formatters based on format type
    if log_format == "json":

        class JsonFormatter(logging.Formatter):
            """JSON formatter for logging."""

            def format(self, record):
                """Format a log record as a JSON object."""
                log_entry = {}
                if include_timestamp:
                    log_entry["timestamp"] = datetime.fromtimestamp(
                        record.created
                    ).isoformat()
                if include_level:
                    log_entry["level"] = record.levelname
                if include_module:
                    log_entry["module"] = record.name
                log_entry["message"] = record.getMessage()
                if record.exc_info:
                    log_entry["exception"] = self.formatException(record.exc_info)
                return json.dumps(log_entry)

        formatter = JsonFormatter()
    elif log_format == "compact":
        format_parts = []
        if include_timestamp:
            format_parts.append("%(asctime)s")
        if include_level:
            format_parts.append("[%(levelname)s]")
        if include_module:
            format_parts.append("%(name)s:")
        format_parts.append("%(message)s")
        formatter = logging.Formatter(" ".join(format_parts), datefmt="%H:%M:%S")
    else:  # text format
        format_parts = []
        if include_timestamp:
            format_parts.append("%(asctime)s")
        if include_level:
            format_parts.append("%(levelname)-8s")
        if include_module:
            format_parts.append("%(name)-20s")
        format_parts.append("%(message)s")
        formatter = logging.Formatter(" - ".join(format_parts))

    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(log_level_num)

    # Remove existing handlers
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)

    # Add console handler with formatter
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    root_logger.addHandler(console_handler)


def performance_monitor(func: Callable) -> Callable:
    """
    Decorator for logging detailed performance metrics.
    """

    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        start_memory = None

        try:
            process = psutil.Process(os.getpid())
            start_memory = process.memory_info().rss / 1024 / 1024  # MB
        except ImportError:
            pass

        try:
            result = func(*args, **kwargs)

            # Calculate metrics
            execution_time = time.time() - start_time
            memory_used = None

            if start_memory:
                try:
                    end_memory = process.memory_info().rss / 1024 / 1024  # MB
                    memory_used = end_memory - start_memory
                except (psutil.Error, OSError):
                    pass

            # Log performance metrics
            metrics = {
                "function": func.__name__,
                "execution_time": f"{execution_time:.3f}s",
                "status": "success",
            }

            if memory_used is not None:
                metrics["memory_delta"] = f"{memory_used:.2f}MB"

            logger.info(
                "⚡ PERF | TOOL: %s | %s",
                func.__name__,
                json.dumps(metrics, separators=(",", ":")),
            )
            return result

        except Exception as e:
            execution_time = time.time() - start_time
            metrics = {
                "function": func.__name__,
                "execution_time": f"{execution_time:.3f}s",
                "status": "error",
                "error": str(e),
            }
            logger.error(
                "⚡ PERF | TOOL: %s | %s",
                func.__name__,
                json.dumps(metrics, separators=(",", ":")),
            )
            raise

    return wrapper


# Convenience functions that return decorators with specific log levels
def log_debug(func: Callable, **kwargs) -> Callable | Callable[[Callable], Callable]:
    """Create a DEBUG level logging decorator."""
    return function_logger(log_level=logging.DEBUG, **kwargs)(func)


def log_info(func: Callable, **kwargs) -> Callable | Callable[[Callable], Callable]:
    """Create an INFO level logging decorator."""
    return function_logger(log_level=logging.INFO, **kwargs)(func)


def log_warning(func: Callable, **kwargs) -> Callable | Callable[[Callable], Callable]:
    """Create a WARNING level logging decorator."""
    return function_logger(log_level=logging.WARNING, **kwargs)(func)


# Convenience decorators with common configurations
def log_simple(func: Callable) -> Callable:
    """Simple logging decorator - just function name and execution time."""
    return function_logger(log_args=False, log_return=False, log_execution_time=True)(
        func
    )


def log_verbose(func: Callable) -> Callable:
    """Verbose logging decorator - logs everything."""
    return function_logger(
        log_args=True, log_return=True, log_execution_time=True, max_arg_length=200
    )(func)


def log_minimal(func: Callable) -> Callable:
    """Minimal logging decorator - just function name."""
    return function_logger(log_args=False, log_return=False, log_execution_time=False)(
        func
    )


# Prefix-specific convenience functions
def log_tool(func: Callable) -> Callable:
    """Logging decorator for tool functions."""
    return function_logger(prefix="TOOL")(func)


def log_formatter(func: Callable) -> Callable:
    """Logging decorator for formatter functions."""
    return function_logger(prefix="FORMATTER", log_args=False)(func)


def log_service(func: Callable) -> Callable:
    """Logging decorator for service functions."""
    return function_logger(prefix="SERVICE")(func)


def log_validator(func: Callable) -> Callable:
    """Logging decorator for validator functions."""
    return function_logger(prefix="VALIDATOR")(func)


def log_handler(func: Callable) -> Callable:
    """Logging decorator for handler functions."""
    return function_logger(prefix="HANDLER")(func)


def log_processor(func: Callable) -> Callable:
    """Logging decorator for processor functions."""
    return function_logger(prefix="PROCESSOR")(func)


def log_utility(func: Callable) -> Callable:
    """Logging decorator for utility functions."""
    return function_logger(prefix="UTILITY")(func)


# Factory function for creating custom loggers
def create_logger(level: str | int = None, prefix: str = "TOOL", **config) -> Callable:
    """
    Factory function to create custom logging decorators.

    Args:
        level: Log level (string or int)
        prefix: Custom prefix for log messages
        **config: Additional configuration for function_logger

    Returns:
        Configured logging decorator

    Examples:
        # Create a custom logger
        my_logger = create_logger('WARNING', prefix="CUSTOM", log_return=True)

        # Create specific type loggers
        db_logger = create_logger(prefix="DATABASE")
        api_logger = create_logger(prefix="API")

        @my_logger
        def my_function():
            return "result"
    """
    return function_logger(log_level=level, prefix=prefix, **config)
