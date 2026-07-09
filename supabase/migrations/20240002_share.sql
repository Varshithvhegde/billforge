alter table documents add column if not exists share_token text unique;
alter table documents add column if not exists is_public boolean not null default false;
create index if not exists documents_share_token_idx on documents(share_token) where share_token is not null;

-- Allow anyone to read a document by its share_token if is_public = true
create policy "Public can read shared documents"
  on documents for select
  using (is_public = true and share_token is not null);
