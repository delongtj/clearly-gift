-- List Subscriptions table
CREATE TABLE public.list_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  list_id UUID REFERENCES public.lists(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  verification_token TEXT NOT NULL,
  verification_expires_at TIMESTAMPTZ NOT NULL,
  verified_at TIMESTAMPTZ,
  unsubscribe_token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_list_subscriptions_list_id ON public.list_subscriptions(list_id);
CREATE INDEX idx_list_subscriptions_email ON public.list_subscriptions(email);
CREATE INDEX idx_list_subscriptions_verification_token ON public.list_subscriptions(verification_token);
CREATE INDEX idx_list_subscriptions_unsubscribe_token ON public.list_subscriptions(unsubscribe_token);

-- Ensure one verified subscription per email per list
CREATE UNIQUE INDEX idx_list_subscriptions_verified_unique 
  ON public.list_subscriptions(list_id, email) 
  WHERE verified_at IS NOT NULL;

-- List Subscription Events table
CREATE TABLE public.list_subscription_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  list_id UUID REFERENCES public.lists(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('item_added', 'item_removed', 'item_claimed', 'item_unclaimed')),
  item_id UUID REFERENCES public.items(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_list_subscription_events_list_id ON public.list_subscription_events(list_id);
CREATE INDEX idx_list_subscription_events_created_at ON public.list_subscription_events(created_at);

-- List Subscription Batches table (tracks what was sent)
CREATE TABLE public.list_subscription_batches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  list_subscription_id UUID REFERENCES public.list_subscriptions(id) ON DELETE CASCADE NOT NULL,
  sent_at TIMESTAMPTZ,
  last_event_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_list_subscription_batches_list_subscription_id ON public.list_subscription_batches(list_subscription_id);
CREATE INDEX idx_list_subscription_batches_sent_at ON public.list_subscription_batches(sent_at);

-- Enable RLS
ALTER TABLE public.list_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.list_subscription_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.list_subscription_batches ENABLE ROW LEVEL SECURITY;

-- RLS Policies: subscription events can be created by service role (job), events are internal
CREATE POLICY "Service can manage subscription events" ON public.list_subscription_events
  FOR ALL USING (true);

CREATE POLICY "Service can manage subscription batches" ON public.list_subscription_batches
  FOR ALL USING (true);

-- Subscriptions are public for unsubscribe lookup, service manages them
CREATE POLICY "Service can manage subscriptions" ON public.list_subscriptions
  FOR ALL USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_list_subscriptions_updated_at BEFORE UPDATE ON public.list_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
