/*
  # Create tutorials table

  1. New Tables
    - `tutorials`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `excerpt` (text, optional)
      - `category` (text, required)
      - `tags` (text array, optional)
      - `estimated_read_time` (integer, required)
      - `cover_image_url` (text, required)
      - `content_url` (text, required)
      - `author` (uuid, references users.id)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `tutorials` table
    - Add policies for authenticated users to:
      - Create tutorials
      - Read tutorials
*/

CREATE TABLE IF NOT EXISTS tutorials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text,
  category text NOT NULL,
  tags text[] DEFAULT ARRAY[]::text[],
  estimated_read_time integer NOT NULL,
  cover_image_url text NOT NULL,
  content_url text NOT NULL,
  author uuid NOT NULL REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tutorials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create tutorials"
  ON tutorials
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author);

CREATE POLICY "Anyone can read tutorials"
  ON tutorials
  FOR SELECT
  TO authenticated
  USING (true);