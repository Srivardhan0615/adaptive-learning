create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  learner_type text check (learner_type in ('fast', 'steady', 'support_focused')),
  current_level text default 'intermediate',
  ability_score float default 50,
  created_at timestamp default now()
);

alter table profiles enable row level security;
drop policy if exists "Users can view own profile" on profiles;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
drop policy if exists "Users can insert own profile" on profiles;
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

drop table if exists concept_mastery cascade;
drop table if exists lesson_variants cascade;
drop table if exists user_progress cascade;
drop table if exists topic_tests cascade;
drop table if exists test_sessions cascade;
drop table if exists questions cascade;
drop table if exists lessons cascade;
drop table if exists topics cascade;
drop table if exists chapters cascade;
drop table if exists subjects cascade;

create table if not exists subjects (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  name text not null,
  description text,
  category text,
  estimated_minutes int,
  icon text,
  color text
);

alter table subjects enable row level security;
drop policy if exists "Anyone can view subjects" on subjects;
create policy "Anyone can view subjects" on subjects for select using (true);

create table if not exists chapters (
  id uuid default gen_random_uuid() primary key,
  subject_id uuid references subjects(id) on delete cascade,
  title text not null,
  description text,
  chapter_number int not null,
  estimated_hours int,
  difficulty_level text check (difficulty_level in ('beginner', 'intermediate', 'advanced')),
  prerequisites text[] default '{}',
  learning_objectives text[] default '{}'
);

alter table chapters enable row level security;
drop policy if exists "Anyone can view chapters" on chapters;
create policy "Anyone can view chapters" on chapters for select using (true);

create table if not exists topics (
  id uuid default gen_random_uuid() primary key,
  chapter_id uuid references chapters(id) on delete cascade,
  title text not null,
  description text,
  topic_number int not null,
  estimated_minutes int,
  difficulty int check (difficulty between 1 and 5),
  key_concepts text[] default '{}',
  prerequisites text[] default '{}'
);

alter table topics enable row level security;
drop policy if exists "Anyone can view topics" on topics;
create policy "Anyone can view topics" on topics for select using (true);

create table if not exists lessons (
  id uuid default gen_random_uuid() primary key,
  subject_id uuid references subjects(id) on delete cascade,
  chapter_id uuid references chapters(id) on delete cascade,
  topic_id uuid references topics(id) on delete cascade,
  concept_tag text not null,
  title text not null,
  content_json jsonb not null,
  difficulty int check (difficulty between 1 and 5),
  version int default 1
);

alter table lessons enable row level security;
drop policy if exists "Anyone can view lessons" on lessons;
create policy "Anyone can view lessons" on lessons for select using (true);

create table if not exists questions (
  id uuid default gen_random_uuid() primary key,
  subject_id uuid references subjects(id) on delete cascade,
  chapter_id uuid references chapters(id) on delete cascade,
  topic_id uuid references topics(id) on delete cascade,
  concept_tag text not null,
  question_text text not null,
  options text[] not null,
  correct_answer int not null,
  difficulty int check (difficulty between 1 and 5),
  explanation text
);

alter table questions enable row level security;
drop policy if exists "Anyone can view questions" on questions;
create policy "Anyone can view questions" on questions for select using (true);

create table if not exists topic_tests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  subject_id uuid references subjects(id) on delete cascade,
  chapter_id uuid references chapters(id) on delete cascade,
  topic_id uuid references topics(id) on delete cascade,
  started_at timestamp default now(),
  completed_at timestamp,
  answers jsonb default '[]',
  score int default 0,
  ability_estimate float default 50,
  weak_concepts text[] default '{}',
  strong_concepts text[] default '{}',
  concept_breakdown jsonb default '[]',
  status text default 'in_progress' check (status in ('in_progress', 'completed'))
);

alter table topic_tests enable row level security;
drop policy if exists "Users can CRUD own topic tests" on topic_tests;
create policy "Users can CRUD own topic tests" on topic_tests
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists chapter_tests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  subject_id uuid references subjects(id) on delete cascade,
  chapter_id uuid references chapters(id) on delete cascade,
  started_at timestamp default now(),
  completed_at timestamp,
  answers jsonb default '[]',
  score int default 0,
  ability_estimate float default 50,
  weak_concepts text[] default '{}',
  strong_concepts text[] default '{}',
  status text default 'in_progress' check (status in ('in_progress', 'completed'))
);

