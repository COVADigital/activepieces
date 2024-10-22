export type SystemProp = AppSystemProp | SharedSystemProp | WorkerSystemProps

export enum AppSystemProp {
    API_KEY = 'API_KEY',
    API_RATE_LIMIT_AUTHN_ENABLED = 'API_RATE_LIMIT_AUTHN_ENABLED',
    API_RATE_LIMIT_AUTHN_MAX = 'API_RATE_LIMIT_AUTHN_MAX',
    API_RATE_LIMIT_AUTHN_WINDOW = 'API_RATE_LIMIT_AUTHN_WINDOW',
    AZURE_OPENAI_API_VERSION = 'AZURE_OPENAI_API_VERSION',
    AZURE_OPENAI_ENDPOINT = 'AZURE_OPENAI_ENDPOINT',
    CLIENT_REAL_IP_HEADER = 'CLIENT_REAL_IP_HEADER',
    CLOUD_AUTH_ENABLED = 'CLOUD_AUTH_ENABLED',
    CONFIG_PATH = 'CONFIG_PATH',
    COPILOT_INSTANCE_TYPE = 'COPILOT_INSTANCE_TYPE',
    DB_TYPE = 'DB_TYPE',
    DEV_PIECES = 'DEV_PIECES',
    ENCRYPTION_KEY = 'ENCRYPTION_KEY',
    EXECUTION_DATA_RETENTION_DAYS = 'EXECUTION_DATA_RETENTION_DAYS',
    JWT_SECRET = 'JWT_SECRET',

    /**
     * @deprecated this now can be done from the platform admin page.
     */
    LICENSE_KEY = 'LICENSE_KEY',
    MAX_CONCURRENT_JOBS_PER_PROJECT = 'MAX_CONCURRENT_JOBS_PER_PROJECT',
    OPENAI_API_BASE_URL = 'OPENAI_API_BASE_URL',
    OPENAI_API_KEY = 'OPENAI_API_KEY',
    PIECES_SYNC_MODE = 'PIECES_SYNC_MODE',
    POSTGRES_DATABASE = 'POSTGRES_DATABASE',
    POSTGRES_HOST = 'POSTGRES_HOST',
    POSTGRES_PASSWORD = 'POSTGRES_PASSWORD',
    POSTGRES_PORT = 'POSTGRES_PORT',
    POSTGRES_SSL_CA = 'POSTGRES_SSL_CA',
    POSTGRES_URL = 'POSTGRES_URL',
    POSTGRES_USERNAME = 'POSTGRES_USERNAME',
    POSTGRES_USE_SSL = 'POSTGRES_USE_SSL',
    PROJECT_RATE_LIMITER_ENABLED = 'PROJECT_RATE_LIMITER_ENABLED',
    QUEUE_MODE = 'QUEUE_MODE',
    QUEUE_UI_ENABLED = 'QUEUE_UI_ENABLED',
    QUEUE_UI_PASSWORD = 'QUEUE_UI_PASSWORD',
    QUEUE_UI_USERNAME = 'QUEUE_UI_USERNAME',
    RAPID_API_KEY = 'RAPID_API_KEY',
    REDIS_TYPE = 'REDIS_TYPE',
    REDIS_SSL_CA_FILE = 'REDIS_SSL_CA_FILE',
    REDIS_DB = 'REDIS_DB',
    REDIS_HOST = 'REDIS_HOST',
    REDIS_PASSWORD = 'REDIS_PASSWORD',
    REDIS_PORT = 'REDIS_PORT',
    REDIS_URL = 'REDIS_URL',
    REDIS_USER = 'REDIS_USER',
    REDIS_USE_SSL = 'REDIS_USE_SSL',
    REDIS_SENTINEL_ROLE = 'REDIS_SENTINEL_ROLE',
    REDIS_SENTINEL_HOSTS = 'REDIS_SENTINEL_HOSTS',
    REDIS_SENTINEL_NAME = 'REDIS_SENTINEL_NAME',
    S3_ACCESS_KEY_ID = 'S3_ACCESS_KEY_ID',
    S3_BUCKET = 'S3_BUCKET',
    S3_ENDPOINT = 'S3_ENDPOINT',
    S3_REGION = 'S3_REGION',
    S3_SECRET_ACCESS_KEY = 'S3_SECRET_ACCESS_KEY',
    S3_USE_SIGNED_URLS = 'S3_USE_SIGNED_URLS',
    SMTP_HOST = 'SMTP_HOST',
    SMTP_PASSWORD = 'SMTP_PASSWORD',
    SMTP_PORT = 'SMTP_PORT',
    SMTP_SENDER_EMAIL = 'SMTP_SENDER_EMAIL',
    SMTP_SENDER_NAME = 'SMTP_SENDER_NAME',
    SMTP_USERNAME = 'SMTP_USERNAME',
    SMTP_USE_SSL = 'SMTP_USE_SSL',
    TELEMETRY_ENABLED = 'TELEMETRY_ENABLED',
    TEMPLATES_SOURCE_URL = 'TEMPLATES_SOURCE_URL',
    TRIGGER_DEFAULT_POLL_INTERVAL = 'TRIGGER_DEFAULT_POLL_INTERVAL',
    TRIGGER_FAILURES_THRESHOLD = 'TRIGGER_FAILURES_THRESHOLD',
    WEBHOOK_TIMEOUT_SECONDS = 'WEBHOOK_TIMEOUT_SECONDS',


