-- SynapseMed: armazenamento na nuvem por usuário.
-- Execute este arquivo uma vez no Supabase: Dashboard → SQL Editor → New query → Run.
--
-- Cada linha espelha uma chave que o app antes guardava só no localStorage
-- (ex.: synapsemed_activities, medway_content_overrides). O valor é o texto
-- exatamente como o app grava (normalmente JSON serializado).

create table if not exists public.user_storage (
  user_id    uuid        not null references auth.users (id) on delete cascade,
  key        text        not null,
  value      text        not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

alter table public.user_storage enable row level security;

-- Cada pessoa só enxerga e altera as próprias linhas.
drop policy if exists "user_storage_select_own" on public.user_storage;
create policy "user_storage_select_own" on public.user_storage
  for select using ((select auth.uid()) = user_id);

drop policy if exists "user_storage_insert_own" on public.user_storage;
create policy "user_storage_insert_own" on public.user_storage
  for insert with check ((select auth.uid()) = user_id);

drop policy if exists "user_storage_update_own" on public.user_storage;
create policy "user_storage_update_own" on public.user_storage
  for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "user_storage_delete_own" on public.user_storage;
create policy "user_storage_delete_own" on public.user_storage
  for delete using ((select auth.uid()) = user_id);
