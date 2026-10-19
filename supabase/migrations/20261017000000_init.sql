-- Schema ban đầu cho app Sinh Nhật Âm/Dương.
-- Ngày dương quy đổi KHÔNG được lưu: app luôn tự tính trên máy (UTC+7).

create table public.people (
  id             uuid primary key,                      -- tạo trên máy để ghi offline được
  user_id        uuid not null default auth.uid() references auth.users on delete cascade,
  name           text not null check (length(trim(name)) > 0),
  group_type     text not null default 'other' check (group_type in ('family', 'friend', 'work', 'other')),
  calendar_type  text not null check (calendar_type in ('solar', 'lunar')),
  day            smallint not null,
  month          smallint not null check (month between 1 and 12),
  year           smallint check (year between 1900 and 2199),   -- null = không biết năm
  is_leap_month  boolean not null default false,
  notify_enabled boolean not null default true,
  note           text,
  avatar_path    text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  deleted_at     timestamptz,                           -- xoá mềm để đồng bộ được việc xoá
  constraint people_day_range check (
    (calendar_type = 'solar' and day between 1 and 31) or
    (calendar_type = 'lunar' and day between 1 and 30)
  ),
  constraint people_leap_only_lunar check (calendar_type = 'lunar' or not is_leap_month)
);

create index people_user_updated_idx on public.people (user_id, updated_at);

create table public.user_settings (
  user_id            uuid primary key default auth.uid() references auth.users on delete cascade,
  remind_days_before smallint not null default 7 check (remind_days_before between 0 and 60),
  advance_time       time not null default '08:00',  -- giờ của thông báo nhắc trước; đúng ngày cố định 00:00
  feb29_rule         text not null default 'feb28' check (feb29_rule in ('feb28', 'mar1')),
  updated_at         timestamptz not null default now()
);

-- updated_at tự cập nhật khi sửa, trừ khi client gửi giá trị mới hơn (đồng bộ last-write-wins)
create function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.updated_at is not distinct from old.updated_at then
    new.updated_at := now();
  end if;
  return new;
end;
$$;

create trigger people_touch before update on public.people
  for each row execute function public.touch_updated_at();
create trigger user_settings_touch before update on public.user_settings
  for each row execute function public.touch_updated_at();

-- RLS: mỗi người chỉ thấy và sửa dữ liệu của chính mình
alter table public.people enable row level security;
alter table public.user_settings enable row level security;

create policy "people_select_own" on public.people for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "people_insert_own" on public.people for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "people_update_own" on public.people for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "people_delete_own" on public.people for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy "settings_select_own" on public.user_settings for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "settings_insert_own" on public.user_settings for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "settings_update_own" on public.user_settings for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
