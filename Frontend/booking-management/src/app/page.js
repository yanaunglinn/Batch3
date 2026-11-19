'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CalendarDays, Clock3, CloudUpload, Search, X, Check, SlidersHorizontal } from 'lucide-react';

const initial = [
  { id: 1, student: 'Tun Yati Wai', parent: 'Daw Sandi Wai', dob: '2012-11-22', phone: '0979122499', date: '2026-08-20', time: '10:00', status: 'Pending', method: 'KBZ Pay', slip: '' },
  { id: 2, student: 'Thae Su Wai', parent: 'Daw Sandi Wai', dob: '2012-05-18', phone: '0979122499', date: '2026-08-18', time: '10:00', status: 'Accepted', method: 'Wave Pay', slip: '' },
  { id: 3, student: 'Honey May', parent: 'Daw Sandi Wai', dob: '2013-02-04', phone: '0979122499', date: '2026-08-15', time: '10:00', status: 'Rejected', method: 'KBZ Pay', slip: '' },
  { id: 4, student: 'Thura Phyo Wai', parent: 'Daw Sandi Wai', dob: '2011-06-10', phone: '0979122499', date: '2026-06-10', time: '10:00', status: 'Enrolled', method: 'CB Pay', slip: '' },
];
const blank = { student: '', parent: '', dob: '', phone: '', date: '', time: '', method: '', slip: '' };
const money = '10,000';
const fmtDate = (date) => date ? new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—';

function App() {
  const [bookings, setBookings] = useState(() => { try { return JSON.parse(localStorage.getItem('booking-management') || 'null') || initial; } catch { return initial; } });
  const [page, setPage] = useState('list');
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [notice, setNotice] = useState('');
  useEffect(() => localStorage.setItem('booking-management', JSON.stringify(bookings)), [bookings]);
  const filtered = useMemo(() => bookings.filter(b => `${b.student} ${b.parent}`.toLowerCase().includes(query.toLowerCase()) && (filter === 'All' || b.status === filter)), [bookings, query, filter]);
  const openForm = (booking) => { setEditing(booking?.id ?? null); setForm(booking ? { ...booking } : { ...blank }); setPage('form'); };
  const save = (e) => { e.preventDefault(); if (editing) setBookings(bs => bs.map(b => b.id === editing ? { ...b, ...form } : b)); else setBookings(bs => [{ ...form, id: Date.now(), status: 'Pending' }, ...bs]); setPage('list'); setNotice(editing ? 'Booking updated' : 'Booking created'); window.setTimeout(() => setNotice(''), 2600); };
  const update = (key, value) => setForm(f => ({ ...f, [key]: value }));
  const changeStatus = (id, status) => setBookings(bs => bs.map(b => b.id === id ? { ...b, status } : b));
  const upload = (file) => { if (file) update('slip', file.name); };

  if (page === 'form') return <FormPage form={form} update={update} save={save} back={() => setPage('list')} editing={!!editing} upload={upload} />;
  return <main className="list-page">
    <header className="list-header"><div><span className="eyebrow">LEVEL PLACEMENT TEST</span><h1>Booking List</h1><p className="subhead">Manage student bookings and payment confirmations.</p></div><button className="primary-button create" onClick={() => openForm()}><span>＋</span> Create Booking</button></header>
    <section className="toolbar"><label className="search"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search students or parents" /></label><label className="filter"><SlidersHorizontal size={16}/><select value={filter} onChange={e => setFilter(e.target.value)}>{['All','Pending','Accepted','Rejected','Enrolled'].map(s => <option key={s}>{s}</option>)}</select></label><span className="count">{filtered.length} bookings</span></section>
    <section className="booking-list">{filtered.map(b => <BookingCard key={b.id} booking={b} edit={() => openForm(b)} view={() => setSelected(b)} accept={() => changeStatus(b.id, 'Accepted')} />)}{filtered.length === 0 && <div className="empty"><div className="empty-icon">⌕</div><h3>No bookings found</h3><p>Try another search or create a new booking.</p><button className="text-button" onClick={() => { setQuery(''); setFilter('All'); }}>Clear filters</button></div>}</section>
    {notice && <div className="toast"><Check size={16}/>{notice}</div>}
    {selected && <div className="overlay" onMouseDown={e => e.target === e.currentTarget && setSelected(null)}><section className="detail-modal"><button className="close" onClick={() => setSelected(null)}><X size={20}/></button><div className="detail-head"><img src="/assets/icon.png"/><div><span className="eyebrow">BOOKING DETAILS</span><h2>{selected.student}</h2><p>{selected.parent}</p></div><Status status={selected.status}/></div><div className="detail-grid">{[['Date of birth',fmtDate(selected.dob)],['Parent phone',selected.phone || '—'],['Booking date',fmtDate(selected.date)],['Time slot',`${selected.time || '—'} AM to ${selected.time ? '10:45 AM' : '—'}`],['Payment method',selected.method || '—'],['Test fee',money],['Payment slip',selected.slip || 'Not uploaded']].map(([k,v])=><div className="detail-item" key={k}><span>{k}</span><strong>{v}</strong></div>)}</div><div className="modal-actions"><button className="secondary-button" onClick={() => {setSelected(null);openForm(selected);}}>Edit booking</button>{selected.status === 'Pending' && <button className="primary-button" onClick={() => {changeStatus(selected.id,'Accepted');setSelected({...selected,status:'Accepted'});}}>Confirm payment</button>}</div></section></div>}
  </main>;
}

