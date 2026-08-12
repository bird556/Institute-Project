-- Extends the per-item cover image fit setting to Research and Directory.
-- 'cover' crops to fill the frame, 'contain' shows the whole image without
-- cropping. Both already have runtime auto-detect fallbacks (aspect-ratio
-- mismatch on Research cards, small-image fallback on Directory
-- psychotherapist cards) — those stay in place as safety nets and only ever
-- escalate cover -> contain (or contain -> cover for the psychotherapist
-- case); this column adds an explicit admin override on top, defaulting to
-- whatever each category already looks like today so nothing changes until
-- an admin opts an item into the other setting.

alter table research_posts add column if not exists image_fit text not null default 'cover';
alter table research_posts drop constraint if exists research_posts_image_fit_check;
alter table research_posts add constraint research_posts_image_fit_check check (image_fit in ('cover', 'contain'));

-- Research Institutes covers are logos, already forced to 'contain' in the
-- app today (hardcoded CONTAIN_CATEGORIES in ResearchCard.tsx) — backfill to
-- match, so switching that hardcode over to this column is a no-op visually.
update research_posts set image_fit = 'contain' where category = 'research-institutes';

alter table directory_entries add column if not exists image_fit text not null default 'contain';
alter table directory_entries drop constraint if exists directory_entries_image_fit_check;
alter table directory_entries add constraint directory_entries_image_fit_check check (image_fit in ('cover', 'contain'));
