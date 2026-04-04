import { Atom, BookOpen, Calculator, Clock3, FlaskConical, Sigma, Waves } from 'lucide-react';
import type { Chapter, Lesson, Profile, Question, Subject, TestSession, Topic, UserProgress } from '../types';

export const DEMO_USER_ID = 'demo-user';

export const iconMap = {
  Calculator,
  Atom,
  Clock: Clock3,
  Book: BookOpen,
  Flask: FlaskConical,
  Sigma,
  Waves,
};

export const sampleProfile: Profile = {
  id: DEMO_USER_ID,
  full_name: 'Ava Patel',
  email: 'ava@adaptlearn.dev',
  learner_type: 'steady',
  current_level: 'intermediate',
  ability_score: 62,
  created_at: new Date().toISOString(),
};

type ChapterSeed = {
  title: string;
  description: string;
  estimated_hours: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
};

type SubjectSeed = {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  difficultyLabel: 'Easy' | 'Medium' | 'Hard';
  chapters: ChapterSeed[];
};

const syllabusSeeds: SubjectSeed[] = [
  {
    id: 'subject-mathematics',
    name: 'Mathematics',
    description: 'Full JEE Main and Advanced mathematics syllabus with algebra, coordinate geometry, calculus, vectors, 3D geometry, and probability.',
    category: 'JEE Main + Advanced',
    icon: 'Sigma',
    color: 'cyan',
    difficultyLabel: 'Hard',
    chapters: [
      { title: 'Sets, Relations and Functions', description: 'Foundational language and function behavior for JEE mathematics.', estimated_hours: 10, difficulty_level: 'intermediate', topics: ['Sets and Subsets', 'Relations', 'Functions', 'Inverse Trigonometric Functions', 'Modulus and Greatest Integer Functions'] },
      { title: 'Quadratic Equations and Complex Numbers', description: 'Root behavior, transformed equations, and complex-plane reasoning.', estimated_hours: 12, difficulty_level: 'intermediate', topics: ['Quadratic Equations', 'Theory of Equations', 'Complex Number Algebra', 'Argand Plane', "De Moivre's Theorem"] },
      { title: 'Sequences, Series and Binomial Theorem', description: 'Progressions and expansion patterns used across algebra.', estimated_hours: 12, difficulty_level: 'intermediate', topics: ['Arithmetic Progression', 'Geometric Progression', 'Special Series', 'Binomial Expansion', 'Greatest Term'] },
      { title: 'Permutations, Combinations and Probability', description: 'Counting methods and probabilistic reasoning for competitive questions.', estimated_hours: 12, difficulty_level: 'advanced', topics: ['Counting Principle', 'Permutations', 'Combinations', 'Probability', 'Random Variables'] },
      { title: 'Matrices and Determinants', description: 'Matrix algebra, determinants, inverse, and systems of equations.', estimated_hours: 10, difficulty_level: 'intermediate', topics: ['Matrix Basics', 'Determinants', 'Inverse Matrix', 'Linear Systems', 'Matrix Transformations'] },
      { title: 'Trigonometry', description: 'Identities, equations, triangle properties, and graph interpretation.', estimated_hours: 12, difficulty_level: 'intermediate', topics: ['Trigonometric Ratios', 'Trigonometric Identities', 'Trigonometric Equations', 'Properties of Triangles', 'Trigonometric Graphs'] },
      { title: 'Coordinate Geometry', description: 'Straight lines, circles, and conic sections in analytical form.', estimated_hours: 16, difficulty_level: 'advanced', topics: ['Straight Lines', 'Circle', 'Parabola', 'Ellipse', 'Hyperbola'] },
      { title: 'Vector Algebra and Three Dimensional Geometry', description: 'Vectors, lines, planes, and shortest-distance reasoning.', estimated_hours: 12, difficulty_level: 'advanced', topics: ['Vector Basics', 'Dot and Cross Product', 'Line in 3D', 'Plane in 3D', 'Shortest Distance'] },
      { title: 'Limits, Continuity and Differentiability', description: 'Rigorous calculus foundations for advanced problem solving.', estimated_hours: 12, difficulty_level: 'advanced', topics: ['Standard Limits', 'Continuity', 'Differentiability', 'Implicit Differentiation', 'Parametric Differentiation'] },
      { title: 'Applications of Derivatives', description: 'Monotonicity, tangents, maxima-minima, and optimization.', estimated_hours: 10, difficulty_level: 'advanced', topics: ['Monotonicity', 'Tangents and Normals', 'Maxima and Minima', 'Approximation', 'Optimization'] },
      { title: 'Integral Calculus and Differential Equations', description: 'Integration methods, area under curves, and differential equations.', estimated_hours: 14, difficulty_level: 'advanced', topics: ['Indefinite Integration', 'Definite Integration', 'Area Under Curves', 'Differential Equations', 'Mixed Integral Problems'] },
      { title: 'Statistics and Mathematical Reasoning', description: 'Scoring topics with data interpretation and logic.', estimated_hours: 8, difficulty_level: 'intermediate', topics: ['Measures of Central Tendency', 'Standard Deviation', 'Probability Distribution Recap', 'Logical Connectives', 'Data Interpretation'] },
    ],
  },
  {
    id: 'subject-physics',
    name: 'Physics',
    description: 'Full JEE Main and Advanced physics syllabus from mechanics to optics, modern physics, and electronics.',
    category: 'JEE Main + Advanced',
    icon: 'Waves',
    color: 'indigo',
    difficultyLabel: 'Hard',
    chapters: [
      { title: 'Units, Dimensions and Error Analysis', description: 'Measurement systems, dimensions, and experimental error handling.', estimated_hours: 8, difficulty_level: 'intermediate', topics: ['Units and Dimensions', 'Error Analysis', 'Vectors for Physics', 'Graph Skills', 'Experimental Skills'] },
      { title: 'Kinematics', description: 'One-dimensional and two-dimensional motion with graph interpretation.', estimated_hours: 10, difficulty_level: 'intermediate', topics: ['Motion in One Dimension', 'Motion Graphs', 'Projectile Motion', 'Relative Motion', 'Mixed Kinematics Problems'] },
      { title: 'Laws of Motion and Friction', description: 'Force analysis, friction, pulleys, pseudo force, and circular motion.', estimated_hours: 12, difficulty_level: 'intermediate', topics: ["Newton's Laws", 'Friction', 'Pulley Systems', 'Pseudo Force', 'Circular Motion'] },
      { title: 'Work, Energy, Power and Center of Mass', description: 'Energy methods and system motion.', estimated_hours: 12, difficulty_level: 'intermediate', topics: ['Work-Energy Theorem', 'Potential Energy', 'Power', 'Center of Mass', 'Collisions'] },
      { title: 'Rotational Motion and Gravitation', description: 'Torque, angular momentum, rolling, and orbital mechanics.', estimated_hours: 14, difficulty_level: 'advanced', topics: ['Rigid Body Rotation', 'Moment of Inertia', 'Rolling Motion', 'Gravitation', 'Satellites'] },
      { title: 'Properties of Matter and Fluid Mechanics', description: 'Elasticity, fluids, viscosity, and surface tension.', estimated_hours: 10, difficulty_level: 'intermediate', topics: ['Elasticity', 'Buoyancy', "Bernoulli's Theorem", 'Viscosity', 'Surface Tension'] },
      { title: 'Oscillations and Waves', description: 'Simple harmonic motion, beats, and standing waves.', estimated_hours: 10, difficulty_level: 'intermediate', topics: ['Simple Harmonic Motion', 'SHM Energy', 'Wave Motion', 'Superposition and Beats', 'Standing Waves'] },
      { title: 'Thermal Physics and Thermodynamics', description: 'Heat, gases, and thermodynamic processes.', estimated_hours: 12, difficulty_level: 'intermediate', topics: ['Calorimetry', 'Kinetic Theory', 'Thermodynamic Processes', 'Heat Engines', 'Heat Transfer'] },
      { title: 'Electrostatics and Capacitors', description: 'Field, potential, Gauss law, capacitance, and dielectrics.', estimated_hours: 12, difficulty_level: 'advanced', topics: ['Coulomb Law', "Gauss's Law", 'Electric Potential', 'Capacitance', 'Capacitor Networks'] },
      { title: 'Current Electricity', description: 'Resistance, circuits, Kirchhoff laws, and practical instruments.', estimated_hours: 10, difficulty_level: 'intermediate', topics: ['Current and Resistance', "Ohm's Law", "Kirchhoff's Laws", 'Potentiometer', 'RC Circuits'] },
      { title: 'Magnetism, EMI and AC', description: 'Magnetic effects, induction, alternating current, and resonance.', estimated_hours: 14, difficulty_level: 'advanced', topics: ['Lorentz Force', 'Charged Particle Motion', 'Magnetic Moment', 'Electromagnetic Induction', 'Alternating Current'] },
      { title: 'Optics, Modern Physics and Electronics', description: 'Ray optics, wave optics, quantum ideas, nuclei, and semiconductors.', estimated_hours: 16, difficulty_level: 'advanced', topics: ['Ray Optics', 'Wave Optics', 'Photoelectric Effect', 'Nuclear Physics', 'Semiconductors'] },
    ],
  },
  {
    id: 'subject-chemistry',
    name: 'Chemistry',
    description: 'Full JEE Main and Advanced chemistry syllabus across physical, inorganic, and organic chemistry.',
    category: 'JEE Main + Advanced',
    icon: 'Flask',
    color: 'emerald',
    difficultyLabel: 'Hard',
    chapters: [
      { title: 'Basic Concepts of Chemistry', description: 'Mole concept, stoichiometry, concentration terms, and atomic foundations.', estimated_hours: 10, difficulty_level: 'intermediate', topics: ['Mole Concept', 'Concentration Terms', 'Equivalent Concept', 'Atomic Structure', 'Spectral Ideas'] },
      { title: 'Periodic Table and Chemical Bonding', description: 'Periodic trends, bonding models, hybridization, and molecular shape.', estimated_hours: 12, difficulty_level: 'intermediate', topics: ['Periodic Classification', 'Ionic Bonding', 'Covalent Bonding', 'Hybridization', 'Molecular Orbital Theory'] },
      { title: 'States of Matter, Thermodynamics and Equilibrium', description: 'Gas laws, thermochemistry, chemical equilibrium, and ionic equilibrium.', estimated_hours: 14, difficulty_level: 'advanced', topics: ['Gaseous State', 'Liquid State', 'Thermodynamics', 'Chemical Equilibrium', 'Ionic Equilibrium'] },
      { title: 'Redox, Electrochemistry and Chemical Kinetics', description: 'Redox balancing, cells, conductance, and reaction rates.', estimated_hours: 12, difficulty_level: 'advanced', topics: ['Redox Reactions', 'Electrochemical Cells', 'Conductance', 'Chemical Kinetics', 'Surface Chemistry'] },
      { title: 'Solutions, Solid State and Metallurgy', description: 'Solution behavior, crystal structure, and metal extraction.', estimated_hours: 10, difficulty_level: 'intermediate', topics: ['Solutions', 'Solid State', 'Metallurgy', 'Environmental Chemistry', 'Practical Chemistry'] },
      { title: 'Hydrogen, s-Block and p-Block', description: 'Main-group chemistry and important compounds.', estimated_hours: 12, difficulty_level: 'intermediate', topics: ['Hydrogen', 's-Block Elements', 'p-Block Group 13-14', 'p-Block Group 15-16', 'p-Block Group 17-18'] },
      { title: 'd-Block, f-Block and Coordination Chemistry', description: 'Transition elements, coordination compounds, and crystal field ideas.', estimated_hours: 12, difficulty_level: 'advanced', topics: ['d- and f-Block Elements', 'Coordination Basics', 'Coordination Isomerism', 'Crystal Field Theory', 'Qualitative Analysis'] },
      { title: 'General Organic Chemistry and Isomerism', description: 'Electronic effects, intermediates, mechanism, and stereochemistry.', estimated_hours: 14, difficulty_level: 'advanced', topics: ['Electronic Effects', 'Reaction Intermediates', 'Acidity and Basicity', 'Structural Isomerism', 'Stereoisomerism'] },
      { title: 'Hydrocarbons and Halo Compounds', description: 'Aliphatic, aromatic, and halogen-containing organic chemistry.', estimated_hours: 12, difficulty_level: 'advanced', topics: ['Alkanes', 'Alkenes and Alkynes', 'Aromatic Hydrocarbons', 'Haloalkanes and Haloarenes', 'Organic Conversions'] },
      { title: 'Alcohols, Phenols, Ethers and Carbonyl Compounds', description: 'Oxygen-containing compounds and reaction pathways.', estimated_hours: 12, difficulty_level: 'advanced', topics: ['Alcohols and Ethers', 'Phenols', 'Aldehydes and Ketones', 'Carboxylic Acids', 'Mechanism Integration'] },
      { title: 'Amines, Biomolecules and Chemistry in Everyday Life', description: 'Nitrogen compounds, bio molecules, polymers, and NCERT-heavy topics.', estimated_hours: 10, difficulty_level: 'intermediate', topics: ['Amines', 'Biomolecules', 'Polymers', 'Chemistry in Everyday Life', 'Practical Organic Analysis'] },
    ],
  },
];

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function conceptTag(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '_');
}

