-- Bookstores: new dedicated content type (physical/online bookstore
-- locations), separate from reading_list. Shown as a third section on the
-- public Reading List page.
create table if not exists bookstores (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  province     text,
  address      text,
  phone_number text,
  website_url  text,
  photo_path   text,
  published    boolean not null default false,
  sort_order   int not null default 0,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

alter table bookstores enable row level security;

create policy "Public can read published bookstores"
  on bookstores for select
  using (published = true);

create policy "Admin can read all bookstores"
  on bookstores for select
  to authenticated
  using (true);

create policy "Admin can insert bookstores"
  on bookstores for insert
  to authenticated
  with check (true);

create policy "Admin can update bookstores"
  on bookstores for update
  to authenticated
  using (true);

create policy "Admin can delete bookstores"
  on bookstores for delete
  to authenticated
  using (true);

-- Reading List: retire the old overloaded 'bookstore' item_type now that
-- Bookstores is its own proper feature. No live rows use it.
alter table reading_list drop constraint if exists reading_list_item_type_check;
alter table reading_list
  add constraint reading_list_item_type_check
  check (item_type in ('book', 'thesis_ma', 'thesis_phd'));
