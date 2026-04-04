export interface LessonContent {
  big_idea: string;
  explanation: string;
  worked_example: string;
  key_skills: string[];
  remember_points: string[];
  quick_check: { question: string; options: string[]; correct: number }[];
}

export type ContentVariantType = 'default' | 'simplified' | 'accelerated' | 'remedial';

export interface Chapter {
  id: string;
  subject_id: string;
  title: string;
  description: string;
  chapter_number: number;
  estimated_hours: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  learning_objectives: string[];
}

export interface Topic {
  id: string;
  chapter_id: string;
  subject_id: string;
  title: string;
  description: string;
  topic_number: number;
  estimated_minutes: number;
  difficulty: number;
  key_concepts: string[];
  prerequisites: string[];
}

export interface Lesson {
  id: string;
  subject_id: string;
  chapter_id: string;
  topic_id: string;
  concept_tag: string;
  title: string;
  content_json: LessonContent;
  difficulty: number;
  version?: number;
}

export interface Question {
  id: string;
  topic_id: string;
  chapter_id: string;
  concept_tag: string;
  question_text: string;
  options: string[];
  correct_answer: number;
  difficulty: number;
  explanation: string;
  subject_id: string;
  exam_name?: 'JEE Main' | 'JEE Advanced';
  exam_year?: number;
  paper_id?: string;
  paper_title?: string;
  source?: 'pyq' | 'generated';
}

export interface AnswerRecord {
  question_id: string;
  selected_option: number;
  correct: boolean;
  time_taken: number;
  concept_tag: string;
  difficulty: number;
}

export interface TestSession {
  id: string;
  user_id: string;
  subject_id: string;
  chapter_id: string;
  topic_id: string;
  started_at: string;
  completed_at?: string;
  answers: AnswerRecord[];
  final_score: number;
  ability_estimate: number;
  weak_concepts: string[];
  strong_concepts: string[];
  concept_breakdown?: ConceptPerformance[];
  status: 'in_progress' | 'completed';
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  category: string;
  estimated_minutes: number;
  icon: string;
  color: string;
  chapterCount: number;
  topicCount: number;
  difficultyLabel: 'Easy' | 'Medium' | 'Hard';
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  learner_type: 'fast' | 'steady' | 'support_focused';
  current_level: string;
  ability_score: number;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  topic_id: string;
  chapter_id: string;
  subject_id: string;
  status: 'locked' | 'available' | 'in_progress' | 'completed' | 'mastered';
  mastery_percent: number;
  last_accessed?: string;
  content_variant: 'default' | 'simplified' | 'accelerated';
}

export interface AbilityHistoryPoint {
  label: string;
  ability: number;
  score: number;
}

export interface ContentVariant {
  id?: string;
  user_id: string;
  lesson_id: string;
  topic_id?: string;
  variant_type: 'default' | 'simplified' | 'accelerated';
  concept_tag: string;
  content_json: LessonContent;
  weak_concepts: string[];
  created_at?: string;
}

export interface ConceptPerformance {
  tag: string;
  correct: number;
  total: number;
  accuracy: number;
  status: 'weak' | 'developing' | 'strong' | 'mastered';
}

export interface ConceptMastery {
  id?: string;
  user_id: string;
  concept_tag: string;
  accuracy_score: number;
  attempts_count: number;
  last_tested: string;
  status: 'weak' | 'developing' | 'strong' | 'mastered';
}