function buildKeyConcepts(title: string) {
  const words = title.split(/\s+/).filter((word) => !['and', 'of', 'the', 'in'].includes(word.toLowerCase()));
  const first = words.slice(0, 3);
  return [
    title,
    first.slice(0, 2).join(' '),
    `${words[0] ?? title} problem solving`,
  ];
}

function difficultyFor(chapterIndex: number, topicIndex: number, level: Chapter['difficulty_level']) {
  const base = level === 'advanced' ? 4 : level === 'intermediate' ? 3 : 2;
  return Math.min(5, Math.max(1, base + (topicIndex >= 3 ? 1 : 0) - (chapterIndex === 0 ? 1 : 0)));
}

export const sampleChapters: Chapter[] = syllabusSeeds.flatMap((subject) =>
  subject.chapters.map((chapter, chapterIndex) => ({
    id: `chapter-${slugify(subject.name)}-${chapterIndex + 1}-${slugify(chapter.title)}`,
    subject_id: subject.id,
    title: chapter.title,
    description: chapter.description,
    chapter_number: chapterIndex + 1,
    estimated_hours: chapter.estimated_hours,
    difficulty_level: chapter.difficulty_level,
    prerequisites: chapterIndex === 0 ? ['Foundational school concepts'] : [subject.chapters[chapterIndex - 1].title],
    learning_objectives: [
      `Master ${chapter.title.toLowerCase()} concepts`,
      `Solve JEE-level questions from ${chapter.title.toLowerCase()}`,
      `Connect ${chapter.title.toLowerCase()} with later mixed problems`,
    ],
  })),
);

export const sampleTopics: Topic[] = syllabusSeeds.flatMap((subject) =>
  subject.chapters.flatMap((chapter, chapterIndex) => {
    const chapterId = `chapter-${slugify(subject.name)}-${chapterIndex + 1}-${slugify(chapter.title)}`;
    return chapter.topics.map((topicTitle, topicIndex) => ({
      id: `topic-${slugify(subject.name)}-${slugify(chapter.title)}-${topicIndex + 1}-${slugify(topicTitle)}`,
      chapter_id: chapterId,
      subject_id: subject.id,
      title: topicTitle,
      description: `${topicTitle} as part of ${chapter.title} for JEE Main and Advanced preparation.`,
      topic_number: topicIndex + 1,
      estimated_minutes: 45 + topicIndex * 5 + (chapter.difficulty_level === 'advanced' ? 10 : 0),
      difficulty: difficultyFor(chapterIndex, topicIndex, chapter.difficulty_level),
      key_concepts: buildKeyConcepts(topicTitle),
      prerequisites: topicIndex === 0 ? [chapterIndex === 0 ? 'Foundational school concepts' : subject.chapters[chapterIndex - 1].title] : [chapter.topics[topicIndex - 1]],
    }));
  }),
);

