-- Reading List: video becomes an independent optional link (any item can have
-- a video attached alongside its type), not a mutually-exclusive Item Type
alter table reading_list add column if not exists video_url text;

alter table reading_list drop constraint if exists reading_list_item_type_check;
alter table reading_list
  add constraint reading_list_item_type_check
  check (item_type in ('book', 'thesis_ma', 'thesis_phd', 'bookstore'));
