import React, { useState } from 'react';
import type { Language, SectionCard, LocalizedString } from '../types';
import { compressImage } from '../utils/images';
import { SiteImage } from './SiteImage';

export function SectionCardsEditor({ cards, onChange, language }: { cards: SectionCard[]; onChange: (cards: SectionCard[]) => void; language: Language }) {
  const [locale, setLocale] = useState<Language>(language);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const update = (i: number, patch: Partial<SectionCard>) => onChange(cards.map((card, index) => index === i ? { ...card, ...patch } : card));
  const local = (value = ''): LocalizedString => ({ ar: value, en: '', fr: '', es: '', de: '' });
  return <div className="space-y-5">
    <div className="flex flex-wrap items-center gap-3">
      <label>لغة المحتوى <select aria-label="لغة محتوى البطاقات" value={locale} onChange={e => setLocale(e.target.value as Language)} className="border rounded-lg p-2">{(['ar', 'en', 'fr', 'es', 'de'] as Language[]).map(l => <option key={l} value={l}>{l}</option>)}</select></label>
      <button type="button" className="bg-[#183B56] text-white p-3 rounded-xl" onClick={() => onChange([...cards, { id: crypto.randomUUID(), title: local('عنوان جديد'), desc: local(), image: '', tag: {} }])}>إضافة بطاقة</button>
      <span className="text-sm">التعديلات تُحفظ تلقائيًا؛ انتظر تأكيد الحفظ أعلى اللوحة.</span>
    </div>
    {error && <p role="alert" className="text-red-700">{error}</p>}
    {cards.length === 0 && <p>لا توجد بطاقات. أضف أول بطاقة لتظهر في الموقع.</p>}
    {cards.map((card, i) => <div key={card.id ?? i} className="bg-white border border-[#E8DFD0] rounded-2xl p-5 space-y-3">
      {card.image && <SiteImage src={card.image} alt={card.title.ar} className="w-40 h-24 object-cover rounded-xl" />}
      <label className="block">العنوان<input className="block w-full border rounded-lg p-2" value={card.title[locale] ?? ''} onChange={e => update(i, { title: { ...card.title, [locale]: e.target.value } })} /></label>
      <label className="block">الوصف<textarea className="block w-full border rounded-lg p-2" rows={3} value={card.desc[locale] ?? ''} onChange={e => update(i, { desc: { ...card.desc, [locale]: e.target.value } })} /></label>
      <label className="block">التصنيف المختصر<input className="block w-full border rounded-lg p-2" value={card.tag?.[locale] ?? ''} onChange={e => update(i, { tag: { ...card.tag, [locale]: e.target.value } })} /></label>
      <label className="block">رابط الصورة<input className="block w-full border rounded-lg p-2" value={card.image} onChange={e => update(i, { image: e.target.value })} /></label>
      <label className="block">رفع صورة مضغوطة<input disabled={busy} type="file" accept="image/jpeg,image/png,image/webp" onChange={async e => {
        const file = e.target.files?.[0]; if (!file) return;
        const target = e.target; setBusy(true); setError('');
        try { update(i, { image: await compressImage(file) }); } catch (err) { setError(err instanceof Error ? err.message : 'تعذر رفع الصورة'); }
        finally { setBusy(false); target.value = ''; }
      }} /></label>
      <div className="flex gap-3">
        <button disabled={i === 0} type="button" onClick={() => { const next = [...cards]; [next[i - 1], next[i]] = [next[i], next[i - 1]]; onChange(next); }}>تحريك لأعلى</button>
        <button disabled={i === cards.length - 1} type="button" onClick={() => { const next = [...cards]; [next[i + 1], next[i]] = [next[i], next[i + 1]]; onChange(next); }}>تحريك لأسفل</button>
        <button type="button" className="text-red-700" onClick={() => { if (confirm('حذف هذه البطاقة؟')) onChange(cards.filter((_, index) => i !== index)); }}>حذف البطاقة</button>
      </div>
    </div>)}
  </div>;
}
