/*
  # Create snippets table

  1. New Tables
    - `snippets`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text, nullable)
      - `language` (text)
      - `author` (uuid, references users.id)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `last_modifier` (uuid, references users.id)
      - `modifiers` (uuid array)
      - `code_url` (text)

  2. Security
    - Enable RLS on `snippets` table
    - Add policies for authenticated users to:
      - Create snippets
      - Read own snippets
      - Update own snippets
*/

CREATE TABLE IF NOT EXISTS snippets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  language text NOT NULL,
  author uuid NOT NULL REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_modifier uuid REFERENCES users(id),
  modifiers uuid[] DEFAULT ARRAY[]::uuid[],
  code_url text NOT NULL
);

ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create snippets"
  ON snippets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author);

CREATE POLICY "Users can read own snippets"
  ON snippets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = author);

CREATE POLICY "Users can update own snippets"
  ON snippets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author);