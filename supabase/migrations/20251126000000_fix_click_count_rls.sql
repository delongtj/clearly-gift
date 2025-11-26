-- Fix RLS policy to allow updating click_count and claimed fields through RPC
DROP POLICY "Public can claim items" ON public.items;

CREATE POLICY "Public can claim items" ON public.items
  FOR UPDATE USING (true)
  WITH CHECK (true);
