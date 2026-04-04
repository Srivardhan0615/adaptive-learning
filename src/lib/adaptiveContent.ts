import type {
  ConceptMastery,
  ConceptPerformance,
  ContentVariant,
  ContentVariantType,
  Lesson,
  LessonContent,
  PersonalizedStudyPlan,
  TestSession,
} from '../types';

function emphasizeKeyword(text: string, keyword: string) {
  return text.replace(new RegExp(keyword, 'gi'), (match) => `[${match}]`);
}

function formatConceptLabel(concept: string) {
  return concept.replace(/_/g, ' ');
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function estimateProjectedGain(finalScore: number, weakItems: ConceptPerformance[], developingItems: ConceptPerformance[]) {
  if (weakItems.length > 0) {
    const avgWeakGap =
      weakItems.reduce((sum, item) => sum + Math.max(0, 70 - item.accuracy), 0) / weakItems.length;
    return clamp(Math.round(avgWeakGap * 0.45 + weakItems.length * 4), 12, 30);
  }

  if (developingItems.length > 0) {
    const avgDevelopingGap =
      developingItems.reduce((sum, item) => sum + Math.max(0, 75 - item.accuracy), 0) / developingItems.length;
    return clamp(Math.round(avgDevelopingGap * 0.28 + developingItems.length * 2), 8, 18);
  }

  return clamp(Math.round((100 - finalScore) * 0.15), 5, 12);
}

export function buildPersonalizedStudyPlan(
  lesson: Lesson,
  conceptBreakdown: ConceptPerformance[],
  finalScore: number,
): PersonalizedStudyPlan {
  const weakItems = conceptBreakdown.filter((concept) => concept.accuracy < 50);
  const developingItems = conceptBreakdown.filter((concept) => concept.accuracy >= 50 && concept.accuracy < 70);
  const strongItems = conceptBreakdown.filter((concept) => concept.accuracy >= 70);
  const variantType: PersonalizedStudyPlan['variant_type'] =
    weakItems.length > 0 ? 'simplified' : strongItems.length === conceptBreakdown.length && conceptBreakdown.length > 0 ? 'accelerated' : 'default';

  const focusItems = (weakItems.length ? weakItems : developingItems.length ? developingItems : strongItems).slice(0, 3);
  const focusConcepts = focusItems.map((item) => item.tag);
  const projectedScoreGain = estimateProjectedGain(finalScore, weakItems, developingItems);
  const targetScore = clamp(finalScore + projectedScoreGain, 0, 100);
  const focusLabel = focusConcepts.map(formatConceptLabel).join(', ') || formatConceptLabel(lesson.concept_tag);

  const headline =
    variantType === 'simplified'
      ? `Rebuild ${focusLabel} and you can realistically add about ${projectedScoreGain}% to your score.`
      : variantType === 'accelerated'
        ? `You are ready to push ${focusLabel} to a higher level and target about ${projectedScoreGain}% more.`
        : `Sharpen ${focusLabel} and your next score can improve by about ${projectedScoreGain}%.`;

  const summary =
    variantType === 'simplified'
      ? `Your last test showed that ${focusLabel} is holding your score back. This lesson now slows the pace, uses clearer explanations, and targets the exact gaps that matter most.`
      : variantType === 'accelerated'
        ? `Your current accuracy is stable, so this lesson now trims repetition and pushes you toward faster transfer and stronger JEE-level pattern recognition.`
        : `Your performance is in the developing range. This lesson now stays in standard mode, but it is tuned around the concepts that can move your score from ${finalScore}% toward ${targetScore}%.`;

  const actionSteps =
    variantType === 'simplified'
      ? [
          `Relearn ${formatConceptLabel(focusConcepts[0] ?? lesson.concept_tag)} with smaller steps before timing yourself.`,
          'Solve 3 untimed examples and explain why each step is valid.',
          `Retest this topic after revision to target ${targetScore}% or better.`,
        ]
      : variantType === 'accelerated'
        ? [
            `Convert ${formatConceptLabel(focusConcepts[0] ?? lesson.concept_tag)} into mixed-problem practice.`,
            'Reduce written steps and look for faster pattern recognition.',
            `Push the next attempt toward ${targetScore}% by solving harder variants first.`,
          ]
        : [
            `Review ${formatConceptLabel(focusConcepts[0] ?? lesson.concept_tag)} before taking the next timed test.`,
            'Use the worked example to compare your method with the ideal method.',
            `A cleaner revision pass here can raise your next score toward ${targetScore}%.`,
          ];

  return {
    variant_type: variantType,
    headline,
    summary,
    focus_concepts: focusConcepts,
    action_steps: actionSteps,
    projected_score_gain: projectedScoreGain,
    target_score: targetScore,
  };
}

function buildSimplifiedContent(
  content: LessonContent,
  weakConcept: string,
  weakConcepts: string[] = [],
  studyPlan?: PersonalizedStudyPlan,
): LessonContent {
  const conceptLabel = formatConceptLabel(weakConcept);
  const focusList = weakConcepts.length
    ? weakConcepts.map((concept) => formatConceptLabel(concept)).join(', ')
    : conceptLabel;

  return {
    big_idea: studyPlan?.headline ?? `Master ${conceptLabel} with smaller steps, clearer examples, and targeted support.`,
    explanation: `Quick visual: picture ${conceptLabel} as a guided path with one checkpoint at a time.\n\n${content.explanation
      .split('.')
      .slice(0, 3)
      .map((sentence) => sentence.trim())
      .filter(Boolean)
      .map((sentence) => `- ${sentence}.`)
      .join('\n')}\n\nFocus areas from your last test: ${focusList}.\nProjected score lift after this revision: about ${studyPlan?.projected_score_gain ?? 20}%.\nRemember: move one idea at a time, then check your reasoning before going on.`,
    worked_example: `Worked path:\n1. Read the prompt and underline what is changing.\n2. Match the problem to the right operation or idea.\n3. Solve in one small move.\n4. Check the answer against the question.\n\nCoach note:\n${content.remember_points[0] ?? 'Go slowly and check each step.'}\n\nAnalogy:\nThink of ${conceptLabel} like following signs through an airport. If you take one sign at a time, you do not get lost.`,
    key_skills: content.key_skills.slice(0, 3).map((skill) => `Step-by-step ${skill.toLowerCase()}`),
    remember_points: [
      `Remember: ${content.remember_points[0] ?? 'Use one small step at a time.'}`,
      studyPlan
        ? `If you strengthen ${focusList}, your next score can move toward ${studyPlan.target_score}%.`
        : `If you strengthen ${focusList}, your next score can rise noticeably.`,
      `Highlight the key word in [color]: ${emphasizeKeyword(conceptLabel, conceptLabel.split(' ')[0] ?? conceptLabel)}`,
      'Pause after each step and check if the answer still matches the question.',
    ],
    quick_check: content.quick_check,
  };
}

function buildAcceleratedContent(content: LessonContent, conceptTag: string, studyPlan?: PersonalizedStudyPlan): LessonContent {
  const conceptLabel = formatConceptLabel(conceptTag);
  return {
    big_idea: studyPlan?.headline ?? `Push beyond the basics of ${conceptLabel} and learn the pattern behind the procedure.`,
    explanation: `You are in accelerated mode, so the lesson is shorter and more analytical.\n\nStart by spotting the rule, then compare two cases that look similar but require different reasoning. That is how fast learners build transfer, not just repetition.\n\nProjected upside from stretching this topic well: about ${studyPlan?.projected_score_gain ?? 10}%.`,
    worked_example: `${content.worked_example}\n\nChallenge extension:\n- Solve it mentally first.\n- Explain why your method works.\n- Create a harder version that uses the same pattern.\n\nNext question:\nHow could ${conceptLabel} appear in a more advanced or real-world setting?`,
    key_skills: [...content.key_skills, 'Challenge reasoning', 'Explaining patterns'],
    remember_points: [
      'Try mental reasoning before writing every step.',
      studyPlan
        ? `A stronger command here can push your next score toward ${studyPlan.target_score}%.`
        : 'A stronger command here can raise your next score.',
      'Look for shortcuts, exceptions, or edge cases.',
      `Next up: extend ${conceptLabel} into a more advanced topic.`,
    ],
    quick_check: content.quick_check,
  };
}

function buildDefaultContent(content: LessonContent, studyPlan?: PersonalizedStudyPlan): LessonContent {
  if (!studyPlan) {
    return content;
  }

  return {
    ...content,
    big_idea: studyPlan.headline,
    explanation: `${studyPlan.summary}\n\n${content.explanation}\n\nPersonalized target: if you revise ${studyPlan.focus_concepts.map(formatConceptLabel).join(', ')}, your score can move from the last attempt toward ${studyPlan.target_score}%.`,
    worked_example: `${content.worked_example}\n\nWhat to watch this time:\n- ${studyPlan.action_steps.join('\n- ')}`,
    remember_points: [...studyPlan.action_steps, ...content.remember_points].slice(0, 4),
  };
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
  studyPlan?: PersonalizedStudyPlan,
): LessonContent {
  if (variantType === 'simplified') {
    return buildSimplifiedContent(lesson.content_json, weakConcept, [weakConcept], studyPlan);
  }
  if (variantType === 'accelerated') {
    return buildAcceleratedContent(lesson.content_json, lesson.concept_tag, studyPlan);
  }
  return buildDefaultContent(lesson.content_json, studyPlan);
}

export function generateAdaptiveLessonVariant(
  lesson: Lesson,
  conceptBreakdown: ConceptPerformance[],
  finalScore: number,
  weakConcepts: string[],
  strongConcepts: string[],
): ContentVariant {
  const studyPlan = buildPersonalizedStudyPlan(lesson, conceptBreakdown, finalScore);
  const variantType: ContentVariant['variant_type'] = studyPlan.variant_type;

  const content =
    variantType === 'simplified'
      ? buildSimplifiedContent(lesson.content_json, weakConcepts[0] ?? lesson.concept_tag, weakConcepts, studyPlan)
      : variantType === 'accelerated'
        ? buildAcceleratedContent(lesson.content_json, lesson.concept_tag, studyPlan)
        : buildDefaultContent(lesson.content_json, studyPlan);

  return {
    user_id: '',
    lesson_id: lesson.id,
    concept_tag: lesson.concept_tag,
    variant_type: variantType,
    content_json: content,
    weak_concepts: weakConcepts,
    study_plan: studyPlan,
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
