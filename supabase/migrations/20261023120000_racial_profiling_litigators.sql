-- National Racial Profiling Litigator Database: new directory category
alter table directory_entries
  drop constraint if exists directory_entries_category_check;

alter table directory_entries
  add constraint directory_entries_category_check
  check (category in (
    'advocate', 'psychotherapist', 'referral_agency', 'black_mens_group',
    'youth_service_organization', 'community_organization',
    'racial_profiling_litigator'
  ));

insert into site_settings (key, value) values
  ('racial_profiling_litigators_enabled', 'true')
on conflict (key) do nothing;

insert into page_content (page, section, content) values
  ('racial-profiling-litigators', 'hero_title', 'National Racial Profiling Litigator Database'),
  ('racial-profiling-litigators', 'hero_subtitle', 'Welcome to Canada’s first National Racial Profiling Litigator Database. The purpose of this up-to-date and growing list of litigators is to provide access to justice and accountability for Canadians who have believe their race was a material factor interactions with police, private security and businesses.')
on conflict (page, section) do nothing;
