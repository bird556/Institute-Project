-- Extends the per-item cover image fit setting (shipped for events) to
-- Blogs, Reading List, and Partners. 'cover' crops to fill the frame,
-- 'contain' shows the whole image without cropping.
--
-- Blogs and Reading List default to 'cover' — matches today's behavior on
-- their grid/row thumbnails, so nothing changes visually until an admin
-- opts an item into 'contain'.
--
-- Partners defaults to 'contain' — partner logos are already rendered with
-- object-contain everywhere today (cards, detail page), so this preserves
-- current behavior too, while letting an admin flip an individual partner
-- to 'cover' if they ever upload a photo-style logo that should fill the frame.

alter table blog_posts add column if not exists image_fit text not null default 'cover';
alter table blog_posts drop constraint if exists blog_posts_image_fit_check;
alter table blog_posts add constraint blog_posts_image_fit_check check (image_fit in ('cover', 'contain'));

alter table reading_list add column if not exists image_fit text not null default 'cover';
alter table reading_list drop constraint if exists reading_list_image_fit_check;
alter table reading_list add constraint reading_list_image_fit_check check (image_fit in ('cover', 'contain'));

alter table partners add column if not exists image_fit text not null default 'contain';
alter table partners drop constraint if exists partners_image_fit_check;
alter table partners add constraint partners_image_fit_check check (image_fit in ('cover', 'contain'));
