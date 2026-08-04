-- Add description and email fields to bookstores
alter table bookstores add column if not exists description text;
alter table bookstores add column if not exists email text;
