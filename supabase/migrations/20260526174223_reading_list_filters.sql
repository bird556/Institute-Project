-- Add author_region and item_type filter columns to reading_list

alter table reading_list
  add column if not exists author_region text check (author_region in ('canadian', 'world')),
  add column if not exists item_type text check (item_type in ('book', 'thesis_ma', 'thesis_phd'));
