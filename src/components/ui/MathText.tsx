import { Fragment } from 'react';
import { BlockMath, InlineMath } from 'react-katex';

type Segment =
  | { type: 'text'; value: string }
  | { type: 'inline-math'; value: string }
  | { type: 'block-math'; value: string };

function stripHtml(value: string) {
  if (!/[<>]/.test(value) || typeof window === 'undefined') {
    return value;
  }

  const parsed = new DOMParser().parseFromString(value, 'text/html');
  return parsed.body.textContent ?? value;
}

function normalizeMathSource(value: string) {
  return stripHtml(value)
    .replace(/\r\n/g, '\n')
    .replace(/\\\[/g, '$$')
    .replace(/\\\]/g, '$$')
    .replace(/\\\(/g, '$')
    .replace(/\\\)/g, '$')
    .replace(/Â°/g, '°')
    .trim();
}

function parseSegments(value: string): Segment[] {
  const input = normalizeMathSource(value);
  const segments: Segment[] = [];
  const pattern = /(\$\$[\s\S]+?\$\$|\$[^$]+\$)/g;
  let lastIndex = 0;

  input.replace(pattern, (match, _group, offset: number) => {
    if (offset > lastIndex) {
      segments.push({ type: 'text', value: input.slice(lastIndex, offset) });
    }

    if (match.startsWith('$$')) {
      segments.push({ type: 'block-math', value: match.slice(2, -2).trim() });
    } else {
      segments.push({ type: 'inline-math', value: match.slice(1, -1).trim() });
    }

    lastIndex = offset + match.length;
    return match;
  });

  if (lastIndex < input.length) {
    segments.push({ type: 'text', value: input.slice(lastIndex) });
  }

  return segments.length ? segments : [{ type: 'text', value: input }];
}

function renderText(value: string) {
  return value.split('\n').map((line, index) => (
    <Fragment key={`${line}-${index}`}>
      {index > 0 ? <br /> : null}
      {line}
    </Fragment>
  ));
}

export default function MathText({
  value,
  className = '',
}: {
  value: string;
  className?: string;
}) {
  const segments = parseSegments(value);

  return (
    <div className={`math-text ${className}`.trim()}>
      {segments.map((segment, index) => {
        if (segment.type === 'block-math') {
          return (
            <div key={`${segment.type}-${index}`} className="my-3 overflow-x-auto overflow-y-hidden">
              <BlockMath math={segment.value} />
            </div>
          );
        }

        if (segment.type === 'inline-math') {
          return <InlineMath key={`${segment.type}-${index}`} math={segment.value} />;
        }

        return <Fragment key={`${segment.type}-${index}`}>{renderText(segment.value)}</Fragment>;
      })}
    </div>
  );
}
