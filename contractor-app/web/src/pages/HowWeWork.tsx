import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

// "How we work together" — read-only, sub-facing reference. Copy is panel-reviewed
// (both CEOs + Fair-Work / AU-compliance / trades-ops lenses) per contractor-app/HOW-WE-WORK.md.
// ⚖️ This screen rides to the AU employment-lawyer pre-engagement review before it reaches a real sub.
// Pay-term wording RECONCILED 2026-06-08 (Cleo + Clifford, Rule 8): kept Allan's "7 days of
// completing the job" headline but anchored it to the sub's tax invoice (contractor/SOPA-safe —
// an employee is paid for time, a contractor is paid against an invoice) + "we never wait on the
// customer" (we float). Agreement Clause 3 + sub-rate-schedule get the matching invoice-clock patch
// for the legal review (tracked separately). Pending Allan's nod + the AU employment-lawyer review
// (this whole screen rides to it). See HOW-WE-WORK.md:54.

type Rule = { n: number; title: string; body: string };

const RULES: Rule[] = [
  {
    n: 1,
    title: 'Every job is an offer — your call.',
    body:
      "Accept it, decline it, or hand it back, whenever you like. Declining costs you nothing, ever — we just offer it to someone else. You bring your own tools and gear, set your own availability, and you're free to work for whoever else you like.",
  },
  {
    n: 2,
    title: 'The office handles the customer.',
    body:
      'Pricing, payments and customer contact stay with us. If a customer asks what the job costs, just say: "That\'s all handled through the Timeless office." You invoice us for the work you complete — simple.',
  },
  {
    n: 3,
    title: "The customer's details are for this job only.",
    body:
      "You'll see the customer's name and address — enough to get there and do the work (you won't get their phone or email; we handle all contact). Please don't save, share or reuse their details, and don't arrange private work with a customer we send you for 12 months after your last job for them. Outside of that, your business is your own.",
  },
  {
    n: 4,
    title: 'Job not as quoted, or something off? Stop and tap "I have a problem."',
    body:
      "If the scope's bigger than the photos, you've found damage, or you can't get access — stop on the extra work, add a photo, and flag it. We re-quote the customer and you're paid for the actual work, not the original guess. We deal with the customer — no need to call them.",
  },
  {
    n: 5,
    title: 'Asbestos or a pre-1990 home? The law says stop — so stop.',
    body:
      'Old tiles, adhesive or backing can contain asbestos. If you suspect it: stop, don\'t disturb it, photo it from a safe distance, and tap "I have a problem" → "Asbestos / pre-1990." Never cut, sand or drill it. Your safety call always comes first — you\'ll never be penalised for stopping a job that isn\'t safe.',
  },
];

type Faq = { q: string; a: string };

const FAQ: Faq[] = [
  {
    q: "A customer asks what I'm paid, or what they paid",
    a: '"All the pricing goes through the office, mate." Friendly, but don\'t share numbers.',
  },
  {
    q: 'A customer wants extra work',
    a: 'Don\'t quote it. Tap "I have a problem" → "Job bigger than quoted," add a photo. We re-quote them; you get paid for the real work. Tell them: "I\'ll get the office to sort that for you."',
  },
  {
    q: 'A customer wants to book me directly / asks for my number',
    a: '"Best to go through Timeless — they look after the booking and the warranty." Don\'t hand out your details for a customer we sent you.',
  },
  {
    q: "No one's home / I can't get access",
    a: 'Wait about 15 minutes, then tap "I have a problem" → "Can\'t get access" with a photo of the locked door or gate. We contact the customer — you don\'t.',
  },
  {
    q: "I'm running late",
    a: 'Give the office a quick heads-up as early as you can, using "Message office" on the job, so we can let the customer know.',
  },
  {
    q: "I accepted a job but can't make it",
    a: 'Open the job and tap "Hand back" as early as you can — we re-arrange it. (Different from Decline, which is for offers you haven\'t taken on, and is always free.)',
  },
  {
    q: "I found asbestos / damaged something / the substrate's no good",
    a: 'Tap "I have a problem" → the matching reason, add a photo, submit. The job pauses and we step in. Don\'t patch over a bad substrate just to finish.',
  },
  {
    q: 'How and when do I get paid?',
    a: "Your price is shown on each job before you accept it. When the job's done, upload your photos and send us your tax invoice — we pay by bank transfer within 7 days of you completing the job, and we never wait on the customer to pay us first. The app doesn't show invoices or payslips, so keep your own records.",
  },
  {
    q: "There's an urgent problem on site",
    a: 'Contact the office — never the customer. For anything on-site, "I have a problem" alerts us and pauses the job so nothing goes wrong while you wait.',
  },
];

export function HowWeWork() {
  const navigate = useNavigate();

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
          You run your own business. We send you pre-quoted, pre-paid jobs — you pick the ones you want, do
          great work, prove it with photos, and get paid. The office handles the customer, the price and the
          money, so you never chase a lead or a payment.
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

        {/* FAQ */}
        <div>
          <h2 className="text-xs font-bold text-[var(--color-secondary)] tracking-widest mb-3 uppercase">
            What do I do when…
          </h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
                <p className="text-sm font-bold text-[var(--color-primary)] mb-1">{f.q}</p>
                <p className="text-sm leading-relaxed text-[var(--color-secondary)]">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer disclaimer (UCT-safe: this is a summary, not the contract) */}
        <p className="text-xs leading-relaxed text-[var(--color-secondary)] italic px-1">
          This is a quick summary to help you on the job — your signed Subcontractor Agreement is what
          actually governs the work.
        </p>
      </div>
    </div>
  );
}
