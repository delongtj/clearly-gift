-- Add position column to items table
ALTER TABLE public.items
ADD COLUMN position INTEGER DEFAULT 0;

-- Create index for sorting by position
CREATE INDEX idx_items_list_position ON public.items(list_id, position);
