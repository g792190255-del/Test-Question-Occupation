-- Anonymous submissions are validated here; raw answers are owner-only.
create table public.holland_roles (
  code text primary key, title text not null,
  keywords text[] not null check (cardinality(keywords)=3)
);
create table public.holland_results (
  run_id uuid primary key,
  write_key_hash bytea not null,
  participant_id uuid not null,
  version text not null check (version in ('brief','full')),
  instrument_version text not null,
  role_code text not null references public.holland_roles(code),
  report_title text not null, keywords text[] not null,
  scores jsonb not null, answers jsonb not null, preference jsonb not null,
  completed_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index holland_results_version_role on public.holland_results(version,role_code);
create index holland_results_participant on public.holland_results(participant_id,created_at desc);
alter table public.holland_roles enable row level security;
alter table public.holland_results enable row level security;
revoke all on public.holland_roles, public.holland_results from public, anon, authenticated;
comment on table public.holland_results is '匿名职业兴趣报告；仅管理员读取明细。participant_id 为浏览器标识，不代表已核验的自然人。';

insert into public.holland_roles(code,title,keywords) values
('RI','机械解谜师',array['动手验证','原理探索','问题排查']),
('RA','造物艺术家',array['创意造物','审美表达','实践制作']),
('RS','实践守护者',array['实际支持','细心照护','服务他人']),
('RE','行动开拓者',array['行动推动','资源协调','实践经营']),
('RC','精密工匠',array['精确执行','标准流程','品质把关']),
('IA','灵感探索者',array['好奇探索','创意思考','知识表达']),
('IS','成长研究员',array['理解他人','循证思考','成长支持']),
('IE','策略探索家',array['策略分析','机会识别','目标推动']),
('IC','系统解码者',array['逻辑分析','数据洞察','系统思考']),
('AS','心灵叙事者',array['共情表达','故事创作','情感连接']),
('AE','创意发起人',array['创意策划','传播影响','项目发起']),
('AC','秩序设计师',array['视觉表达','结构整理','细节打磨']),
('SE','社群领航员',array['人际连接','团队协作','社群推动']),
('SC','温暖协调员',array['细致支持','流程协调','可靠服务']),
('EC','项目指挥官',array['目标管理','计划执行','资源统筹']);

create function public.save_holland_result(payload jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid; v_key uuid; v_person uuid; v_version text; v_role text;
  v_completed timestamptz; v_map text; v_count integer; v_per integer;
  v_answers jsonb; v_interest jsonb; v_skills jsonb; v_preference jsonb;
  v_scores jsonb := '{}'; v_totals jsonb := '{}'; v_code text;
  v_total integer; v_min integer; v_other integer; v_title text; v_keywords text[];
  v_old public.holland_results%rowtype;
begin
  if jsonb_typeof(payload) is distinct from 'object' or octet_length(payload::text)>12000 then
    raise exception 'Invalid report';
  end if;
  v_id := (payload->>'run_id')::uuid;
  v_key := (payload->>'write_key')::uuid;
  v_person := (payload->>'participant_id')::uuid;
  v_version := payload->>'version'; v_role := payload->>'role_code';
  v_completed := (payload->>'completed_at')::timestamptz;
  if v_id is null or v_key is null or v_person is null or v_completed is null
     or not isfinite(v_completed) or v_completed < '2000-01-01'::timestamptz
     or v_completed > now()+interval '5 minutes'
     or (payload->>'instrument_version') is distinct from 'holland-2026-09-v1' then
    raise exception 'Invalid report metadata';
  end if;
  if v_version='brief' then v_map:='RASICEIREACSACRSEI'; v_per:=3;
  elsif v_version='full' then v_map:='RRRRRRRRRRIIIIIIIIIIAAAAAAAAAASSSSSSSSSSEEEEEEEEEECCCCCCCCCC'; v_per:=10;
  else raise exception 'Invalid version'; end if;
  v_count:=length(v_map); v_answers:=payload->'answers';
  v_interest:=v_answers->'interest'; v_skills:=v_answers->'skills';
  v_preference:=payload->'preference';
  if jsonb_typeof(v_answers) is distinct from 'object'
    or jsonb_typeof(v_interest) is distinct from 'array'
    or jsonb_typeof(v_skills) is distinct from 'array'
    or jsonb_typeof(v_preference) is distinct from 'array' then raise exception 'Invalid answers'; end if;
  if jsonb_array_length(v_interest)<>v_count
    or exists(select 1 from jsonb_array_elements(v_interest) x where jsonb_typeof(x)<>'number' or x::text !~ '^[1-5]$')
    or jsonb_array_length(v_skills)>6
    or exists(select 1 from jsonb_array_elements(v_skills) x where jsonb_typeof(x)<>'string' or (x#>>'{}') !~ '^[RIASEC]$')
    or (select count(distinct x) from jsonb_array_elements(v_skills) x)<>jsonb_array_length(v_skills)
    or not (v_answers ? 'evidence_index')
    or ((v_answers->'evidence_index')<>'null'::jsonb and (v_answers->'evidence_index')::text !~ '^[0-3]$')
    or (v_version='brief' and v_answers->'evidence_index'='null'::jsonb)
    then raise exception 'Invalid answers'; end if;
  select title,keywords into v_title,v_keywords from public.holland_roles where code=v_role;
  if not found then raise exception 'Unknown role'; end if;
  foreach v_code in array array['R','I','A','S','E','C'] loop
    select sum((x.value#>>'{}')::integer) into v_total
      from jsonb_array_elements(v_interest) with ordinality x(value,n)
      where substr(v_map,x.n::integer,1)=v_code;
    v_totals:=v_totals||jsonb_build_object(v_code,v_total);
    v_scores:=v_scores||jsonb_build_object(v_code,jsonb_build_object('total',v_total,'count',v_per,'average',v_total::numeric/v_per,'max',v_per*5));
  end loop;
  select min(value::integer) into v_min from jsonb_each_text(v_totals) where strpos(v_role,key)>0;
  select max(value::integer) into v_other from jsonb_each_text(v_totals) where strpos(v_role,key)=0;
  if v_min<v_other then raise exception 'Role does not match scores'; end if;
  if jsonb_array_length(v_preference) not in (0,2)
    or (jsonb_array_length(v_preference)=2 and
      ((select count(distinct x) from jsonb_array_elements_text(v_preference) x)<>2
      or exists(select 1 from jsonb_array_elements_text(v_preference) x where length(x)<>1 or strpos(v_role,x)=0)))
    or (v_min=v_other and jsonb_array_length(v_preference)<>2) then raise exception 'Invalid tie preference'; end if;
  -- Serialize retries for one report. The write key never appears in returned data.
  perform pg_advisory_xact_lock(hashtextextended(v_id::text,0));
  select * into v_old from public.holland_results where run_id=v_id;
  if found then
    if v_old.write_key_hash<>sha256(convert_to(v_key::text,'UTF8'))
      or v_old.participant_id<>v_person or v_old.version<>v_version
      or v_old.role_code<>v_role or v_old.answers->'interest'<>v_interest
      or v_old.completed_at<>v_completed then raise exception 'Report conflict'; end if;
    update public.holland_results set answers=jsonb_build_object('interest',v_interest,'skills',v_skills,'evidence_index',v_answers->'evidence_index'),updated_at=now() where run_id=v_id;
  else
    insert into public.holland_results(run_id,write_key_hash,participant_id,version,instrument_version,role_code,report_title,keywords,scores,answers,preference,completed_at)
    values(v_id,sha256(convert_to(v_key::text,'UTF8')),v_person,v_version,'holland-2026-09-v1',v_role,v_title,v_keywords,v_scores,
      jsonb_build_object('interest',v_interest,'skills',v_skills,'evidence_index',v_answers->'evidence_index'),v_preference,v_completed);
  end if;
  return jsonb_build_object('saved',true,'run_id',v_id);
end;
$$;
revoke all on function public.save_holland_result(jsonb) from public,anon,authenticated;
grant execute on function public.save_holland_result(jsonb) to anon,authenticated;

create function public.holland_statistics(selected_version text default 'all')
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_result jsonb;
begin
  if selected_version is null or selected_version not in ('all','brief','full') then raise exception 'Invalid version'; end if;
  with filtered as (
    select participant_id,role_code,created_at,run_id from public.holland_results
    where selected_version='all' or version=selected_version
  ), latest as (
    select distinct on (participant_id) participant_id,role_code from filtered order by participant_id,created_at desc,run_id
  ), people as (select role_code,count(*) n from latest group by role_code),
  runs as (select role_code,count(*) n from filtered group by role_code),
  totals as (select (select count(*) from filtered) total_runs,(select count(*) from latest) total_participants)
  select jsonb_build_object('total_runs',t.total_runs,'total_participants',t.total_participants,'version',selected_version,
    'roles',(select jsonb_agg(jsonb_build_object('code',r.code,'title',r.title,'participants',coalesce(p.n,0),'runs',coalesce(s.n,0),
      'percentage',case when t.total_participants=0 then 0 else round(coalesce(p.n,0)*100.0/t.total_participants,1) end) order by coalesce(p.n,0) desc,r.code)
      from public.holland_roles r left join people p on p.role_code=r.code left join runs s on s.role_code=r.code))
  into v_result from totals t;
  return v_result;
end;
$$;
revoke all on function public.holland_statistics(text) from public,anon,authenticated;
grant execute on function public.holland_statistics(text) to anon,authenticated;
