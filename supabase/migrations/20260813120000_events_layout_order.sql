-- Events: admin-defined display order for the four reorderable blocks on
-- the public event detail page (cover image, title, description, embed
-- form). Everything else on the page (back link, date/location/badges/
-- register button — which travel with "title" — doc download, more events)
-- stays in a fixed position.
alter table events add column if not exists layout_order text[]
  not null default '{cover_image,title,description,embed_html}';
