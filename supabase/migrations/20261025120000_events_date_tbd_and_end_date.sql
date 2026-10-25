-- Events: allow a "date TBD" event (no start date) and an optional finish
-- date/time. A null event_date means the date hasn't been announced yet.
alter table events alter column event_date drop not null;
alter table events add column if not exists event_end_date timestamptz;
