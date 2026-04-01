import type { Question } from '../../types';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

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

  return (
    <Card className={showResult ? (isCorrect ? 'animate-[pulse-correct_0.8s_ease-out]' : 'animate-[shake-wrong_0.5s_ease-in-out]') : ''}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-[#748476]">Question {index + 1} of {total}</p>
          <h2 className="mt-3 text-2xl font-semibold leading-snug text-[#172519]">{question.question_text}</h2>
        </div>
        <Badge variant={difficultyTone}>Difficulty {question.difficulty}</Badge>
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
                'w-full rounded-2xl border px-4 py-4 text-left text-sm font-medium transition-all duration-200',
                active
                  ? 'border-[#2fc84f] bg-[#effbf0] text-[#172519] shadow-[0_16px_28px_rgba(47,200,79,0.12)]'
                  : 'border-[#d8ead9] bg-white text-[#435445] hover:border-[#bee6c4] hover:bg-[#f7fff7]',
                correct ? 'border-[#1fa449] bg-[#effbf0] text-[#145c26]' : '',
                wrong ? 'border-[#e57d7d] bg-[#fff1f1] text-[#8c3030]' : '',
              ].join(' ')}
            >
              {option}
            </button>
          );
        })}
      </div>

      {showResult ? (
        <div className="mt-6 rounded-[24px] border border-[#dcecdc] bg-[#f8fff8] p-4 text-sm leading-7 text-[#536255]">
          {question.explanation}
        </div>
      ) : (
        <Button className="mt-6 w-full" size="lg" disabled={selected === null} onClick={onSubmit}>
          Submit Answer
        </Button>
      )}
    </Card>
  );
}
