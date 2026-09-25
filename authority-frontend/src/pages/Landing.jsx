import React from 'react';
import { Activity, ArrowRight, Building2, ClipboardCheck, RadioTower, ShieldCheck, Truck } from 'lucide-react';
import UrbanFloodCommandLogo from '../components/shared/UrbanFloodCommandLogo';

const capabilities = [
  { icon: Activity, title: 'City-wide flood monitoring', text: 'Review ward conditions, rainfall nowcasts, drainage networks, and mapped hotspots.' },
  { icon: RadioTower, title: 'Scenario and intervention planning', text: 'Explore flood scenarios and assess operational interventions before acting.' },
  { icon: ClipboardCheck, title: 'Incident response coordination', text: 'Review citizen reports, verify incidents, and coordinate response activity.' },
  { icon: Building2, title: 'Critical infrastructure awareness', text: 'Track exposed facilities and infrastructure risks alongside flood conditions.' },
];

export default function Landing({ onEnter }) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-canvas text-ink">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8"><UrbanFloodCommandLogo /><span className="hidden items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-ink-secondary sm:inline-flex"><RadioTower className="h-4 w-4 text-purple" /> Municipal response platform</span></header>

      <section className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-16 lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:pt-20">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-soft px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-purple-deep"><ShieldCheck className="h-4 w-4" /> Municipal flood operations</p>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">A clearer view of <span className="text-purple">city-wide flood response.</span></h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-ink-secondary sm:text-lg">Municipal operators and emergency teams can monitor flood risk, coordinate incidents, and plan operational responses from one command center.</p>
          <button type="button" onClick={onEnter} className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-purple px-6 py-3 text-sm font-bold text-white shadow-elevated transition hover:bg-purple-deep focus:outline-none focus:ring-2 focus:ring-purple focus:ring-offset-2 sm:w-auto">Access Command Center <ArrowRight className="h-4 w-4" /></button>
          <p className="mt-4 flex items-start gap-2 text-sm leading-6 text-ink-secondary"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-purple" /><span><strong className="text-ink">Restricted access.</strong> For authorized municipal and emergency personnel. Sign-in is required to continue.</span></p>
        </div>

        <div className="relative mx-auto w-full max-w-xl"><div className="absolute -inset-5 rounded-[2rem] bg-purple-light" /><div className="relative rounded-3xl border border-border bg-surface p-5 shadow-elevated sm:p-7">
          <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-ink-muted">Operations overview</p><h2 className="mt-1 text-lg font-bold">Monitor. Coordinate. Respond.</h2></div><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-soft text-purple"><RadioTower className="h-5 w-5" /></div></div>
          <div className="mt-6 space-y-3">{[[Activity, 'Flood and rainfall monitoring', 'Ward-level conditions and nowcast'], [ClipboardCheck, 'Incident coordination', 'Report review and response status'], [Truck, 'Response resources', 'Teams, shelters, and field operations']].map(([Icon, title, detail], index) => <div key={title} className="flex items-center gap-4 rounded-2xl border border-border bg-canvas p-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-soft text-purple"><Icon className="h-5 w-5" /></div><div className="min-w-0 flex-1"><p className="text-sm font-bold">{title}</p><p className="mt-1 text-xs leading-5 text-ink-secondary">{detail}</p></div><span className="font-mono text-xs text-ink-muted">0{index + 1}</span></div>)}</div>
        </div></div>
      </section>

      <section className="border-y border-border bg-surface py-16 sm:py-20"><div className="mx-auto max-w-7xl px-5 sm:px-8"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-widest text-purple">Operational capabilities</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Built for coordinated response</h2><p className="mt-3 text-ink-secondary">A shared operational view for monitoring conditions and organizing response work.</p></div><div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{capabilities.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl border border-border bg-canvas p-5 sm:p-6"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-soft text-purple"><Icon className="h-5 w-5" /></div><h3 className="mt-4 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-ink-secondary">{text}</p></article>)}</div></div></section>

      <footer className="border-t border-border bg-surface px-5 py-6 text-center text-xs leading-5 text-ink-muted sm:px-8">UrbanFlood Command — a unified operations layer for municipal flood response.</footer>
    </main>
  );
}