export const sampleSubjects: Subject[] = syllabusSeeds.map((subject) => {
  const chapters = sampleChapters.filter((chapter) => chapter.subject_id === subject.id);
  const topics = sampleTopics.filter((topic) => topic.subject_id === subject.id);
  return {
    id: subject.id,
    name: subject.name,
    description: subject.description,
    category: subject.category,
    estimated_minutes: topics.reduce((sum, topic) => sum + topic.estimated_minutes, 0),
    icon: subject.icon,
    color: subject.color,
    chapterCount: chapters.length,
    topicCount: topics.length,
    difficultyLabel: subject.difficultyLabel,
  };
});

function buildLessonContent(topic: Topic, chapterTitle: string) {
  const concepts = topic.key_concepts.join(', ');
  const prerequisite = topic.prerequisites[0] ?? 'foundational prior knowledge';
  return {
    big_idea: `${topic.title} builds a core intermediate understanding inside ${chapterTitle}.`,
    explanation: `Overview:\n${topic.title} is one of the most important building blocks inside ${chapterTitle}. This topic connects directly to ${concepts}, and learners need more than a short definition to really understand it.\n\nWhy it matters:\nWhen students understand ${topic.title.toLowerCase()}, they stop treating questions as isolated tricks and start seeing the underlying structure. That makes problem solving faster, more accurate, and more transferable to harder chapter problems.\n\nCore idea in simple language:\nYou can think of ${topic.title.toLowerCase()} as a system for organizing information. Instead of rushing to an answer, the learner identifies what is known, what must be found, and which relationship connects the two. This is especially important because intermediate students often lose marks not from lack of intelligence, but from weak structure in their reasoning.\n\nHow this topic grows from earlier learning:\nThis topic depends on ${prerequisite}. Earlier knowledge gives the learner the tools, but this chapter pushes them to use those tools with more precision, better interpretation, and more confidence.\n\nWhat strong learners do here:\nStrong learners explain each step, justify why a method works, and compare one method with another. They do not simply memorize outcomes. They can tell when a result is reasonable and when they need to re-check their assumptions.\n\nCommon learner mistakes:\n1. Starting calculations before understanding the question.\n2. Ignoring the meaning of key terms or symbols.\n3. Choosing a method because it looks familiar instead of because it fits.\n4. Forgetting to check whether the final answer is logically consistent.\n\nStudy strategy:\nRead the example slowly, identify the pattern, and then solve one similar problem while explaining each step aloud. That combination of reasoning and reflection is what helps this topic stick.`,
    worked_example: `Worked example framework for ${topic.title}:\n\nStep 1: Read the problem carefully and identify the exact quantity, relationship, or concept being tested.\nStep 2: Underline the information that is given and separate it from what needs to be found.\nStep 3: Match the problem to the right rule, relationship, or representation connected to ${concepts}.\nStep 4: Solve one step at a time and explain why each step is valid.\nStep 5: Compare the result to the original question and check if the answer is realistic.\n\nTeacher-style guidance:\nA good learner does not just say “this is the answer.” A good learner says “this is the answer because this relationship applies, this step follows from the previous one, and the final result matches the conditions of the problem.”\n\nReflection prompt:\nIf you solved the problem a different way, would the structure still make sense? If not, go back and identify the first step where your reasoning changed.`,
    key_skills: topic.key_concepts,
    remember_points: [
      `Anchor on the big idea before calculating or substituting values.`,
      `Use the prerequisite knowledge from ${prerequisite} instead of treating this topic as isolated.`,
      `Check every answer for units, signs, scale, and logical consistency before moving on.`,
    ],
    quick_check: [
      {
        question: `Which idea is most central to ${topic.title}?`,
        options: [topic.key_concepts[0], 'Memorizing without reasoning', 'Skipping examples', 'Guessing from patterns'],
        correct: 0,
      },
      {
        question: `What should you do before the final answer in ${topic.title}?`,
        options: ['Ignore the question', 'Check if the result makes sense', 'Restart the topic', 'Change the formula randomly'],
        correct: 1,
      },
      {
        question: `Which prerequisite supports ${topic.title}?`,
        options: [topic.prerequisites[0] ?? 'Basic foundations', 'No prerequisite is needed', 'Only memorization', 'Only speed'],
        correct: 0,
      },
    ],
  };
}

export const sampleLessons: Lesson[] = sampleTopics.map((topic) => {
  const chapter = sampleChapters.find((item) => item.id === topic.chapter_id)!;
  return {
    id: `lesson-${topic.id}`,
    subject_id: topic.subject_id,
    chapter_id: topic.chapter_id,
    topic_id: topic.id,
    concept_tag: topic.key_concepts[0].toLowerCase().replace(/[^a-z0-9]+/g, '_'),
    title: topic.title,
    difficulty: topic.difficulty,
    version: 1,
    content_json: buildLessonContent(topic, chapter.title),
  };
});

type GeneratedQuestion = Pick<Question, 'question_text' | 'options' | 'correct_answer' | 'explanation'>;

function keywordQuestion(
  topic: Topic,
  keyword: string,
  question: GeneratedQuestion,
) {
  return topic.title.toLowerCase().includes(keyword) ? question : null;
}

