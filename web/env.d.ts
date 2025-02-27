declare namespace NodeJS {
  interface ProcessEnv {
    MINIO_ENDPOINT: string
    MINIO_PORT: string
    MINIO_USE_SSL: string
    MINIO_ACCESS_KEY: string
    MINIO_SECRET_KEY: string
    RABBITMQ_CONNECTION_STRING: string
    RABBITMQ_EXCHANGE_NAME: string
    RABBITMQ_QUEUE_NAME: string
    RABBITMQ_EXCHANGE_TYPE: string
  }
}