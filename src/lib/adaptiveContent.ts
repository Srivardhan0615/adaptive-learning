import type { ConceptMastery, ConceptPerformance, ContentVariant, ContentVariantType, Lesson, LessonContent, TestSession } from '../types';

function emphasizeKeyword(text: string, keyword: string) {
  return text.replace(new RegExp(keyword, 'gi'), (match) => `[${match}]`);
}

function buildSimplifiedContent(
  content: LessonContent,
  weakConcept: string,
  weakConcepts: string[] = [],
): LessonContent {
  const conceptLabel = weakConcept.replace(/_/g, ' ');
  const focusList = weakConcepts.length
    ? weakConcepts.map((concept) => concept.replace(/_/g, ' ')).join(', ')
    : conceptLabel;

  return {
    big_idea: `Master ${conceptLabel} with smaller steps, clearer examples, and targeted support.`,
    explanation: `Quick visual: picture ${conceptLabel} as a guided path with one checkpoint at a time.\n\n${content.explanation
      .split('.')
      .slice(0, 3)
      .map((sentence) => sentence.trim())
      .filter(Boolean)
      .map((sentence) => `- ${sentence}.`)
      .join('\n')}\n\nFocus areas from your last test: ${focusList}.\nRemember: move one idea at a time, then check your reasoning before going on.`,
    worked_example: `Worked path:\n1. Read the prompt and underline what is changing.\n2. Match the problem to the right operation or idea.\n3. Solve in one small move.\n4. Check the answer against the question.\n\nCoach note:\n${content.remember_points[0] ?? 'Go slowly and check each step.'}\n\nAnalogy:\nThink of ${conceptLabel} like following signs through an airport. If you take one sign at a time, you do not get lost.`,
    key_skills: content.key_skills.slice(0, 3).map((skill) => `Step-by-step ${skill.toLowerCase()}`),
    remember_points: [
      `Remember: ${content.remember_points[0] ?? 'Use one small step at a time.'}`,
      `Highlight the key word in [color]: ${emphasizeKeyword(conceptLabel, conceptLabel.split(' ')[0] ?? conceptLabel)}`,
      'Pause after each step and check if the answer still matches the question.',
    ],
    quick_check: content.quick_check,
  };
}

function buildAcceleratedContent(content: LessonContent, conceptTag: string): LessonContent {
  const conceptLabel = conceptTag.replace(/_/g, ' ');
  return {
    big_idea: `Push beyond the basics of ${conceptLabel} and learn the pattern behind the procedure.`,
    explanation: `You are in accelerated mode, so the lesson is shorter and more analytical.\n\nStart by spotting the rule, then compare two cases that look similar but require different reasoning. That is how fast learners build transfer, not just repetition.`,
    worked_example: `${content.worked_example}\n\nChallenge extension:\n- Solve it mentally first.\n- Explain why your method works.\n- Create a harder version that uses the same pattern.\n\nNext question:\nHow could ${conceptLabel} appear in a more advanced or real-world setting?`,
    key_skills: [...content.key_skills, 'Challenge reasoning', 'Explaining patterns'],
    remember_points: [
      'Try mental reasoning before writing every step.',
      'Look for shortcuts, exceptions, or edge cases.',
      `Next up: extend ${conceptLabel} into a more advanced topic.`,
    ],
    quick_check: content.quick_check,
  };
}

function buildDefaultContent(content: LessonContent): LessonContent {
  return content;
}

export function determineVariantType(accuracy: number): ContentVariant['variant_type'] {
  if (accuracy < 40) {
    return 'simplified';
  }
  if (accuracy > 80) {
    return 'accelerated';
  }
  return 'default';
}

export function analyzeConceptPerformance(answers: TestSession['answers']): ConceptPerformance[] {
  const conceptStats: Record<string, { correct: number; total: number }> = {};

  answers.forEach((answer) => {
    if (!conceptStats[answer.concept_tag]) {
      conceptStats[answer.concept_tag] = { correct: 0, total: 0 };
    }
    conceptStats[answer.concept_tag].total += 1;
    if (answer.correct) {
      conceptStats[answer.concept_tag].correct += 1;
    }
  });

  return Object.entries(conceptStats).map(([tag, stats]) => {
    const accuracy = Math.round((stats.correct / stats.total) * 100);
    let status: ConceptPerformance['status'] = 'developing';
    if (accuracy >= 90) {
      status = 'mastered';
    } else if (accuracy >= 70) {
      status = 'strong';
    } else if (accuracy < 50) {
      status = 'weak';
    }

    return {
      tag,
      correct: stats.correct,
      total: stats.total,
      accuracy,
      status,
    };
  });
}

