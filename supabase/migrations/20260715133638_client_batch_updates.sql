-- Reading List: fix item_type drift (live DB already allows 'bookstore' though the
-- tracked migration never included it) + add 'video'
alter table reading_list drop constraint if exists reading_list_item_type_check;
alter table reading_list
  add constraint reading_list_item_type_check
  check (item_type in ('book', 'thesis_ma', 'thesis_phd', 'bookstore', 'video'));

-- Research: per-entry contact email (Call for Participants / Call for Papers only)
alter table research_posts add column if not exists email text;

-- Research: add 'current-issues' to the (previously untracked) category check constraint
alter table research_posts drop constraint if exists research_posts_category_check;
alter table research_posts
  add constraint research_posts_category_check
  check (category in (
    'announcements', 'call-for-papers', 'recent-publications',
    'reports', 'research-institutes', 'sexual-abuse-boys-men', 'current-issues'
  ));
