-- Research: optional downloadable document (PDF/DOC/DOCX), same pattern as
-- events.doc_path / wellness_posts.doc_path. Used by Call for Participants
-- and Call for Papers entries.
alter table research_posts add column if not exists doc_path text;
