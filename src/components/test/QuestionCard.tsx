import type { Question } from '../../types';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import MathText from '../ui/MathText';

export default function QuestionCard({
  question,
  index,
  total,
  selected,
  showResult,
  onSelect,
  onSubmit,
  isCorrect,
}: {
  question: Question;
  index: number;
  total: number;
  selected: number | null;
  showResult: boolean;
  onSelect: (value: number) => void;
  onSubmit: () => void;
  isCorrect: boolean;
}) {
  const difficultyTone = question.difficulty <= 2 ? 'success' : question.difficulty >= 4 ? 'error' : 'warning';
  const examLabel =
    question.exam_name && question.exam_year
      ? `${question.exam_name === 'JEE Main' ? 'JEE MAINS' : 'JEE ADVANCED'}(${question.exam_year})`
      : null;

  return (
    <Card className={showResult ? (isCorrect ? 'animate-[pulse-correct_0.8s_ease-out]' : 'animate-[shake-wrong_0.5s_ease-in-out]') : ''}>
      <div className="mb-5 flex items-start justify-between gap-4 sm:mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[#748476] sm:text-sm">Question {index + 1} of {total}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {examLabel ? (
              <Badge variant="indigo">{examLabel}</Badge>
            ) : null}
            <Badge variant={difficultyTone}>Difficulty {question.difficulty}</Badge>
          </div>
          <MathText
            value={question.question_text}
            className="mt-3 text-lg font-semibold leading-8 text-[#172519] sm:text-xl md:text-2xl"
          />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {question.options.map((option, optionIndex) => {
          const active = selected === optionIndex;
          const correct = showResult && optionIndex === question.correct_answer;
          const wrong = showResult && active && optionIndex !== question.correct_answer;

          return (
            <button
              key={option}
              type="button"
              disabled={showResult}
              onClick={() => onSelect(optionIndex)}
              className={[
                'w-full rounded-2xl border px-4 py-3.5 text-left text-sm font-medium transition-all duration-200 sm:px-4 sm:py-4',
                active
                  ? 'border-[#2fc84f] bg-[#effbf0] text-[#172519] shadow-[0_16px_28px_rgba(47,200,79,0.12)]'
                  : 'border-[#d8ead9] bg-white text-[#435445] hover:border-[#bee6c4] hover:bg-[#f7fff7]',
                correct ? 'border-[#1fa449] bg-[#effbf0] text-[#145c26]' : '',
                wrong ? 'border-[#e57d7d] bg-[#fff1f1] text-[#8c3030]' : '',
              ].join(' ')}
            >
              <MathText value={option} className="text-sm font-medium leading-7" />
            </button>
          );
        })}
      </div>

      {showResult ? (
        <div className="mt-6 rounded-[24px] border border-[#dcecdc] bg-[#f8fff8] p-4 text-sm leading-7 text-[#536255]">
          <MathText value={question.explanation} className="text-sm leading-7 text-[#536255]" />
        </div>
      ) : (
        <Button className="mt-6 w-full" size="lg" disabled={selected === null} onClick={onSubmit}>
          Submit Answer
        </Button>
      )}
    </Card>
  );
}