function inferTopicQuestion(topic: Topic): GeneratedQuestion {
  return (
    keywordQuestion(topic, 'sets', {
      question_text: 'Which operation gives elements common to two sets?',
      options: ['Intersection', 'Union', 'Complement', 'Cartesian product'],
      correct_answer: 0,
      explanation: 'Intersection collects only the common elements of the two sets.',
    }) ??
    keywordQuestion(topic, 'relations', {
      question_text: 'Which set of properties defines an equivalence relation?',
      options: ['Reflexive, symmetric, and transitive', 'Only injective', 'Only surjective', 'Only anti-symmetric'],
      correct_answer: 0,
      explanation: 'An equivalence relation must be reflexive, symmetric, and transitive.',
    }) ??
    keywordQuestion(topic, 'functions', {
      question_text: 'Which statement is true for a function?',
      options: ['Each input has exactly one output', 'Each output has exactly one input', 'Inputs must equal outputs', 'A function cannot be graphed'],
      correct_answer: 0,
      explanation: 'A function assigns exactly one output to each valid input.',
    }) ??
    keywordQuestion(topic, 'quadratic', {
      question_text: 'For ax^2 + bx + c = 0, which expression is the discriminant?',
      options: ['b^2 - 4ac', '2a + b', 'a^2 + c^2', 'b^2 + 4ac'],
      correct_answer: 0,
      explanation: 'The discriminant b^2 - 4ac determines the nature of the roots of a quadratic equation.',
    }) ??
    keywordQuestion(topic, 'complex', {
      question_text: 'What is the value of i^2 in complex numbers?',
      options: ['-1', '0', '1', 'i'],
      correct_answer: 0,
      explanation: 'The imaginary unit is defined by i^2 = -1.',
    }) ??
    keywordQuestion(topic, 'progression', {
      question_text: 'In an arithmetic progression, consecutive terms differ by a constant called what?',
      options: ['Common difference', 'Common ratio', 'Mean deviation', 'Determinant'],
      correct_answer: 0,
      explanation: 'The defining feature of an arithmetic progression is a constant common difference.',
    }) ??
    keywordQuestion(topic, 'binomial', {
      question_text: 'Which coefficient appears in the general term of a binomial expansion?',
      options: ['nCr', 'sin theta', 'det A', 'dy/dx'],
      correct_answer: 0,
      explanation: 'Binomial expansions use combination coefficients nCr in their general term.',
    }) ??
    keywordQuestion(topic, 'probability', {
      question_text: 'If two events are independent, P(A and B) is equal to:',
      options: ['P(A) x P(B)', 'P(A) + P(B)', 'P(A) - P(B)', '1 - P(A)'],
      correct_answer: 0,
      explanation: 'For independent events, the probability of both occurring is the product P(A)P(B).',
    }) ??
    keywordQuestion(topic, 'matrix', {
      question_text: 'A matrix inverse exists only when the determinant is:',
      options: ['Non-zero', 'Equal to 1', 'Always zero', 'Negative'],
      correct_answer: 0,
      explanation: 'A square matrix is invertible only when its determinant is non-zero.',
    }) ??
    keywordQuestion(topic, 'determinant', {
      question_text: 'If the determinant of a matrix is zero, the matrix is:',
      options: ['Singular', 'Orthogonal', 'Identity', 'Diagonal only'],
      correct_answer: 0,
      explanation: 'A zero determinant means the matrix is singular and not invertible.',
    }) ??
    keywordQuestion(topic, 'trigonometric', {
      question_text: 'Which identity is always true?',
      options: ['sin^2 x + cos^2 x = 1', 'tan x = sin x + cos x', 'sec x = sin x / cos x', 'cot x = sin x / cos x'],
      correct_answer: 0,
      explanation: 'sin^2 x + cos^2 x = 1 is a standard trigonometric identity.',
    }) ??
    keywordQuestion(topic, 'circle', {
      question_text: 'What is the standard form of a circle with center (h, k) and radius r?',
      options: ['(x-h)^2 + (y-k)^2 = r^2', 'x^2 + y^2 = h + k', '(x+h)(y+k) = r', 'x + y = r^2'],
      correct_answer: 0,
      explanation: 'The standard form of a circle is (x-h)^2 + (y-k)^2 = r^2.',
    }) ??
    keywordQuestion(topic, 'parabola', {
      question_text: 'For y^2 = 4ax, what is the focus?',
      options: ['(a, 0)', '(0, a)', '(-a, 0)', '(0, -a)'],
      correct_answer: 0,
      explanation: 'For y^2 = 4ax, the parabola opens rightward and has focus at (a, 0).',
    }) ??
    keywordQuestion(topic, 'ellipse', {
      question_text: 'Which parameter measures how stretched an ellipse is?',
      options: ['Eccentricity', 'Determinant', 'Gradient', 'Modulus'],
      correct_answer: 0,
      explanation: 'Eccentricity measures the deviation of an ellipse from a circle.',
    }) ??
    keywordQuestion(topic, 'hyperbola', {
      question_text: 'The asymptotes of a hyperbola help describe:',
      options: ['Its end behavior', 'Its area exactly', 'Its midpoint only', 'Its determinant'],
      correct_answer: 0,
      explanation: 'Asymptotes describe the limiting direction of the branches of a hyperbola.',
    }) ??
    keywordQuestion(topic, 'vector', {
      question_text: 'The dot product of two perpendicular vectors is:',
      options: ['0', '1', '-1', 'Their magnitudes added'],
      correct_answer: 0,
      explanation: 'Perpendicular vectors have zero dot product because cos 90 degrees is zero.',
    }) ??
    keywordQuestion(topic, 'plane', {
      question_text: 'A plane in 3D is determined by a point and a:',
      options: ['Normal vector', 'Radius', 'Quadratic equation only', 'Pair of asymptotes'],
      correct_answer: 0,
      explanation: 'A plane can be represented using a point and a normal vector.',
    }) ??
    keywordQuestion(topic, 'limit', {
      question_text: 'A limit studies the value of a function:',
      options: ['As the input approaches a point', 'Only at x = 0', 'Only when the graph is linear', 'After integration only'],
      correct_answer: 0,
      explanation: 'Limits describe the behavior of a function as the input approaches a given value.',
    }) ??
    keywordQuestion(topic, 'continuity', {
      question_text: 'A function is continuous at x = a when:',
      options: ['LHL = RHL = f(a)', 'Only LHL exists', 'Only RHL exists', 'f(a) is maximum'],
      correct_answer: 0,
      explanation: 'Continuity at a point requires the left limit, right limit, and function value to agree.',
    }) ??
    keywordQuestion(topic, 'differenti', {
      question_text: 'The derivative at a point represents the:',
      options: ['Instantaneous rate of change', 'Area under the curve', 'Number of roots', 'Length of the interval'],
      correct_answer: 0,
      explanation: 'Differentiation measures instantaneous rate of change or slope.',
    }) ??
    keywordQuestion(topic, 'integration', {
      question_text: 'Differentiation and integration are linked through the:',
      options: ['Fundamental theorem of calculus', 'Binomial theorem', 'Coulomb law', 'Nernst equation'],
      correct_answer: 0,
      explanation: 'The fundamental theorem of calculus connects differentiation and integration.',
    }) ??
    keywordQuestion(topic, 'differential equations', {
      question_text: 'A differential equation relates a function to its:',
      options: ['Derivatives', 'Factors only', 'Roots only', 'Determinants'],
      correct_answer: 0,
      explanation: 'Differential equations involve a function and one or more of its derivatives.',
    }) ??
    keywordQuestion(topic, 'kinematics', {
      question_text: 'Acceleration is defined as the rate of change of:',
      options: ['Velocity', 'Displacement', 'Momentum', 'Mass'],
      correct_answer: 0,
      explanation: 'Acceleration measures how quickly velocity changes with time.',
    }) ??
    keywordQuestion(topic, 'projectile', {
      question_text: 'In ideal projectile motion, the horizontal acceleration is:',
      options: ['Zero', 'g', '2g', 'Variable'],
      correct_answer: 0,
      explanation: 'Ignoring air resistance, only gravity acts vertically, so horizontal acceleration is zero.',
    }) ??
    keywordQuestion(topic, 'newton', {
      question_text: "Newton's second law relates force to:",
      options: ['Mass and acceleration', 'Velocity only', 'Power only', 'Pressure and volume'],
      correct_answer: 0,
      explanation: "Newton's second law is F = ma.",
    }) ??
    keywordQuestion(topic, 'friction', {
      question_text: 'Limiting friction is associated with:',
      options: ['The onset of motion', 'Uniform circular motion only', 'Zero normal force', 'Elastic collisions only'],
      correct_answer: 0,
      explanation: 'Limiting friction acts when a body is just about to move.',
    }) ??
    keywordQuestion(topic, 'work-energy', {
      question_text: 'The work-energy theorem states that net work equals change in:',
      options: ['Kinetic energy', 'Potential energy only', 'Momentum', 'Density'],
      correct_answer: 0,
      explanation: 'Net work done on a particle equals the change in its kinetic energy.',
    }) ??
    keywordQuestion(topic, 'gravitation', {
      question_text: 'Escape velocity is the minimum speed needed to:',
      options: ['Leave a gravitational field without returning', 'Start circular motion', 'Double the mass', 'Create weightlessness everywhere'],
      correct_answer: 0,
      explanation: 'Escape velocity is the minimum speed needed to escape a bodys gravitational pull.',
    }) ??
    keywordQuestion(topic, 'shm', {
      question_text: 'In simple harmonic motion, acceleration is always directed toward the:',
      options: ['Mean position', 'Maximum displacement', 'Velocity vector', 'Outermost point only'],
      correct_answer: 0,
      explanation: 'In SHM, acceleration is restoring in nature and points toward the mean position.',
    }) ??
    keywordQuestion(topic, 'thermo', {
      question_text: 'The first law of thermodynamics is a statement of conservation of:',
      options: ['Energy', 'Charge', 'Momentum only', 'Entropy only'],
      correct_answer: 0,
      explanation: 'The first law is an energy conservation statement for thermodynamic systems.',
    }) ??
    keywordQuestion(topic, 'coulomb', {
      question_text: 'Coulomb force between two point charges varies inversely with:',
      options: ['Square of distance', 'Distance', 'Mass', 'Potential'],
      correct_answer: 0,
      explanation: 'Coulombs law follows an inverse-square dependence on separation.',
    }) ??
    keywordQuestion(topic, 'gauss', {
      question_text: "Gauss's law connects electric flux with enclosed:",
      options: ['Charge', 'Current', 'Resistance', 'Potential'],
      correct_answer: 0,
      explanation: "Gauss's law states that electric flux is proportional to enclosed charge.",
    }) ??
    keywordQuestion(topic, 'kirchhoff', {
      question_text: "Kirchhoff's junction rule is based on conservation of:",
      options: ['Charge', 'Energy', 'Momentum', 'Mass'],
      correct_answer: 0,
      explanation: 'The junction rule follows from conservation of charge in a circuit.',
    }) ??
    keywordQuestion(topic, 'alternating current', {
      question_text: 'In an AC circuit, the quantity that opposes current is called:',
      options: ['Impedance', 'Capacitance only', 'Conductance', 'Flux'],
      correct_answer: 0,
      explanation: 'Impedance is the effective opposition to alternating current.',
    }) ??
    keywordQuestion(topic, 'ray optics', {
      question_text: 'For a convex lens, parallel rays after refraction meet at the:',
      options: ['Principal focus', 'Pole', 'Optical center only', 'Center of curvature'],
      correct_answer: 0,
      explanation: 'A convex lens converges rays parallel to the principal axis at the principal focus.',
    }) ??
    keywordQuestion(topic, 'wave optics', {
      question_text: 'Youngs double slit experiment demonstrates:',
      options: ['Interference of light', 'Photoelectric effect', 'Radioactivity', 'Magnetic induction'],
      correct_answer: 0,
      explanation: 'YDSE is a classic demonstration of interference and wave nature of light.',
    }) ??
    keywordQuestion(topic, 'photoelectric', {
      question_text: 'In the photoelectric effect, emission starts only when frequency is above the:',
      options: ['Threshold frequency', 'Resonant density', 'Critical mass', 'Limiting resistance'],
      correct_answer: 0,
      explanation: 'Photoelectric emission requires incident frequency above the threshold frequency.',
    }) ??
    keywordQuestion(topic, 'semiconductor', {
      question_text: 'A diode primarily allows current to flow in:',
      options: ['One direction', 'Both directions equally', 'Neither direction', 'Only AC form'],
      correct_answer: 0,
      explanation: 'A diode conducts strongly in forward bias and restricts reverse current.',
    }) ??
    keywordQuestion(topic, 'mole', {
      question_text: 'One mole of any substance contains:',
      options: ['Avogadro number of particles', 'One gram always', 'Exactly one atom', 'Only molecules'],
      correct_answer: 0,
      explanation: 'A mole corresponds to Avogadro number of entities.',
    }) ??
    keywordQuestion(topic, 'atomic', {
      question_text: 'The maximum number of electrons in an orbital is:',
      options: ['2', '8', '18', '32'],
      correct_answer: 0,
      explanation: 'An orbital can hold at most two electrons with opposite spins.',
    }) ??
    keywordQuestion(topic, 'periodic', {
      question_text: 'Across a period, atomic radius generally:',
      options: ['Decreases', 'Increases sharply', 'Remains exactly same', 'Becomes zero'],
      correct_answer: 0,
      explanation: 'Atomic radius generally decreases across a period because effective nuclear charge increases.',
    }) ??
    keywordQuestion(topic, 'bonding', {
      question_text: 'A sigma bond is formed by:',
      options: ['Head-on overlap', 'Sidewise overlap only', 'Only ionic attraction', 'Only hydrogen bonding'],
      correct_answer: 0,
      explanation: 'Sigma bonds are formed by head-on overlap of orbitals.',
    }) ??
    keywordQuestion(topic, 'equilibrium', {
      question_text: 'At chemical equilibrium, the forward and backward reaction rates are:',
      options: ['Equal', 'Zero', 'Maximum', 'Unrelated'],
      correct_answer: 0,
      explanation: 'At equilibrium, the forward and reverse rates are equal.',
    }) ??
    keywordQuestion(topic, 'electrochemical', {
      question_text: 'The Nernst equation is used to calculate:',
      options: ['Cell potential under non-standard conditions', 'Bond angle', 'Rate constant', 'pH of pure water only'],
      correct_answer: 0,
      explanation: 'The Nernst equation adjusts cell potential for non-standard conditions.',
    }) ??
    keywordQuestion(topic, 'kinetics', {
      question_text: 'The order of a reaction is determined from the:',
      options: ['Rate law', 'Balanced equation only', 'Color of reactants', 'Density of solvent'],
      correct_answer: 0,
      explanation: 'Reaction order is defined through the experimentally determined rate law.',
    }) ??
    keywordQuestion(topic, 'solid state', {
      question_text: 'Which defect changes the stoichiometry of a crystal?',
      options: ['Non-stoichiometric defect', 'Schottky defect only', 'Frenkel defect only', 'No defect ever does'],
      correct_answer: 0,
      explanation: 'Non-stoichiometric defects change the ideal ratio of ions in a crystal.',
    }) ??
    keywordQuestion(topic, 'coordination', {
      question_text: 'A ligand is a species that donates a:',
      options: ['Lone pair to a metal ion', 'Proton to water', 'Neutron to nucleus', 'Photon to a bond'],
      correct_answer: 0,
      explanation: 'Ligands donate an electron pair to the central metal atom or ion.',
    }) ??
    keywordQuestion(topic, 'stereoisomerism', {
      question_text: 'Optical isomerism arises because of:',
      options: ['Chirality', 'Only double bonds', 'Only ionic bonding', 'Zero bond angles'],
      correct_answer: 0,
      explanation: 'Optical isomerism is associated with chirality and non-superimposable mirror images.',
    }) ??
    keywordQuestion(topic, 'alkenes', {
      question_text: 'An alkene is characterized by the presence of a:',
      options: ['Carbon-carbon double bond', 'Triple bond only', 'Ionic bond', 'Coordinate bond'],
      correct_answer: 0,
      explanation: 'Alkenes contain a C=C double bond.',
    }) ??
    keywordQuestion(topic, 'aldehydes', {
      question_text: 'Which functional group is present in aldehydes?',
      options: ['-CHO', '-COOH', '-OH', '-NH2'],
      correct_answer: 0,
      explanation: 'Aldehydes contain the terminal carbonyl group represented as -CHO.',
    }) ??
    keywordQuestion(topic, 'amines', {
      question_text: 'Amines are derivatives of:',
      options: ['Ammonia', 'Methane', 'Benzene only', 'Water'],
      correct_answer: 0,
      explanation: 'Amines can be viewed as derivatives of ammonia with one or more hydrogens replaced.',
    }) ??
    {
      question_text: `Which statement best matches the topic ${topic.title}?`,
      options: [topic.key_concepts[0], 'It is unrelated to the chapter', 'It removes the need for prerequisites', 'It is solved by guessing only'],
      correct_answer: 0,
      explanation: `${topic.key_concepts[0]} is one of the core ideas attached to ${topic.title}.`,
    }
  );
}