alter table chapter_tests enable row level security;
drop policy if exists "Users can CRUD own chapter tests" on chapter_tests;
create policy "Users can CRUD own chapter tests" on chapter_tests
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  subject_id uuid references subjects(id) on delete cascade,
  chapter_id uuid references chapters(id) on delete cascade,
  topic_id uuid references topics(id) on delete cascade,
  lesson_id uuid references lessons(id) on delete cascade,
  status text default 'locked' check (status in ('locked', 'available', 'in_progress', 'completed', 'mastered')),
  mastery_percent int default 0,
  last_accessed timestamp,
  content_variant text default 'default' check (content_variant in ('default', 'simplified', 'accelerated'))
);

alter table user_progress enable row level security;
drop policy if exists "Users can CRUD own progress" on user_progress;
create policy "Users can CRUD own progress" on user_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists lesson_variants (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  lesson_id uuid references lessons(id) on delete cascade,
  topic_id uuid references topics(id) on delete cascade,
  concept_tag text not null,
  variant_type text check (variant_type in ('default', 'simplified', 'accelerated')),
  content_json jsonb not null,
  weak_concepts text[] default '{}',
  created_at timestamp default now()
);

alter table lesson_variants enable row level security;
drop policy if exists "Users can CRUD own variants" on lesson_variants;
create policy "Users can CRUD own variants" on lesson_variants
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists concept_mastery (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  subject_id uuid references subjects(id) on delete cascade,
  chapter_id uuid references chapters(id) on delete cascade,
  topic_id uuid references topics(id) on delete cascade,
  concept_tag text not null,
  accuracy_score int,
  attempts_count int default 0,
  last_tested timestamp,
  status text check (status in ('weak', 'developing', 'strong', 'mastered'))
);

alter table concept_mastery enable row level security;
drop policy if exists "Users can CRUD own concept mastery" on concept_mastery;
create policy "Users can CRUD own concept mastery" on concept_mastery
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists idx_chapters_subject_id on chapters(subject_id);
create index if not exists idx_topics_chapter_id on topics(chapter_id);
create index if not exists idx_lessons_topic_id on lessons(topic_id);
create index if not exists idx_questions_topic_id on questions(topic_id);
create index if not exists idx_topic_tests_user_topic on topic_tests(user_id, topic_id);
create index if not exists idx_chapter_tests_user_chapter on chapter_tests(user_id, chapter_id);
create index if not exists idx_user_progress_user_topic on user_progress(user_id, topic_id);
create index if not exists idx_lesson_variants_user_lesson on lesson_variants(user_id, lesson_id);
create index if not exists idx_concept_mastery_user_topic on concept_mastery(user_id, topic_id, concept_tag);

insert into subjects (slug, name, description, category, estimated_minutes, icon, color)
values
('mathematics', 'Mathematics', 'Intermediate mathematics with algebra, geometry, trigonometry, calculus, statistics, and number theory.', 'Intermediate STEM', 720, 'Sigma', 'cyan'),
('physics', 'Physics', 'Mechanics, thermodynamics, electromagnetism, optics, modern physics, and wave behavior.', 'Intermediate STEM', 720, 'Waves', 'indigo'),
('chemistry', 'Chemistry', 'Organic, inorganic, physical, analytical, biochemistry, and environmental chemistry foundations.', 'Intermediate STEM', 720, 'Flask', 'emerald')
on conflict (slug) do nothing;

