import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

// "How we work together" — read-only, sub-facing reference. Copy is panel-reviewed
// (both CEOs + Fair-Work / AU-compliance / trades-ops lenses) per contractor-app/HOW-WE-WORK.md.
// Plain, dash-free, short sentences + a tap-to-expand FAQ (Allan 2026-06-09).
// ⚖️ This screen rides to the AU employment-lawyer pre-engagement review before it reaches a real sub.
// Pay-term wording reconciled (Cleo + Clifford, Rule 8): "7 days of finishing the job" but anchored
// to the sub's tax invoice (contractor / SOPA-safe). Agreement Clause 3 + sub-rate-schedule get the
// matching patch for the legal review. See HOW-WE-WORK.md.

type Rule = { n: number; title: string; body: string };

const RULES: Rule[] = [
  {
    n: 1,
    title: 'Every job is an offer. Your call.',
    body:
      'You can accept a job, decline it, or hand it back any time you like. Declining never costs you anything. We just offer it to someone else. You bring your own tools and gear, set your own availability, and you can work for whoever else you like.',
  },
  {
    n: 2,
    title: 'The office handles the customer.',
    body:
      'Pricing, payments and customer contact all stay with us. If a customer asks what the job costs, just say: "That\'s all handled through the office." You invoice us for the work you finish. Simple.',
  },
  {
    n: 3,
    title: 'Customer details are for this job only.',
    body:
      "You'll see the customer's name and address. That's enough to get there and do the work. You won't get their phone or email, because we look after all the contact. Please don't save, share or reuse their details. And please don't arrange private work with a customer we send you for 12 months after your last job for them. Outside of that, your business is your own.",
  },
  {
    n: 4,
    title: "Not as quoted? Stop and tap “I have a problem.”",
    body:
      "Maybe the job is bigger than the photos showed, or you find damage, or you can't get in. Stop before you do the extra work, add a photo, and flag it. We quote the customer again and pay you for the actual work, not the first guess. We deal with the customer, so you don't have to call them.",
  },
  {
    n: 5,
    title: 'Asbestos, or a home built before 1990? Stop.',
    body:
      'Old tiles, glue or backing can contain asbestos. If you think a job might, stop straight away. Don\'t disturb it. Take a photo from a safe distance, tap "I have a problem", and pick the asbestos option. Never cut, sand or drill it. Your safety always comes first. You will never be penalised for stopping a job that is not safe.',
  },
];

type Faq = { q: string; a: string };

const FAQ: Faq[] = [
  {
    q: "A customer asks what I'm paid, or what they paid",
    a: 'Just say: "All the pricing goes through the office." Friendly, but don\'t share any numbers.',
  },
  {
    q: 'A customer wants extra work',
    a: 'Don\'t quote it yourself. Tap "I have a problem", pick "Job bigger than quoted", and add a photo. We quote them again and you get paid for the real work. You can tell them: "I\'ll get the office to sort that out for you."',
  },
  {
    q: 'A customer wants to book me directly, or asks for my number',
    a: 'Keep it with the office. You can say: "Best to book through the office. They look after the booking and the warranty." Don\'t hand out your details for a customer we sent you.',
  },
  {
    q: "No one's home, or I can't get in",
    a: 'Wait about 15 minutes. Then tap "I have a problem", pick "Can\'t get access", and add a photo of the locked door or gate. We will contact the customer. You don\'t have to.',
  },
  {
    q: "I'm running late",
    a: 'Give the office a quick heads up as early as you can. Use "Message office" on the job, so we can let the customer know.',
  },
  {
    q: "I accepted a job but can't make it",
    a: 'Open the job and tap "Hand back" as early as you can, and we will sort out a new plan. This is different from Decline, which is for offers you have not taken on yet. Declining is always free.',
  },
  {
    q: 'I found asbestos, damage, or a bad surface',
    a: 'Tap "I have a problem", pick the reason that fits, add a photo, and submit. The job pauses and we step in. Don\'t patch over a bad surface just to finish.',
  },
  {
    q: 'How and when do I get paid?',
    a: "Your price is shown on each job before you accept it. When the job is done, upload your photos and send us your tax invoice. We pay you by bank transfer within 7 days of you finishing the job, and we never wait for the customer to pay us first. The app does not show invoices or payslips, so keep your own records.",
  },
  {
    q: "There's an urgent problem on site",
    a: 'Contact the office, never the customer. For anything on site, "I have a problem" alerts us and pauses the job so nothing goes wrong while you wait.',
  },
];

export function HowWeWork() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-surface)]">
      {/* Header */}
      <div className="bg-[var(--color-primary)] text-white px-2 py-2 flex items-center sticky top-0 z-20">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="h-11 w-11 flex items-center justify-center rounded-full hover:bg-white/10 text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold tracking-widest uppercase ml-1">How we work together</span>
      </div>

      <div className="p-4 pb-12 space-y-6">
        {/* Intro */}
        <p className="text-sm leading-relaxed text-[var(--color-primary)]">
          You run your own business. We send you jobs that are already quoted and paid for. You pick the ones
          you want, do great work, prove it with photos, and get paid. The office looks after the customer, the
          price and the money, so you never have to chase a lead or a payment.
        </p>

        {/* The 5 rules */}
        <div>
          <h2 className="text-xs font-bold text-[var(--color-secondary)] tracking-widest mb-3 uppercase">
            The 5 things that matter
          </h2>
          <div className="space-y-3">
            {RULES.map((r) => (
              <div key={r.n} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--color-accent)] text-[var(--color-primary)] flex items-center justify-center text-sm font-black">
                    {r.n}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[var(--color-primary)] mb-1">{r.title}</p>
                    <p className="text-sm leading-relaxed text-[var(--color-secondary)]">{r.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ — tap to expand */}
        <div>
          <h2 className="text-xs font-bold text-[var(--color-secondary)] tracking-widest mb-3 uppercase">
            What do I do when…
          </h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    className="w-full flex items-center justify-between gap-3 p-4 text-left min-h-[44px]"
                  >
                    <span className="text-sm font-bold text-[var(--color-primary)]">{f.q}</span>
                    <ChevronDown
                      className={cn(
                        'w-5 h-5 flex-shrink-0 text-[var(--color-secondary)] transition-transform duration-200',
                        open && 'rotate-180',
                      )}
                    />
                  </button>
                  {open && (
                    <p className="px-4 pb-4 text-sm leading-relaxed text-[var(--color-secondary)]">{f.a}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer disclaimer (UCT-safe: this is a summary, not the contract) */}
        <p className="text-xs leading-relaxed text-[var(--color-secondary)] italic px-1">
          This is a quick summary to help you on the job. Your signed Subcontractor Agreement is what actually
          governs the work.
        </p>
      </div>
    </div>
  );
}
