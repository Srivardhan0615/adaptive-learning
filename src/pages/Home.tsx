import { ArrowRight, BookOpen, Brain, Sparkles, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

const features = [
  {
    title: 'Learn before you test',
    icon: BookOpen,
    description: 'Every path begins with a guided lesson card so students build confidence before they are scored.',
  },
  {
    title: 'Adaptive difficulty engine',
    icon: Target,
    description: 'The platform shifts challenge in real time, just like a modern mobile learning game.',
  },
  {
    title: 'Personalized lesson variants',
    icon: Brain,
    description: 'Weak concepts trigger softer, clearer lesson flows with more worked guidance and recovery support.',
  },
];

const stats = [
  { value: '24', label: 'Steps Complete' },
  { value: '73%', label: 'Ahead of Learners' },
  { value: '5', label: 'Streak Badges' },
];

export default function Home() {
  return (
    <div className="space-y-10 lg:space-y-14">
      <section className="relative overflow-hidden rounded-[32px] border border-[#dbe9d8] bg-[linear-gradient(135deg,#35c759_0%,#3dca54_54%,#79e262_100%)] px-5 py-12 shadow-[0_35px_85px_-35px_rgba(52,170,76,0.42)] sm:px-6 md:px-10 md:py-16 lg:rounded-[38px] lg:px-14 lg:py-20">
        <div className="absolute -left-12 top-8 h-40 w-40 rounded-[36px] bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-[#8be66d]/30 blur-3xl" />
        <div className="absolute inset-y-0 right-[18%] hidden w-px bg-white/16 lg:block" />

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/18 px-4 py-2 text-sm font-bold text-white">
              <Sparkles className="h-4 w-4" />
              Gamified adaptive learning platform
            </div>

            <div className="space-y-5">
              <h1 className="max-w-4xl text-4xl font-bold leading-[1.02] tracking-[-0.05em] text-white sm:text-5xl md:text-6xl xl:text-7xl">
                Learn like a modern app.
                <span className="block text-[#f7ffdc]">Track every win.</span>
              </h1>
              <p className="max-w-2xl text-base text-white/84 sm:text-lg md:text-xl">
                AdaptLearn now feels brighter, lighter, and more motivating, with chapter-based progress,
                cleaner cards, and a visual style inspired by playful mobile education products.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/learn">
                <Button size="lg" className="w-full bg-[#101916] text-white shadow-[0_24px_45px_-22px_rgba(0,0,0,0.35)] hover:bg-[#0c1511] sm:w-auto">
                  Start Learning Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#platform-overview">
                <Button size="lg" variant="secondary" className="w-full border-white/20 bg-white text-[#1f3223] hover:bg-[#f8fff5] sm:w-auto">
                  See How It Works
                </Button>
              </a>
            </div>

            <div className="metric-grid grid max-w-xl grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-[26px] border border-white/18 bg-white/14 p-4 text-center backdrop-blur-sm">
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="mt-2 text-sm text-white/78">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="theme-soft-panel rounded-[30px] p-5">
              <div className="theme-mock-surface rounded-[28px] p-5 text-white">
                <div className="flex items-center justify-between text-sm text-white/85">
                  <span>Python basics streak</span>
                  <span>24 steps completed</span>
                </div>
                <div className="mt-3 text-2xl font-semibold text-white">Green progress mission</div>
                <div className="mt-5 h-3 rounded-full bg-white/20">
                  <div className="progress-shimmer h-full w-[75%] rounded-full bg-white" />
                </div>
                <div className="mt-3 text-sm text-white/80">You are ahead of 73% of learners this week.</div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] border border-[#e3ebe0] bg-[#fbfdf9] p-5">
                  <div className="text-sm text-[#718074]">Quick check gate</div>
                  <div className="mt-3 text-4xl font-bold text-[#2bb64c]">2 / 3</div>
                  <div className="mt-2 text-sm text-[#718074]">Topic test unlocked after mastery check</div>
                </div>
                <div className="rounded-[24px] border border-[#e3ebe0] bg-[#fbfdf9] p-5">
                  <div className="text-sm text-[#718074]">Ability estimate</div>
                  <div className="mt-3 text-4xl font-bold text-[#172519]">58</div>
                  <div className="mt-2 text-sm text-[#718074]">Updated after every response</div>
                </div>
              </div>

              <div className="mt-4 rounded-[24px] border border-[#ffd99b] bg-[#fff6de] p-5">
                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[#c28b0e]">Personalized mode</div>
                <p className="mt-3 text-sm text-[#5e5c45]">
                  The next lesson automatically changes its pacing and explanation style when the system detects a gap.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="platform-overview" className="space-y-6">
        <div className="space-y-3">
          <p className="section-label">Platform Overview</p>
          <h2 className="text-3xl font-bold text-[#172519] md:text-4xl">Built like a playful learning product, not a heavy school portal</h2>
          <p className="max-w-3xl text-[#647367]">
            The experience combines structured teaching, real-time assessment, and concept-specific follow-up
            so the product keeps moving learners forward instead of handing them the same page again.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="card-hover h-full">
                <div className="mb-6 inline-flex rounded-[22px] border border-[#cdeacb] bg-gradient-to-br from-[#ebfaea] to-[#f9ffef] p-3">
                  <Icon className="h-6 w-6 text-[#31ba4d]" />
                </div>
                <h3 className="text-xl font-semibold text-[#172519]">{feature.title}</h3>
                <p className="mt-3 text-[#647367]">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