insert into chapters (subject_id, title, description, chapter_number, estimated_hours, difficulty_level, prerequisites, learning_objectives)
values
((select id from subjects where slug = 'mathematics'), 'Algebra Foundations', 'Expressions, equations, and functions for intermediate problem solving.', 1, 12, 'intermediate', '{"Basic arithmetic"}', '{"Model relationships","Solve equations","Interpret functions"}'),
((select id from subjects where slug = 'mathematics'), 'Geometry and Trigonometry', 'Coordinate geometry, triangles, circles, and trigonometric reasoning.', 2, 14, 'intermediate', '{"Algebra Foundations"}', '{"Visualize shapes","Use trigonometric ratios","Solve measurement problems"}'),
((select id from subjects where slug = 'physics'), 'Mechanics', 'Motion, forces, energy, and momentum in one connected chapter.', 1, 13, 'intermediate', '{"Basic algebra"}', '{"Describe motion","Apply Newtonian reasoning","Conserve energy"}'),
((select id from subjects where slug = 'physics'), 'Waves, Fields, and Heat', 'Thermal physics, wave behavior, and introductory electromagnetism.', 2, 14, 'intermediate', '{"Mechanics"}', '{"Compare heat transfer","Analyze waves","Interpret fields"}'),
((select id from subjects where slug = 'chemistry'), 'Atomic Structure and Bonding', 'Atomic theory, electron arrangement, periodic trends, and bonding.', 1, 12, 'intermediate', '{"Basic science"}', '{"Describe atoms","Use periodic trends","Predict bonding"}'),
((select id from subjects where slug = 'chemistry'), 'Reactions and Chemical Systems', 'Reaction classes, mole relationships, equilibrium, acids, and organic patterns.', 2, 15, 'intermediate', '{"Atomic Structure and Bonding"}', '{"Balance reactions","Reason with moles","Predict system behavior"}')
on conflict do nothing;

insert into topics (chapter_id, title, description, topic_number, estimated_minutes, difficulty, key_concepts, prerequisites)
values
((select id from chapters where title = 'Algebra Foundations' limit 1), 'Linear Equations', 'Solve one-variable linear equations and model situations algebraically.', 1, 55, 2, '{"Inverse operations","Balancing equations","Variable isolation"}', '{"Arithmetic operations"}'),
((select id from chapters where title = 'Algebra Foundations' limit 1), 'Quadratic Equations', 'Factor, interpret, and solve quadratic equations in multiple forms.', 2, 65, 3, '{"Factoring","Roots","Parabolas"}', '{"Linear Equations"}'),
((select id from chapters where title = 'Geometry and Trigonometry' limit 1), 'Trigonometric Ratios', 'Use sine, cosine, and tangent to solve right-triangle problems.', 3, 70, 4, '{"SOHCAHTOA","Angles","Right triangles"}', '{"Triangles and Congruence"}'),
((select id from chapters where title = 'Mechanics' limit 1), 'Kinematics', 'Describe motion using displacement, velocity, acceleration, and graphs.', 1, 55, 2, '{"Velocity","Acceleration","Motion graphs"}', '{"Basic algebra"}'),
((select id from chapters where title = 'Mechanics' limit 1), 'Newton’s Laws', 'Connect force, mass, and acceleration in everyday systems.', 2, 60, 3, '{"Net force","Inertia","Action-reaction"}', '{"Kinematics"}'),
((select id from chapters where title = 'Waves, Fields, and Heat' limit 1), 'Electromagnetism', 'Charge, electric fields, current, and magnetic effects.', 3, 70, 4, '{"Current","Potential difference","Magnetic fields"}', '{"Waves and Oscillations"}'),
((select id from chapters where title = 'Atomic Structure and Bonding' limit 1), 'Atomic Models', 'Trace the development of atomic theory and particle structure.', 1, 50, 2, '{"Subatomic particles","Atomic number","Mass number"}', '{"Basic science"}'),
((select id from chapters where title = 'Atomic Structure and Bonding' limit 1), 'Chemical Bonding', 'Ionic, covalent, and metallic bonding with structure-property links.', 3, 60, 3, '{"Ionic bonding","Covalent bonding","Metallic bonding"}', '{"Electron Configuration"}'),
((select id from chapters where title = 'Reactions and Chemical Systems' limit 1), 'Mole Concept', 'Count particles, convert mass, and use moles in equations.', 2, 65, 4, '{"Avogadro constant","Molar mass","Stoichiometry"}', '{"Reaction Types"}')
on conflict do nothing;
