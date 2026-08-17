-- Events: optional Klaviyo list ID that this event's registration form feeds
-- into. Used as the fallback destination when the pasted embed_html form
-- (embedded Klaviyo signup div) fails to render client-side — e.g. blocked
-- by an ad blocker or browser tracking protection — so the fallback form can
-- still register the visitor into the same Klaviyo list as the real form.
alter table events add column if not exists klaviyo_list_id text;
