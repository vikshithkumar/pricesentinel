-- V3__seed_vendors.sql  Fixed 10-vendor watchlist + monitors

INSERT INTO vendor (id, name, category, pricing_url) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Stripe',    'Payments',       'https://stripe.com/pricing'),
    ('a0000000-0000-0000-0000-000000000002', 'OpenAI',    'AI / LLM',       'https://openai.com/pricing'),
    ('a0000000-0000-0000-0000-000000000003', 'Anthropic', 'AI / LLM',       'https://www.anthropic.com/pricing'),
    ('a0000000-0000-0000-0000-000000000004', 'GitHub',    'Dev Tools',      'https://github.com/pricing'),
    ('a0000000-0000-0000-0000-000000000005', 'Vercel',    'Hosting',        'https://vercel.com/pricing'),
    ('a0000000-0000-0000-0000-000000000006', 'AWS',       'Cloud',          'https://aws.amazon.com/pricing/'),
    ('a0000000-0000-0000-0000-000000000007', 'Datadog',   'Observability',  'https://www.datadoghq.com/pricing/'),
    ('a0000000-0000-0000-0000-000000000008', 'Notion',    'Productivity',   'https://www.notion.so/pricing'),
    ('a0000000-0000-0000-0000-000000000009', 'Linear',    'Project Mgmt',   'https://linear.app/pricing'),
    ('a0000000-0000-0000-0000-00000000000a', 'Figma',     'Design',         'https://www.figma.com/pricing/');

INSERT INTO monitor (id, vendor_id, schedule, status) VALUES
    ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'daily', 'idle'),
    ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'daily', 'idle'),
    ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'daily', 'idle'),
    ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000004', 'daily', 'idle'),
    ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000005', 'daily', 'idle'),
    ('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000006', 'daily', 'idle'),
    ('b0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000007', 'daily', 'idle'),
    ('b0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000008', 'daily', 'idle'),
    ('b0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000009', 'daily', 'idle'),
    ('b0000000-0000-0000-0000-00000000000a', 'a0000000-0000-0000-0000-00000000000a', 'daily', 'idle');
