-- Research: add 'disabilities' and 'sexualities' to the category check constraint
alter table research_posts drop constraint if exists research_posts_category_check;
alter table research_posts
  add constraint research_posts_category_check
  check (category in (
    'announcements', 'call-for-papers', 'recent-publications', 'reports',
    'research-institutes', 'sexual-abuse-boys-men', 'current-issues',
    'disabilities', 'sexualities'
  ));
