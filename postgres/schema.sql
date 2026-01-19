-- PostgreSQL schema for Convex baby predictions data
-- Generated from convex/schema.ts

-- Drop tables if they exist (for clean re-imports)
DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS arrival_votes;
DROP TABLE IF EXISTS weight_votes;

-- Votes table: boy/girl predictions
CREATE TABLE votes (
    id TEXT PRIMARY KEY,
    prediction VARCHAR(4) NOT NULL CHECK (prediction IN ('boy', 'girl')),
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_votes_timestamp ON votes(timestamp);

-- Arrival votes table: before/after predictions
CREATE TABLE arrival_votes (
    id TEXT PRIMARY KEY,
    prediction VARCHAR(6) NOT NULL CHECK (prediction IN ('before', 'after')),
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_arrival_votes_timestamp ON arrival_votes(timestamp);

-- Weight votes table: over/under predictions
CREATE TABLE weight_votes (
    id TEXT PRIMARY KEY,
    prediction VARCHAR(5) NOT NULL CHECK (prediction IN ('over', 'under')),
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_weight_votes_timestamp ON weight_votes(timestamp);
