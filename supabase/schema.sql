-- SynapseMed: armazenamento na nuvem com acesso restrito.
-- Execute este arquivo uma vez no Supabase: Dashboard → SQL Editor → New query → Run.
-- (Já aplicado no projeto atual; serve de referência para recriar o banco.)
--
-- Cada linha de user_storage espelha uma chave que o app antes guardava só no
-- localStorage (ex.: synapsemed_activities, medway_content_overrides). O valor
-- é o texto exatamente como o app grava (normalmente JSON serializado).
--
-- Acesso: só as contas listadas em public.allowed_users leem/gravam dados, e
-- novos cadastros são bloqueados no banco. Para liberar outra pessoa no futuro:
--   1) drop trigger block_new_signups on auth.users;   -- reabre cadastro
--   2) a pessoa cria a conta;
--   3) insert into public.allowed_users (user_id)
--        select id from auth.users where email = 'email@da.pessoa';
--   4) recrie o trigger (bloco "Bloqueio de cadastro" abaixo).

create table if not exists public.user_storage (
  user_id    uuid        not null references auth.users (id) on delete cascade,
  key        text        not null,
  value      text        not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);
alter table public.user_storage enable row level security;

-- Lista de contas autorizadas. RLS ligado e sem políticas: clientes não leem
-- nem alteram esta tabela (só o SQL Editor / service role).
create table if not exists public.allowed_users (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table public.allowed_users enable row level security;

insert into public.allowed_users (user_id)
select id from auth.users where email = 'leticiarzende.o@gmail.com'
on conflict do nothing;

-- Funções auxiliares ficam no schema "private", fora da API pública.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.is_allowed_user()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.allowed_users where user_id = (select auth.uid())
  );
$$;
revoke all on function private.is_allowed_user() from public, anon;
grant execute on function private.is_allowed_user() to authenticated;

-- Bloqueio de cadastro: qualquer novo usuário em auth.users é recusado.
create or replace function private.block_new_signups()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'Novos cadastros estão desativados no SynapseMed.';
end;
$$;

drop trigger if exists block_new_signups on auth.users;
create trigger block_new_signups
  before insert on auth.users
  for each row execute function private.block_new_signups();

-- Cada conta autorizada só enxerga e altera as próprias linhas.
drop policy if exists "user_storage_select_own" on public.user_storage;
create policy "user_storage_select_own" on public.user_storage
  for select to authenticated
  using ((select auth.uid()) = user_id and (select private.is_allowed_user()));

drop policy if exists "user_storage_insert_own" on public.user_storage;
create policy "user_storage_insert_own" on public.user_storage
  for insert to authenticated
  with check ((select auth.uid()) = user_id and (select private.is_allowed_user()));

drop policy if exists "user_storage_update_own" on public.user_storage;
create policy "user_storage_update_own" on public.user_storage
  for update to authenticated
  using ((select auth.uid()) = user_id and (select private.is_allowed_user()))
  with check ((select auth.uid()) = user_id and (select private.is_allowed_user()));

drop policy if exists "user_storage_delete_own" on public.user_storage;
create policy "user_storage_delete_own" on public.user_storage
  for delete to authenticated
  using ((select auth.uid()) = user_id and (select private.is_allowed_user()));
