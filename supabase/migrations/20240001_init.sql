-- Documents table: stores invoices and proposals per user
create table if not exists documents (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null default 'Untitled',
  document_type text not null default 'invoice',
  invoice_number text,
  status      text not null default 'draft', -- draft | sent | paid
  template_id text not null default 'minimal',
  data        jsonb not null default '{}',
  total       numeric(12, 2) default 0,
  client_name text default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Index for fast per-user queries
create index if not exists documents_user_id_idx on documents(user_id);
create index if not exists documents_updated_at_idx on documents(updated_at desc);

-- Row-level security: users can only see their own documents
alter table documents enable row level security;

create policy "Users can read own documents"
  on documents for select
  using (auth.uid() = user_id);

create policy "Users can insert own documents"
  on documents for insert
  with check (auth.uid() = user_id);

create policy "Users can update own documents"
  on documents for update
  using (auth.uid() = user_id);

create policy "Users can delete own documents"
  on documents for delete
  using (auth.uid() = user_id);

-- Auto-update updated_at on every row change
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger documents_updated_at
  before update on documents
  for each row execute function update_updated_at();