export function categorizeConcepts(concepts: ConceptPerformance[]) {
  return {
    strongConcepts: concepts.filter((concept) => concept.accuracy >= 70).map((concept) => concept.tag),
    weakConcepts: concepts.filter((concept) => concept.accuracy < 50).map((concept) => concept.tag),
    developingConcepts: concepts.filter((concept) => concept.accuracy >= 50 && concept.accuracy < 70).map((concept) => concept.tag),
  };
}

export function generateVariantContent(
  lesson: Lesson,
  variantType: ContentVariant['variant_type'],
  weakConcept: string,
): LessonContent {
  if (variantType === 'simplified') {
    return buildSimplifiedContent(lesson.content_json, weakConcept, [weakConcept]);
  }
  if (variantType === 'accelerated') {
    return buildAcceleratedContent(lesson.content_json, lesson.concept_tag);
  }
  return buildDefaultContent(lesson.content_json);
}

export function generateAdaptiveLessonVariant(
  lesson: Lesson,
  weakConcepts: string[],
  strongConcepts: string[],
): ContentVariant {
  const variantType: ContentVariant['variant_type'] =
    weakConcepts.length > 0 ? 'simplified' : strongConcepts.length > 0 ? 'accelerated' : 'default';

  const content =
    variantType === 'simplified'
      ? buildSimplifiedContent(lesson.content_json, weakConcepts[0] ?? lesson.concept_tag, weakConcepts)
      : variantType === 'accelerated'
        ? buildAcceleratedContent(lesson.content_json, lesson.concept_tag)
        : lesson.content_json;

  return {
    user_id: '',
    lesson_id: lesson.id,
    concept_tag: lesson.concept_tag,
    variant_type: variantType,
    content_json: content,
    weak_concepts: weakConcepts,
    created_at: new Date().toISOString(),
  };
}

export function buildVariantRecord(userId: string, lesson: Lesson, accuracy: number): ContentVariant {
  const variantType = determineVariantType(accuracy);
  return {
    user_id: userId,
    lesson_id: lesson.id,
    concept_tag: lesson.concept_tag,
    variant_type: variantType,
    content_json: generateVariantContent(lesson, variantType, lesson.concept_tag),
    weak_concepts: accuracy < 50 ? [lesson.concept_tag] : [],
    created_at: new Date().toISOString(),
  };
}

export function buildConceptMasteryRecords(userId: string, concepts: ConceptPerformance[]): ConceptMastery[] {
  return concepts.map((concept) => ({
    user_id: userId,
    concept_tag: concept.tag,
    accuracy_score: concept.accuracy,
    attempts_count: concept.total,
    last_tested: new Date().toISOString(),
    status: concept.status,
  }));
}

export function getVariantBadgeLabel(variant: ContentVariantType) {
  if (variant === 'simplified') {
    return 'Support Mode';
  }
  if (variant === 'accelerated') {
    return 'Accelerated Mode';
  }
  if (variant === 'remedial') {
    return 'Remedial Mode';
  }
  return 'Standard Mode';
}

export function getVariantWhyMessage(variant: ContentVariantType) {
  if (variant === 'simplified') {
    return 'This lesson was regenerated because recent answers showed you need smaller steps, extra scaffolding, and a slower pacing on this concept.';
  }
  if (variant === 'accelerated') {
    return 'This lesson was regenerated because recent answers showed strong mastery, so repetition was reduced and challenge was increased.';
  }
  if (variant === 'remedial') {
    return 'This lesson is in remedial mode to rebuild the foundation before returning you to the standard path.';
  }
  return 'You are seeing the standard lesson because your recent concept performance stayed in the developing range.';
}

export function buildSimplifiedPrompt(originalContent: LessonContent, weakConcept: string) {
  return `
Rewrite this lesson content for a struggling student.
Focus heavily on the concept: "${weakConcept}"

Original: ${JSON.stringify(originalContent)}

Rules:
1. Use grade 4 reading level
2. Add 2-3 relatable analogies (sports, food, daily life)
3. Break long paragraphs into bullet points
4. Bold key terms
5. Add a "Quick Visual" description

Return JSON format:
{
  "big_idea": "...",
  "explanation": "...",
  "worked_example": "...",
  "key_skills": ["...", "..."],
  "remember_points": ["...", "..."],
  "quick_check": []
}
`.trim();
}

export async function generateSimplifiedContent(
  originalContent: LessonContent,
  weakConcept: string,
): Promise<LessonContent> {
  const endpoint = import.meta.env.VITE_ADAPTLEARN_GENERATE_ENDPOINT;
  if (endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: buildSimplifiedPrompt(originalContent, weakConcept) }),
      });
      if (response.ok) {
        return (await response.json()) as LessonContent;
      }
    } catch {
      // Fall back to template generation when no backend is available.
    }
  }

  return buildSimplifiedContent(originalContent, weakConcept);
}
