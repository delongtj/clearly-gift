-- Add item_updated event type to the constraint
ALTER TABLE public.list_subscription_events
DROP CONSTRAINT list_subscription_events_event_type_check;

ALTER TABLE public.list_subscription_events
ADD CONSTRAINT list_subscription_events_event_type_check 
CHECK (event_type IN ('item_added', 'item_removed', 'item_claimed', 'item_unclaimed', 'item_updated'));