function inferTopicFollowUpQuestion(topic: Topic): GeneratedQuestion {
  return (
    keywordQuestion(topic, 'relations', {
      question_text: 'If a relation is reflexive and symmetric but not transitive, it is:',
      options: ['Not an equivalence relation', 'An equivalence relation', 'A function', 'A bijection'],
      correct_answer: 0,
      explanation: 'Equivalence relations must satisfy reflexive, symmetric, and transitive properties together.',
    }) ??
    keywordQuestion(topic, 'functions', {
      question_text: 'A function can be called one-one when:',
      options: ['Different inputs always give different outputs', 'Every output has many inputs', 'Its graph is always a straight line', 'Its domain is finite only'],
      correct_answer: 0,
      explanation: 'A one-one function maps distinct inputs to distinct outputs.',
    }) ??
    keywordQuestion(topic, 'quadratic', {
      question_text: 'If b^2 - 4ac = 0 for a quadratic equation, the roots are:',
      options: ['Real and equal', 'Imaginary and unequal', 'Real and distinct', 'Not defined'],
      correct_answer: 0,
      explanation: 'A zero discriminant gives equal real roots.',
    }) ??
    keywordQuestion(topic, 'complex', {
      question_text: 'The conjugate of 3 + 4i is:',
      options: ['3 - 4i', '-3 + 4i', '-3 - 4i', '4 + 3i'],
      correct_answer: 0,
      explanation: 'The conjugate changes the sign of the imaginary part.',
    }) ??
    keywordQuestion(topic, 'probability', {
      question_text: 'The probability of an impossible event is:',
      options: ['0', '1', '1/2', '-1'],
      correct_answer: 0,
      explanation: 'An impossible event has probability zero.',
    }) ??
    keywordQuestion(topic, 'matrix', {
      question_text: 'Which matrices can be multiplied?',
      options: ['When columns of the first equal rows of the second', 'Only square matrices', 'Only matrices of same order', 'Only identity matrices'],
      correct_answer: 0,
      explanation: 'Matrix multiplication is defined when inner dimensions match.',
    }) ??
    keywordQuestion(topic, 'trigonometric', {
      question_text: 'tan x is equal to:',
      options: ['sin x / cos x', 'cos x / sin x', '1 / cos x', '1 / sin x'],
      correct_answer: 0,
      explanation: 'By definition, tan x = sin x / cos x.',
    }) ??
    keywordQuestion(topic, 'circle', {
      question_text: 'The radius of x^2 + y^2 = 25 is:',
      options: ['5', '25', '10', '12.5'],
      correct_answer: 0,
      explanation: 'Comparing with x^2 + y^2 = r^2 gives r = 5.',
    }) ??
    keywordQuestion(topic, 'parabola', {
      question_text: 'For x^2 = 4ay, the parabola opens toward the:',
      options: ['Positive y-axis', 'Negative x-axis', 'Positive x-axis', 'Left only'],
      correct_answer: 0,
      explanation: 'The standard parabola x^2 = 4ay opens upward along the positive y-axis.',
    }) ??
    keywordQuestion(topic, 'vector', {
      question_text: 'The magnitude of vector 3i + 4j is:',
      options: ['5', '7', '12', '1'],
      correct_answer: 0,
      explanation: 'Magnitude is sqrt(3^2 + 4^2) = 5.',
    }) ??
    keywordQuestion(topic, 'limit', {
      question_text: 'If left-hand and right-hand limits are unequal at a point, the limit:',
      options: ['Does not exist', 'Must be zero', 'Must be one', 'Always equals the function value'],
      correct_answer: 0,
      explanation: 'A two-sided limit exists only when the left-hand and right-hand limits agree.',
    }) ??
    keywordQuestion(topic, 'differenti', {
      question_text: 'If y = x^2, then dy/dx is:',
      options: ['2x', 'x', 'x^3', '2'],
      correct_answer: 0,
      explanation: 'The derivative of x^2 is 2x.',
    }) ??
    keywordQuestion(topic, 'integration', {
      question_text: 'The integral of 2x dx is:',
      options: ['x^2 + C', '2 + C', 'x + C', '1/x + C'],
      correct_answer: 0,
      explanation: 'Integrating 2x gives x^2 + C.',
    }) ??
    keywordQuestion(topic, 'kinematics', {
      question_text: 'The slope of a velocity-time graph represents:',
      options: ['Acceleration', 'Displacement', 'Momentum', 'Power'],
      correct_answer: 0,
      explanation: 'The slope of a v-t graph gives acceleration.',
    }) ??
    keywordQuestion(topic, 'projectile', {
      question_text: 'At the highest point of projectile motion, the vertical component of velocity is:',
      options: ['Zero', 'Maximum', 'Equal to g', 'Negative always'],
      correct_answer: 0,
      explanation: 'At the highest point, the vertical velocity momentarily becomes zero.',
    }) ??
    keywordQuestion(topic, 'newton', {
      question_text: 'According to Newtons first law, a body remains at rest or in uniform motion unless acted on by:',
      options: ['An unbalanced external force', 'Its own mass', 'A field only', 'Its potential energy'],
      correct_answer: 0,
      explanation: 'Newtons first law describes inertia and the need for unbalanced external force to change motion.',
    }) ??
    keywordQuestion(topic, 'friction', {
      question_text: 'Static friction adjusts itself up to the value of:',
      options: ['Limiting friction', 'Zero only', 'Kinetic friction always', 'Weight of the body'],
      correct_answer: 0,
      explanation: 'Static friction can vary from zero up to its limiting value.',
    }) ??
    keywordQuestion(topic, 'gravitation', {
      question_text: 'The acceleration due to gravity near Earth is approximately:',
      options: ['9.8 m/s^2', '98 m/s', '0.98 m/s', '1 m/s^2 exactly everywhere'],
      correct_answer: 0,
      explanation: 'Near the Earths surface, g is approximately 9.8 m/s^2.',
    }) ??
    keywordQuestion(topic, 'electro', {
      question_text: 'Like charges always:',
      options: ['Repel each other', 'Attract each other', 'Cancel each other', 'Become neutral immediately'],
      correct_answer: 0,
      explanation: 'Like charges repel while unlike charges attract.',
    }) ??
    keywordQuestion(topic, 'current', {
      question_text: 'Electric current is the rate of flow of:',
      options: ['Charge', 'Mass', 'Potential', 'Resistance'],
      correct_answer: 0,
      explanation: 'Current is defined as charge flowing per unit time.',
    }) ??
    keywordQuestion(topic, 'wave optics', {
      question_text: 'In interference, bright fringes are formed due to:',
      options: ['Constructive interference', 'Destructive interference', 'Refraction only', 'Polarization only'],
      correct_answer: 0,
      explanation: 'Bright fringes occur where waves meet constructively.',
    }) ??
    keywordQuestion(topic, 'mole', {
      question_text: 'The number of moles in 18 g of water is:',
      options: ['1', '18', '0.5', '2'],
      correct_answer: 0,
      explanation: 'Moles = mass / molar mass = 18/18 = 1.',
    }) ??
    keywordQuestion(topic, 'atomic', {
      question_text: 'The atomic number gives the number of:',
      options: ['Protons', 'Neutrons', 'Orbitals', 'Bonds'],
      correct_answer: 0,
      explanation: 'Atomic number equals the number of protons in the nucleus.',
    }) ??
    keywordQuestion(topic, 'bonding', {
      question_text: 'A pi bond is formed by:',
      options: ['Sidewise overlap of orbitals', 'Head-on overlap only', 'Transfer of electrons', 'Only ionic attraction'],
      correct_answer: 0,
      explanation: 'Pi bonds arise from lateral overlap of orbitals.',
    }) ??
    keywordQuestion(topic, 'equilibrium', {
      question_text: 'Le Chatelier principle predicts the response of an equilibrium system to:',
      options: ['A disturbance', 'Only high temperature', 'Only catalysts', 'Only a color change'],
      correct_answer: 0,
      explanation: 'Le Chatelier principle explains how equilibrium shifts to oppose an imposed disturbance.',
    }) ??
    keywordQuestion(topic, 'kinetics', {
      question_text: 'A catalyst changes the reaction rate by changing the:',
      options: ['Activation energy', 'Equilibrium constant', 'Molar mass', 'Stoichiometric coefficient'],
      correct_answer: 0,
      explanation: 'Catalysts alter rate by lowering effective activation energy.',
    }) ??
    keywordQuestion(topic, 'amines', {
      question_text: 'Primary amines contain the functional grouping:',
      options: ['-NH2', '-NO2', '-CN', '-OH'],
      correct_answer: 0,
      explanation: 'Primary amines contain one alkyl or aryl group attached to -NH2.',
    }) ??
    {
      question_text: `Which statement is directly correct about ${topic.title}?`,
      options: [topic.key_concepts[0], 'It has no key concept', 'It never appears in problem solving', 'It is unrelated to the subject'],
      correct_answer: 0,
      explanation: `${topic.key_concepts[0]} is directly related to ${topic.title}.`,
    }
  );
}

