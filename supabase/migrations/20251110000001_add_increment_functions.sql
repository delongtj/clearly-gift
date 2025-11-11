-- Function to increment list view count
CREATE OR REPLACE FUNCTION increment_list_view_count(list_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.lists
  SET view_count = view_count + 1
  WHERE id = list_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment item click count
CREATE OR REPLACE FUNCTION increment_item_click_count(item_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.items
  SET click_count = click_count + 1
  WHERE id = item_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to anon role (for public access)
GRANT EXECUTE ON FUNCTION increment_list_view_count TO anon;
GRANT EXECUTE ON FUNCTION increment_item_click_count TO anon;
