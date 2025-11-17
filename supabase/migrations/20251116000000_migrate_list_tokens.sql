-- Migration to regenerate list tokens to new shorter format (21 chars instead of 64)
-- Uses PostgreSQL's random functions to generate URL-safe characters

-- Create a function to generate a 21-character URL-safe token similar to nanoid
CREATE OR REPLACE FUNCTION generate_short_token()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  result TEXT := '';
  i INT;
BEGIN
  FOR i IN 1..21 LOOP
    result := result || substring(chars, floor(random() * 64)::int + 1, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Update all existing tokens with new shorter ones
UPDATE public.lists
SET token = generate_short_token()
WHERE token IS NOT NULL;

-- Drop the temporary function (optional - can keep it for future use)
-- DROP FUNCTION generate_short_token();