function Status({ status }) { return <span className={`status ${status.toLowerCase()}`}><i/>{status}</span>; }
function BookingCard({ booking: b, edit, view, accept }) { return <article className="booking-card"><div className="student-art"><img src="/assets/icon.png" alt="Student" /></div><div className="student-info"><h2>{b.student}</h2><p>{b.parent}</p><div className="mobile-status"><Status status={b.status}/></div></div><div className="status-block"><img src="/assets/main.png" alt=""/><div><span className="meta-label">Status</span><Status status={b.status}/></div></div><div className="schedule"><div className="schedule-item"><img src="/assets/date.png" alt=""/><div><span className="meta-label">Date</span><strong>{fmtDate(b.date)}</strong></div></div><div className="schedule-item"><img src="/assets/time.png" alt=""/><div><span className="meta-label">Time</span><strong>{b.time ? `${b.time} AM to 10:45 AM` : '—'}</strong></div></div></div><div className="card-actions">{b.status === 'Pending' && <button title="Confirm payment" className="confirm-action" onClick={accept}><Check size={17}/></button>}<button title="Edit booking" className="edit-action" onClick={edit}><img src="/assets/edit.png" alt=""/></button><button title="View booking" className="view-action" onClick={view}><img src="/assets/view.png" alt=""/></button></div></article>; }

const instructions = [
  "Level Placement Test ဖြေဆိုရန် သတ်မှတ်ထားသော အသက်အရွယ်နှင့် ကိုက်ညီရပါမည်။ မွေးသက္ကရာဇ် (DOB) ကို စစ်ဆေးပါမည်။",
  "ရရှိနိုင်သော စာမေးပွဲရက်နှင့် အချိန်ကို ရွေးချယ်ပါ။",
  "ငွေပေးချေပြီးပါက Payment Slip ကို ရှင်းလင်းစွာ ဓာတ်ပုံရိုက်၍ တင်ပေးပါ။",
  "Admin မှ Payment Slip ကို စစ်ဆေးပြီး အတည်ပြုပေးပါမည်။",
  "ငွေပေးချေမှု အတည်ပြုပြီးနောက် Dashboard တွင် Zoom Link ကို တွေ့နိုင်ပါမည်။",
  "သတ်မှတ်ထားသော အချိန်တွင် Dashboard ရှိ 'Join to Zoom Class' ကို နှိပ်၍ အတန်းတက်ပါ။",
  "စာမေးပွဲရလဒ်ကို Admin မှ စစ်ဆေးပြီးနောက် Dashboard တွင် ဖော်ပြပေးပါမည်။",
  "ရက်ချိန်းပြောင်းရန် လိုအပ်ပါက Admin ကို ကြိုတင်ဆက်သွယ်ပါ။",
  "စာမေးပွဲကြေး ပြန်အမ်းမည်မဟုတ်ပါ (Non-refundable)။",
];
function FormPage({ form, update, save, back, editing, upload }) { return <main className="form-page"><button className="back-link" onClick={back}><ArrowLeft size={21}/><span>{editing ? 'Update Booking Information' : 'Level Placement Test Booking Information'}</span></button><div className="form-panel"><form className="booking-form" onSubmit={save}><div className="field-grid"><Field label="Student Name" value={form.student} onChange={v=>update('student',v)} required/><Field label="Parent Name" value={form.parent} onChange={v=>update('parent',v)} required/><Field label="Date of Birth" type="date" value={form.dob} onChange={v=>update('dob',v)} required/><Field label="Phone Number" type="tel" value={form.phone} onChange={v=>update('phone',v)} required/><Field label="Booking Date" type="date" value={form.date} onChange={v=>update('date',v)} required min={new Date().toISOString().slice(0,10)}/><Field label="Booking Time" type="time" value={form.time} onChange={v=>update('time',v)} required/></div><label className="field fee-field"><span>Level Placement Test Charges</span><div className="fee-input">{money}</div></label><label className="field"><span>Payment Method</span><select value={form.method} onChange={e=>update('method',e.target.value)} required><option value="">Please choose payment method</option><option>KBZ Pay</option><option>Wave Pay</option><option>CB Pay</option><option>Bank Transfer</option></select></label><label className="field"><span>Payment Slip</span><div className="upload-box"><label className="upload-button"><CloudUpload size={21}/><input type="file" accept="image/*,.pdf" onChange={e=>upload(e.target.files?.[0])}/></label><span className={form.slip ? 'uploaded' : ''}>{form.slip || 'Please upload your payment slip'}</span><span className="upload-hint">PNG, JPG or PDF</span></div></label><button className={`submit-button ${editing?'amber':''}`} type="submit">{editing ? 'Update Booking' : 'Book Test'}</button></form><aside className="instructions"><div className="instruction-title"><span className="eyebrow">PLEASE READ</span><h2>Instructions</h2></div><ul>{instructions.map((item,i)=><li key={i}>{item}</li>)}</ul><div className="fee-note">Test fee <strong>{money} MMK</strong><span>Non-refundable</span></div></aside></div></main>; }
function Field({ label, value, onChange, type='text', required, min }) { return <label className="field"><span>{label}</span><input type={type} value={value || ''} onChange={e=>onChange(e.target.value)} required={required} min={min} /></label>; }

export default App;


