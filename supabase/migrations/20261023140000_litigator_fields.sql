-- Racial Profiling Litigator Database: lawyer-specific fields on directory_entries
alter table directory_entries
  add column if not exists phone       text,
  add column if not exists city        text,
  add column if not exists fee_options text[] not null default '{}',
  add column if not exists languages   text[] not null default '{}';
