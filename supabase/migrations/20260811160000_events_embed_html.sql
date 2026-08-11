-- Events: optional raw embed snippet (e.g. a Klaviyo inline signup form div)
-- rendered as-is on the public event page, below the description. Separate
-- from `description` because that field goes through Tiptap, which escapes
-- raw HTML rather than passing it through.
alter table events add column if not exists embed_html text;
