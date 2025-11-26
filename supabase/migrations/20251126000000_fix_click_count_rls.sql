-- Drop and recreate RLS policies to ensure proper permissions
DROP POLICY IF EXISTS "Public can claim items" ON public.items;

-- Allow public to update items (needed for click_count and claiming)
CREATE POLICY "Public can update items" ON public.items
  FOR UPDATE USING (true) 
  WITH CHECK (true);

-- Drop and recreate the RPC function to ensure it's properly defined
DROP FUNCTION IF EXISTS increment_item_click_count(UUID);

CREATE OR REPLACE FUNCTION increment_item_click_count(item_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.items
  SET click_count = COALESCE(click_count, 0) + 1
  WHERE id = item_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION increment_item_click_count(UUID) TO anon, authenticated;