function buildTopicQuestionSet(topic: Topic): Question[] {
  const baseTag = topic.key_concepts[0].toLowerCase().replace(/[^a-z0-9]+/g, '_');
  const primary = inferTopicQuestion(topic);
  const followUp = inferTopicFollowUpQuestion(topic);
  const concepts = [
    topic.key_concepts[0],
    topic.key_concepts[1] ?? topic.key_concepts[0],
    topic.key_concepts[2] ?? topic.key_concepts[0],
  ];
  const prerequisite = topic.prerequisites[0] ?? 'Foundational concepts';
  const topicLabel = topic.title.toLowerCase();
  const chapterTitle = sampleChapters.find((chapter) => chapter.id === topic.chapter_id)?.title ?? 'this chapter';

  return [
    {
      id: `q-${topic.id}-1`,
      topic_id: topic.id,
      chapter_id: topic.chapter_id,
      concept_tag: baseTag,
      question_text: primary.question_text,
      options: primary.options,
      correct_answer: primary.correct_answer,
      difficulty: Math.max(1, topic.difficulty - 1),
      explanation: primary.explanation,
      subject_id: topic.subject_id,
    },
    {
      id: `q-${topic.id}-2`,
      topic_id: topic.id,
      chapter_id: topic.chapter_id,
      concept_tag: baseTag,
      question_text: followUp.question_text,
      options: followUp.options,
      correct_answer: followUp.correct_answer,
      difficulty: topic.difficulty,
      explanation: followUp.explanation,
      subject_id: topic.subject_id,
    },
    {
      id: `q-${topic.id}-3`,
      topic_id: topic.id,
      chapter_id: topic.chapter_id,
      concept_tag: baseTag,
      question_text: `Which earlier idea most directly supports ${topic.title}?`,
      options: [
        prerequisite,
        'No earlier idea is needed',
        'Only exam speed matters',
        'Only memorizing the last formula matters',
      ],
      correct_answer: 0,
      difficulty: Math.min(5, topic.difficulty + 1),
      explanation: `${topic.title} builds naturally on ${prerequisite}.`,
      subject_id: topic.subject_id,
    },
    {
      id: `q-${topic.id}-4`,
      topic_id: topic.id,
      chapter_id: topic.chapter_id,
      concept_tag: baseTag,
      question_text: `Which chapter contains ${topic.title}?`,
      options: [
        chapterTitle,
        'It does not belong to any chapter',
        'Every chapter equally',
        'Only the final chapter',
      ],
      correct_answer: 0,
      difficulty: topic.difficulty,
      explanation: `${topic.title} belongs to ${chapterTitle}.`,
      subject_id: topic.subject_id,
    },
    {
      id: `q-${topic.id}-5`,
      topic_id: topic.id,
      chapter_id: topic.chapter_id,
      concept_tag: baseTag,
      question_text: `Which habit is most helpful while solving ${topicLabel} problems?`,
      options: [
        'Identify the governing principle before calculation',
        'Guess directly from the options',
        'Skip units, signs, and conditions',
        'Ignore the chapter concept map',
      ],
      correct_answer: 0,
      difficulty: topic.difficulty,
      explanation: 'Strong JEE solving starts with identifying the right governing idea before algebra or arithmetic.',
      subject_id: topic.subject_id,
    },
    {
      id: `q-${topic.id}-6`,
      topic_id: topic.id,
      chapter_id: topic.chapter_id,
      concept_tag: baseTag,
      question_text: `Which concept is most central to ${topic.title}?`,
      options: [concepts[0], 'Only speed', 'Blind memorization', 'Skipping basics'],
      correct_answer: 0,
      difficulty: Math.max(1, topic.difficulty - 1),
      explanation: `${concepts[0]} is one of the central ideas in ${topic.title}.`,
      subject_id: topic.subject_id,
    },
    {
      id: `q-${topic.id}-7`,
      topic_id: topic.id,
      chapter_id: topic.chapter_id,
      concept_tag: baseTag,
      question_text: `Which supporting idea also appears in ${topic.title}?`,
      options: [concepts[1], 'No supporting idea is needed', 'Random option elimination', 'Only formula copying'],
      correct_answer: 0,
      difficulty: topic.difficulty,
      explanation: `${concepts[1]} is another supporting concept connected with ${topic.title}.`,
      subject_id: topic.subject_id,
    },
    {
      id: `q-${topic.id}-8`,
      topic_id: topic.id,
      chapter_id: topic.chapter_id,
      concept_tag: baseTag,
      question_text: `What is the biggest risk if a learner ignores the concept behind ${topicLabel}?`,
      options: [
        'They may apply the wrong method even after long calculations',
        'The answer becomes correct automatically',
        'Difficulty always decreases',
        'Prerequisites stop mattering',
      ],
      correct_answer: 0,
      difficulty: topic.difficulty,
      explanation: 'Ignoring the governing concept often leads to a wrong approach, even if the arithmetic is fine.',
      subject_id: topic.subject_id,
    },
    {
      id: `q-${topic.id}-9`,
      topic_id: topic.id,
      chapter_id: topic.chapter_id,
      concept_tag: baseTag,
      question_text: `Which study move best improves understanding of ${topicLabel}?`,
      options: [
        'Practice concept-based questions and review why each method works',
        'Memorize one answer and repeat it everywhere',
        'Avoid checking the chapter basics',
        'Skip all mixed problems',
      ],
      correct_answer: 0,
      difficulty: Math.min(5, topic.difficulty + 1),
      explanation: 'Topic mastery improves when learners connect method choice with the underlying concept.',
      subject_id: topic.subject_id,
    },
    {
      id: `q-${topic.id}-10`,
      topic_id: topic.id,
      chapter_id: topic.chapter_id,
      concept_tag: baseTag,
      question_text: `Which subject contains the topic ${topic.title}?`,
      options: [
        sampleSubjects.find((subject) => subject.id === topic.subject_id)?.name ?? 'Unknown subject',
        'A random unrelated subject',
        'No subject at all',
        'Every subject equally',
      ],
      correct_answer: 0,
      difficulty: Math.max(1, topic.difficulty - 1),
      explanation: `${topic.title} belongs to ${sampleSubjects.find((subject) => subject.id === topic.subject_id)?.name ?? 'its subject'}.`,
      subject_id: topic.subject_id,
    },
    {
      id: `q-${topic.id}-11`,
      topic_id: topic.id,
      chapter_id: topic.chapter_id,
      concept_tag: baseTag,
      question_text: `What should you check after solving a ${topic.title.toLowerCase()} problem?`,
      options: [
        'Whether the result matches the question conditions',
        'Whether the option length looks similar',
        'Whether you skipped the diagram',
        'Whether you avoided the prerequisite',
      ],
      correct_answer: 0,
      difficulty: topic.difficulty,
      explanation: 'Final verification is an important part of exam-quality problem solving.',
      subject_id: topic.subject_id,
    },
    {
      id: `q-${topic.id}-12`,
      topic_id: topic.id,
      chapter_id: topic.chapter_id,
      concept_tag: baseTag,
      question_text: `Which learner mistake is especially risky in ${topic.title}?`,
      options: [
        'Using a familiar method without checking whether it fits the problem',
        'Reading the question carefully',
        'Linking the topic to prerequisites',
        'Checking assumptions at the end',
      ],
      correct_answer: 0,
      difficulty: Math.min(5, topic.difficulty + 1),
      explanation: 'A common mistake is choosing a method because it looks familiar rather than because it fits.',
      subject_id: topic.subject_id,
    },
    {
      id: `q-${topic.id}-13`,
      topic_id: topic.id,
      chapter_id: topic.chapter_id,
      concept_tag: baseTag,
      question_text: `Where does ${topic.title} fit in the syllabus structure?`,
      options: [
        `It is one of the topics inside ${chapterTitle}`,
        'It belongs to no chapter at all',
        'It is only a revision trick, not a topic',
        'It replaces the whole chapter',
      ],
      correct_answer: 0,
      difficulty: topic.difficulty,
      explanation: `${topic.title} is one of the topics inside ${chapterTitle}.`,
      subject_id: topic.subject_id,
    },
    {
      id: `q-${topic.id}-14`,
      topic_id: topic.id,
      chapter_id: topic.chapter_id,
      concept_tag: baseTag,
      question_text: `Which phrase is most closely linked with ${topic.title}?`,
      options: [concepts[2], 'Random answer spotting', 'Skipping all steps', 'Never revising basics'],
      correct_answer: 0,
      difficulty: topic.difficulty,
      explanation: `${concepts[2]} is linked to the ideas practiced in ${topic.title}.`,
      subject_id: topic.subject_id,
    },
    {
      id: `q-${topic.id}-15`,
      topic_id: topic.id,
      chapter_id: topic.chapter_id,
      concept_tag: baseTag,
      question_text: `A learner is revising ${topic.title}. Which order makes the most sense?`,
      options: [
        'Recall prerequisite, identify concept, solve, then verify',
        'Guess first, read later, never verify',
        'Memorize only answers, skip theory',
        'Ignore chapter structure completely',
      ],
      correct_answer: 0,
      difficulty: Math.min(5, topic.difficulty + 1),
      explanation: 'The strongest revision order is concept-first, then solving, then verification.',
      subject_id: topic.subject_id,
    },
    {
      id: `q-${topic.id}-16`,
      topic_id: topic.id,
      chapter_id: topic.chapter_id,
      concept_tag: baseTag,
      question_text: `Which kind of practice is most useful after learning ${topic.title}?`,
      options: [
        'A mix of direct, application, and chapter-integrated questions',
        'Only reading solved answers once',
        'Only memorizing formulas without usage',
        'Avoiding all timed practice',
      ],
      correct_answer: 0,
      difficulty: topic.difficulty,
      explanation: 'Mixed practice helps learners transfer the topic into real exam settings.',
      subject_id: topic.subject_id,
    },
    {
      id: `q-${topic.id}-17`,
      topic_id: topic.id,
      chapter_id: topic.chapter_id,
      concept_tag: baseTag,
      question_text: `Why do prerequisites matter in ${topic.title}?`,
      options: [
        `Because ${topic.title} builds on earlier ideas like ${prerequisite}`,
        'Because prerequisites are decorative only',
        'Because every topic is independent',
        'Because exam questions never combine ideas',
      ],
      correct_answer: 0,
      difficulty: Math.max(1, topic.difficulty - 1),
      explanation: `${topic.title} depends on earlier ideas, so prerequisite understanding matters.`,
      subject_id: topic.subject_id,
    },
    {
      id: `q-${topic.id}-18`,
      topic_id: topic.id,
      chapter_id: topic.chapter_id,
      concept_tag: baseTag,
      question_text: `Which revision signal suggests you are improving in ${topic.title}?`,
      options: [
        'You can explain why a method works, not just use it',
        'You rely only on guesswork',
        'You skip checking conditions',
        'You avoid mixed questions',
      ],
      correct_answer: 0,
      difficulty: topic.difficulty,
      explanation: 'Real improvement shows up when the learner can justify the method, not just remember steps.',
      subject_id: topic.subject_id,
    },
    {
      id: `q-${topic.id}-19`,
      topic_id: topic.id,
      chapter_id: topic.chapter_id,
      concept_tag: baseTag,
      question_text: `Which choice is least helpful while preparing ${topic.title}?`,
      options: [
        'Ignoring why the method works',
        'Reviewing prerequisite ideas',
        'Practicing concept-linked questions',
        'Checking the final answer',
      ],
      correct_answer: 0,
      difficulty: topic.difficulty,
      explanation: 'Ignoring conceptual reasoning hurts long-term performance in the topic.',
      subject_id: topic.subject_id,
    },
    {
      id: `q-${topic.id}-20`,
      topic_id: topic.id,
      chapter_id: topic.chapter_id,
      concept_tag: baseTag,
      question_text: `What is the safest exam habit for ${topic.title}?`,
      options: [
        'Read the conditions carefully before applying the concept',
        'Jump to algebra before understanding the setup',
        'Trust the first guess every time',
        'Skip the last verification step',
      ],
      correct_answer: 0,
      difficulty: topic.difficulty,
      explanation: 'Careful reading prevents many avoidable mistakes in topic-based JEE questions.',
      subject_id: topic.subject_id,
    },
    {
      id: `q-${topic.id}-21`,
      topic_id: topic.id,
      chapter_id: topic.chapter_id,
      concept_tag: baseTag,
      question_text: `Which final check is most useful after solving a ${topic.title.toLowerCase()} question?`,
      options: [
        'Confirm that the method and final result both fit the question conditions',
        'Assume the first attempt is correct without checking',
        'Ignore units, sign, and constraints',
        'Skip comparison with the concept used',
      ],
      correct_answer: 0,
      difficulty: Math.min(5, topic.difficulty + 1),
      explanation: 'A final concept-and-condition check catches many avoidable exam mistakes.',
      subject_id: topic.subject_id,
    },
  ];
}

