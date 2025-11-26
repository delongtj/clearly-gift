-- Revert to the original function that was working
DROP FUNCTION IF EXISTS increment_item_click_count(UUID);

CREATE OR REPLACE FUNCTION increment_item_click_count(item_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.items
  SET click_count = click_count + 1
  WHERE id = item_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to anon and authenticated roles
GRANT EXECUTE ON FUNCTION increment_item_click_count(UUID) TO anon, authenticated;
