-- V1__init.sql  PriceSentinel core schema

CREATE TABLE vendor (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name            TEXT NOT NULL,
    category        TEXT,
    pricing_url     TEXT NOT NULL,
    active          BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE monitor (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vendor_id       UUID NOT NULL REFERENCES vendor(id),
    scraper_job_id  TEXT,
    schedule        TEXT NOT NULL CHECK (schedule IN ('demo_15m', 'daily')),
    status          TEXT NOT NULL DEFAULT 'idle',
    last_success_at TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE scrape_run (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    monitor_id      UUID NOT NULL REFERENCES monitor(id),
    status          TEXT NOT NULL CHECK (status IN ('queued','running','succeeded','failed')),
    raw_result_ref  TEXT,
    schema_version  TEXT,
    self_healed     BOOLEAN NOT NULL DEFAULT FALSE,
    error_message   TEXT,
    started_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    finished_at     TIMESTAMP WITH TIME ZONE
);

CREATE TABLE pricing_snapshot (
    id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vendor_id             UUID NOT NULL REFERENCES vendor(id),
    scrape_run_id         UUID NOT NULL REFERENCES scrape_run(id),
    captured_at           TIMESTAMP WITH TIME ZONE NOT NULL,
    source_url            TEXT NOT NULL,
    extraction_confidence NUMERIC(4,3) NOT NULL,
    content_hash          TEXT NOT NULL
);

CREATE TABLE plan (
    id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    snapshot_id       UUID NOT NULL REFERENCES pricing_snapshot(id),
    name              TEXT NOT NULL,
    normalized_name   TEXT NOT NULL,
    price_amount      NUMERIC(12,2),
    currency          TEXT,
    billing_period    TEXT,
    usage_limits_json JSONB,
    features_json     JSONB
);

CREATE TABLE exposure (
    id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vendor_id      UUID NOT NULL REFERENCES vendor(id),
    current_plan   TEXT NOT NULL,
    seat_count     INTEGER NOT NULL,
    billing_cycle  TEXT NOT NULL,
    monthly_spend  NUMERIC(12,2),
    updated_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE change_event (
    id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vendor_id             UUID NOT NULL REFERENCES vendor(id),
    before_snapshot_id    UUID NOT NULL REFERENCES pricing_snapshot(id),
    after_snapshot_id     UUID NOT NULL REFERENCES pricing_snapshot(id),
    type                  TEXT NOT NULL CHECK (type IN ('price','usage_limit','plan','feature','schema')),
    before_json           JSONB NOT NULL,
    after_json            JSONB NOT NULL,
    base_score            NUMERIC(5,2) NOT NULL,
    final_score           NUMERIC(5,2) NOT NULL,
    confidence            NUMERIC(4,3) NOT NULL,
    impact_summary        TEXT,
    status                TEXT NOT NULL DEFAULT 'open',
    created_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_change_event_vendor ON change_event(vendor_id, created_at DESC);
CREATE INDEX idx_snapshot_vendor ON pricing_snapshot(vendor_id, captured_at DESC);