export const sampleQuestions: Question[] = sampleTopics.flatMap((topic) => buildTopicQuestionSet(topic));

export const sampleProgress: UserProgress[] = sampleLessons.map((lesson, index) => ({
  id: `progress-${lesson.id}`,
  user_id: DEMO_USER_ID,
  lesson_id: lesson.id,
  topic_id: lesson.topic_id,
  chapter_id: lesson.chapter_id,
  subject_id: lesson.subject_id,
  status: index === 0 ? 'available' : index < 9 ? 'in_progress' : 'locked',
  mastery_percent: index === 0 ? 68 : index < 9 ? 38 + (index % 5) * 9 : 0,
  last_accessed: index < 9 ? new Date().toISOString() : undefined,
  content_variant: 'default',
}));

export const sampleSessions: TestSession[] = sampleTopics.slice(0, 12).map((topic, index) => ({
  id: `session-${index + 1}`,
  user_id: DEMO_USER_ID,
  subject_id: topic.subject_id,
  chapter_id: topic.chapter_id,
  topic_id: topic.id,
  started_at: new Date(Date.now() - (index + 1) * 86400000).toISOString(),
  completed_at: new Date(Date.now() - (index + 1) * 86400000 + 2100000).toISOString(),
  answers: [],
  final_score: 58 + index * 5,
  ability_estimate: 50 + index * 4,
  weak_concepts: index % 2 === 0 ? [topic.key_concepts[0].toLowerCase().replace(/[^a-z0-9]+/g, '_')] : [],
  strong_concepts: [topic.key_concepts[0].toLowerCase().replace(/[^a-z0-9]+/g, '_')],
  status: 'completed',
}));
