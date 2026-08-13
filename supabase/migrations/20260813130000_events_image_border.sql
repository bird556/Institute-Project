-- Events: whether the "contain" mode letterbox background shows around a
-- cover image whose aspect ratio doesn't fill its frame (e.g. a portrait
-- flyer). Default true preserves the current look for every existing event.
alter table events add column if not exists image_border boolean not null default true;
