import React from 'react';
import { Activity, ArrowRight, BellRing, MapPinned, Navigation, Radio, UsersRound } from 'lucide-react';
import UrbanFloodLogo from '../components/shared/UrbanFloodLogo';

const capabilities = [
  { icon: MapPinned, title: 'See flood risk live', text: 'Explore ward-level water and risk information on the city map.' },
  { icon: Navigation, title: 'Choose a safer route', text: 'Compare routes with road flooding and your vehicle clearance in mind.' },
  { icon: UsersRound, title: 'Report what you see', text: 'Send a local flood or road incident report for authority review.' },
  { icon: BellRing, title: 'Stay aware', text: 'Check flood alerts and changing conditions before you travel.' },
];

export default function Landing({ onEnter }) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-canvas text-ink">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <UrbanFloodLogo size="md" />
        <span className="hidden rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-ink-secondary sm:inline-flex sm:items-center sm:gap-2"><span className="h-2 w-2 rounded-full bg-flood-safe" /> Flood-aware city companion</span>
      </header>

      <section className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-16 lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:pt-20">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-deep"><Activity className="h-4 w-4" /> Flood information for everyday decisions</p>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">Know the water <span className="text-primary">before you meet it.</span></h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-ink-secondary sm:text-lg">Check flood-aware routes, explore a real-time risk map, and report local incidents from one city-focused app.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => onEnter('/')} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-card transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">Enter Dashboard <ArrowRight className="h-4 w-4" /></button>
            <button type="button" onClick={() => onEnter('/live-map')} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-6 py-3 text-sm font-bold text-ink transition hover:bg-surface-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"><MapPinned className="h-4 w-4 text-primary" /> See it on the map</button>
          </div>
          <p className="mt-4 text-xs text-ink-muted">City flood information designed to help you plan your next move.</p>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-5 rounded-[2rem] bg-primary-tint" />
          <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-5 shadow-elevated sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-ink-muted">Illustrative city risk view</p><h2 className="mt-1 text-lg font-bold">Example ward conditions</h2></div><span className="inline-flex items-center gap-2 rounded-full bg-flood-safe/10 px-3 py-1.5 text-xs font-semibold text-flood-safe"><span className="h-2 w-2 rounded-full bg-flood-safe" /> Map view</span></div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[["Ward L", '24 cm', 'High'], ['Ward K-West', '34 cm', 'Critical'], ['Ward H-West', '7 cm', 'Moderate'], ['Ward A', '2 cm', 'Safe']].map(([ward, depth, risk]) => <div key={ward} className="rounded-2xl border border-border bg-surface-secondary p-4 sm:p-5"><div className="flex items-center justify-between gap-2"><span className="text-sm font-bold">{ward}</span><span className="h-2.5 w-2.5 rounded-full bg-primary" /></div><p className="mt-4 text-2xl font-extrabold tracking-tight">{depth}</p><p className="mt-1 text-xs text-ink-muted">Example water level</p><p className="mt-3 text-xs font-bold text-ink-secondary">{risk} risk</p></div>)}
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-primary-tint px-4 py-3 text-sm text-primary-deep"><Radio className="h-4 w-4 shrink-0" /><span>Ward-level context at a glance</span></div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface py-16 sm:py-20"><div className="mx-auto max-w-7xl px-5 sm:px-8"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-widest text-primary">One place to prepare</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">How it works</h2><p className="mt-3 text-ink-secondary">Useful local signals, from checking the map to sharing what is happening on your street.</p></div><div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{capabilities.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl border border-border bg-canvas p-5 sm:p-6"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary"><Icon className="h-5 w-5" /></div><h3 className="mt-4 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-ink-secondary">{text}</p></article>)}</div></div></section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16"><div className="mb-5 text-center"><h2 className="text-xl font-extrabold">Platform at a glance</h2><p className="mt-1 text-xs text-ink-muted">Product capabilities and coverage, not live telemetry.</p></div><div className="grid gap-4 sm:grid-cols-3">{[['7', 'ward areas represented'], ['3', 'voice guidance languages'], ['Live', 'map and alert updates']].map(([value, label]) => <div key={label} className="rounded-2xl border border-border bg-surface p-5 text-center sm:p-6"><p className="text-3xl font-extrabold text-primary">{value}</p><p className="mt-1 text-sm font-medium text-ink-secondary">{label}</p></div>)}</div></section>

      <footer className="border-t border-border bg-surface px-5 py-6 text-center text-xs leading-5 text-ink-muted sm:px-8">Urban Flood Intelligence — built to keep commuters, families, and first responders safer during monsoon flooding.</footer>
    </main>
  );
}
