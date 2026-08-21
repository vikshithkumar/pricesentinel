-- V4__self_healing_and_collectors.sql  Collector Nodes & Self-Healing Audit Logs

CREATE TABLE collector_node (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vendor_id       UUID NOT NULL REFERENCES vendor(id),
    collector_id    TEXT NOT NULL UNIQUE,
    category        TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'healthy',
    success_rate    NUMERIC(5,2) NOT NULL DEFAULT 99.50,
    latency_ms      INTEGER NOT NULL DEFAULT 145,
    last_scan_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE self_healing_log (
    id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    collector_id      TEXT NOT NULL,
    vendor_name       TEXT NOT NULL,
    failed_selector   TEXT NOT NULL,
    repaired_selector TEXT NOT NULL,
    recovery_time_ms  INTEGER NOT NULL,
    confidence_score  NUMERIC(4,3) NOT NULL,
    status            TEXT NOT NULL DEFAULT 'repaired',
    fields_recovered  TEXT NOT NULL,
    created_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Seed initial collector nodes for the 10 vendors
INSERT INTO collector_node (id, vendor_id, collector_id, category, status, success_rate, latency_ms) VALUES
    ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'col_stripe_01',    'financial',  'healthy', 99.90, 110),
    ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'col_openai_02',    'ecommerce',  'degraded', 94.20, 320),
    ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'col_anthropic_03', 'ecommerce',  'healthy', 99.80, 135),
    ('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000004', 'col_github_04',    'travel',     'healthy', 99.50, 180),
    ('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000005', 'col_vercel_05',    'financial',  'healthy', 99.10, 195),
    ('c0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000006', 'col_aws_06',       'financial',  'failed',  78.40, 650),
    ('c0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000007', 'col_datadog_07',   'financial',  'stale',   91.00, 240),
    ('c0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000008', 'col_notion_08',    'ecommerce',  'healthy', 99.60, 140),
    ('c0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000009', 'col_linear_09',    'travel',     'healthy', 99.70, 125),
    ('c0000000-0000-0000-0000-00000000000a', 'a0000000-0000-0000-0000-00000000000a', 'col_figma_10',     'ecommerce',  'healthy', 99.40, 155);

-- Seed initial self-healing historical record
INSERT INTO self_healing_log (id, collector_id, vendor_name, failed_selector, repaired_selector, recovery_time_ms, confidence_score, status, fields_recovered) VALUES
    ('d0000000-0000-0000-0000-000000000001', 'col_openai_02', 'OpenAI', '.pricing-card .price-amount', '[data-test="pricing-tier-val"]', 420, 0.985, 'repaired', 'price_amount, billing_period');
