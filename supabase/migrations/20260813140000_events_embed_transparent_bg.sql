-- Events: whether the raw embed snippet (e.g. a Klaviyo signup form) has its
-- own white panel background stripped so it blends into the page background.
-- Default false preserves the current look for every existing event.
alter table events add column if not exists embed_transparent_bg boolean not null default false;
