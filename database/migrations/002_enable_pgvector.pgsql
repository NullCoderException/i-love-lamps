-- Migration: Enable pgvector extension and add embedding column
-- This adds vector support for AI features
-- Created: 2025-06-29

-- Enable pgvector extension for AI embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to flashlight_manuals table
ALTER TABLE flashlight_manuals ADD COLUMN embedding VECTOR(1536); -- For OpenAI embeddings