    // ENTERPRISE ONLY
    APPSUMO_TOKEN = 'APPSUMO_TOKEN',
    FILE_STORAGE_LOCATION = 'FILE_STORAGE_LOCATION',
    FIREBASE_ADMIN_CREDENTIALS = 'FIREBASE_ADMIN_CREDENTIALS',
    FIREBASE_HASH_PARAMETERS = 'FIREBASE_HASH_PARAMETERS',
    STRIPE_SECRET_KEY = 'STRIPE_SECRET_KEY',
    STRIPE_WEBHOOK_SECRET = 'STRIPE_WEBHOOK_SECRET',

    // CLOUD_ONLY
    CLOUD_PLATFORM_ID = 'CLOUD_PLATFORM_ID',
    CLOUDFLARE_AUTH_EMAIL = 'CLOUDFLARE_AUTH_EMAIL',
    CLOUDFLARE_ZONE_ID = 'CLOUDFLARE_ZONE_ID',
    CLOUDFLARE_API_KEY = 'CLOUDFLARE_API_KEY',
    EDITION = 'EDITION',

}

export enum SharedSystemProp  {
    LOG_LEVEL = 'LOG_LEVEL',
    LOG_PRETTY = 'LOG_PRETTY',
    ENVIRONMENT = 'ENVIRONMENT',
    CONTAINER_TYPE = 'CONTAINER_TYPE',
    TRIGGER_TIMEOUT_SECONDS = 'TRIGGER_TIMEOUT_SECONDS',
    FLOW_TIMEOUT_SECONDS = 'FLOW_TIMEOUT_SECONDS',
    PAUSED_FLOW_TIMEOUT_DAYS = 'PAUSED_FLOW_TIMEOUT_DAYS',
    APP_WEBHOOK_SECRETS = 'APP_WEBHOOK_SECRETS',
    MAX_FILE_SIZE_MB = 'MAX_FILE_SIZE_MB',

    FRONTEND_URL = 'FRONTEND_URL',

    // These are shared as the app is using the engine as a dependency for now.
    CACHE_PATH = 'CACHE_PATH',
    EXECUTION_MODE = 'EXECUTION_MODE',
    PACKAGE_ARCHIVE_PATH = 'PACKAGE_ARCHIVE_PATH',
    SANDBOX_MEMORY_LIMIT = 'SANDBOX_MEMORY_LIMIT',
    SANDBOX_PROPAGATED_ENV_VARS = 'SANDBOX_PROPAGATED_ENV_VARS',
    PIECES_SOURCE = 'PIECES_SOURCE',
    PIECES_CONFIG = 'PIECES_CONFIG',
    ENGINE_EXECUTABLE_PATH = 'ENGINE_EXECUTABLE_PATH',
    ENRICH_ERROR_CONTEXT = 'ENRICH_ERROR_CONTEXT',

    // Cloud Only & Enterprise Only
    SENTRY_DSN = 'SENTRY_DSN',
    LOKI_PASSWORD = 'LOKI_PASSWORD',
    LOKI_URL = 'LOKI_URL',
    LOKI_USERNAME = 'LOKI_USERNAME',


}

export enum WorkerSystemProps {
    FLOW_WORKER_CONCURRENCY = 'FLOW_WORKER_CONCURRENCY',
    SCHEDULED_WORKER_CONCURRENCY = 'SCHEDULED_WORKER_CONCURRENCY',
    SCHEDULED_POLLING_COUNT = 'SCHEDULED_POLLING_COUNT',

    // TODO: This is currently undocumented and used for testing purposes. Please document or remove as necessary.
    POLLING_POOL_SIZE = 'POLLING_POOL_SIZE',
    WORKER_TOKEN = 'WORKER_TOKEN',
}
