-- V2__raw_payload.sql  Out-of-band raw scraper payload storage

CREATE TABLE raw_payload (
    ref        TEXT PRIMARY KEY,
    content    JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
