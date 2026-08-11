-- Events: public URLs now resolve by slug (e.g. /events/racialprofiling instead of
-- /events/<uuid>) — enforce uniqueness at the DB layer as a backstop to the
-- app-level check in updateEvent().
--
-- Before running this in the Dashboard SQL Editor, check for existing duplicate
-- slugs (the unique index will fail to create if any are found):
--   select slug, count(*) from events group by slug having count(*) > 1;
-- If that returns rows, rename the conflicting slugs first.
create unique index if not exists events_slug_key on events (slug);

-- Events: per-event cover image fit. 'cover' crops to fill the frame (today's
-- behavior — used as the default so nothing changes for existing events).
-- 'contain' shows the whole image without cropping, for flyer/poster covers
-- where cropping cuts off text.
alter table events add column if not exists image_fit text not null default 'cover';
alter table events drop constraint if exists events_image_fit_check;
alter table events add constraint events_image_fit_check check (image_fit in ('cover', 'contain'));
