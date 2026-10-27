import React, { useMemo, useState, useEffect } from 'react'
import {
  Activity, CalendarDays, CalendarCheck, Clock3, CreditCard, Bell, Settings,
  LayoutDashboard, Stethoscope, Users, UserRound, Search, Menu, X, HeartPulse,
  ChevronRight, ArrowUpRight, CheckCircle2, CircleDollarSign, ClipboardList,
  UserPlus, FileText, LogOut, ShieldCheck, SlidersHorizontal, Plus, Check,
  MapPin, Phone, Mail, MoreHorizontal, CalendarClock, BadgeCheck, Wallet,
  BriefcaseMedical, ChartNoAxesCombined, Trash2, Pencil, CircleAlert, Sun, Moon
} from 'lucide-react'

const doctorsSeed = [
  { id: 1, name: 'Dr. Ananya Sharma', specialty: 'Cardiology', experience: '12 years', fee: 800, rating: '4.9', initials: 'AS', available: true },
  { id: 2, name: 'Dr. Rohan Mehta', specialty: 'Dermatology', experience: '8 years', fee: 600, rating: '4.8', initials: 'RM', available: true },
  { id: 3, name: 'Dr. Priya Nair', specialty: 'Neurology', experience: '10 years', fee: 1000, rating: '4.9', initials: 'PN', available: true },
  { id: 4, name: 'Dr. Arjun Patel', specialty: 'Orthopedics', experience: '9 years', fee: 700, rating: '4.7', initials: 'AP', available: false },
]
const initialAppointments = [
  { id: 'APT-1001', patient: 'Rahul Verma', doctor: 'Dr. Ananya Sharma', specialty: 'Cardiology', date: '2026-11-02', time: '10:30 AM', status: 'Confirmed', fee: 800, payment: 'Paid' },
  { id: 'APT-1002', patient: 'Priya Singh', doctor: 'Dr. Rohan Mehta', specialty: 'Dermatology', date: '2026-11-02', time: '12:00 PM', status: 'Pending', fee: 600, payment: 'Pending' },
  { id: 'APT-1003', patient: 'Aman Joshi', doctor: 'Dr. Priya Nair', specialty: 'Neurology', date: '2026-11-03', time: '09:30 AM', status: 'Confirmed', fee: 1000, payment: 'Paid' },
]
const roleMeta = {
  Patient: { name: 'Rahul Verma', initials: 'RV', subtitle: 'Your health journey, all in one place.' },
  Doctor: { name: 'Dr. Ananya Sharma', initials: 'AS', subtitle: 'Manage your schedule and patient appointments.' },
  Receptionist: { name: 'Meera Joshi', initials: 'MJ', subtitle: 'Coordinate bookings and clinic operations.' },
  Admin: { name: 'Clinic Admin', initials: 'AD', subtitle: 'Monitor clinic activity from one workspace.' },
}
const menuByRole = {
  Patient: [
    ['Overview', LayoutDashboard], ['Find Doctors', Stethoscope], ['Appointments', CalendarDays],
    ['Payments', Wallet], ['Notifications', Bell], ['Settings', Settings],
  ],
  Doctor: [
    ['Overview', LayoutDashboard], ['My Appointments', CalendarDays], ['Schedule', CalendarClock],
    ['Patients', Users], ['Notifications', Bell], ['Settings', Settings],
  ],
  Receptionist: [
    ['Overview', LayoutDashboard], ['Appointments', CalendarDays], ['Book Appointment', Plus],
    ['Patients', Users], ['Payments', Wallet], ['Settings', Settings],
  ],
  Admin: [
    ['Overview', LayoutDashboard], ['Doctors', Stethoscope], ['Patients', Users],
    ['Appointments', CalendarDays], ['Payments', Wallet], ['Reports', ChartNoAxesCombined],
    ['Settings', Settings],
  ],
}
const money = value => `₹${Number(value).toLocaleString('en-IN')}`
const dateLabel = date => new Date(`${date}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

function Badge({ children, tone = 'neutral' }) {
  const styles = {
    success: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    warning: 'bg-amber-50 text-amber-700 ring-amber-100',
    info: 'bg-cyan-50 text-cyan-700 ring-cyan-100',
    neutral: 'bg-slate-100 text-slate-600 ring-slate-200',
    danger: 'bg-rose-50 text-rose-700 ring-rose-100',
  }
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${styles[tone]}`}>{children}</span>
}
function Card({ children, className = '' }) { return <section className={`card p-5 ${className}`}>{children}</section> }
function SectionTitle({ title, subtitle, action }) {
  return <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-base font-bold text-teal">{title}</h2>{subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}</div>{action}</div>
}
function Empty({ title, description }) {
  return <div className="flex flex-col items-center justify-center py-12 text-center"><div className="mb-3 rounded-2xl bg-cyan-50 p-4 text-aqua"><CalendarDays size={25}/></div><p className="font-semibold text-teal">{title}</p><p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p></div>
}
function StatCard({ icon: Icon, label, value, hint, tint = 'cyan' }) {
  const color = tint === 'green' ? 'bg-emerald-50 text-emerald-600' : tint === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-cyan-50 text-aqua'
  return <div className="card p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold tracking-tight text-teal">{value}</p><p className="mt-1 text-xs text-slate-400">{hint}</p></div><div className={`rounded-xl p-3 ${color}`}><Icon size={21}/></div></div></div>
}
function DoctorAvatar({ initials, large = false }) {
  return <div className={`flex shrink-0 items-center justify-center rounded-2xl bg-cyan-50 font-bold text-teal ring-1 ring-inset ring-cyan-100 ${large ? 'h-14 w-14 text-base' : 'h-11 w-11 text-sm'}`}>{initials}</div>
}

export default function App() {
  const [role, setRole] = useState('Patient')
  const [page, setPage] = useState('Overview')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [doctors, setDoctors] = useState(doctorsSeed)
  const [appointments, setAppointments] = useState(initialAppointments)
  const [query, setQuery] = useState('')
  const [specialty, setSpecialty] = useState('All specialties')
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState('')
  const [profile, setProfile] = useState({ name: 'Rahul Verma', email: 'rahul@example.com', phone: '98765 43210' })
  const [form, setForm] = useState({ doctorId: '1', date: '2026-11-05', time: '10:30 AM', patient: 'Rahul Verma' })
  const [notificationRead, setNotificationRead] = useState(false)
  const [settingsSaved, setSettingsSaved] = useState(false)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('medicare-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  })

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('medicare-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      notify(`Switched to ${next} theme.`)
      return next
    })
  }

  useEffect(() => {
    const handleKeyDown = e => {
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)
      if ((e.ctrlKey && e.key.toLowerCase() === 'd') || (e.altKey && e.key.toLowerCase() === 't') || (!isInput && !e.ctrlKey && !e.altKey && !e.metaKey && e.key.toLowerCase() === 'd')) {
        e.preventDefault()
        toggleTheme()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  const meta = roleMeta[role]
  const menu = menuByRole[role]
  const filteredDoctors = useMemo(() => doctors.filter(d => `${d.name} ${d.specialty}`.toLowerCase().includes(query.toLowerCase()) && (specialty === 'All specialties' || d.specialty === specialty)), [doctors, query, specialty])
  const currentDoctor = doctors.find(d => d.id === Number(form.doctorId)) || doctors[0]
  const notify = message => { setToast(message); window.setTimeout(() => setToast(''), 2600) }
  const navigate = next => { setPage(next); setMobileOpen(false); setQuery('') }
  const changeRole = next => {
    setRole(next)
    setPage('Overview')
    setMobileOpen(false)
    if (next === 'Patient') setProfile(p => ({ ...p, name: 'Rahul Verma' }))
  }
  const createAppointment = e => {
    e.preventDefault()
    const doctor = doctors.find(d => d.id === Number(form.doctorId))
    if (!doctor) return
    const newAppointment = {
      id: `APT-${1004 + appointments.length - 3}`,
      patient: role === 'Receptionist' ? form.patient : profile.name,
      doctor: doctor.name, specialty: doctor.specialty, date: form.date, time: form.time,
      status: 'Pending', fee: doctor.fee, payment: 'Pending',
    }
    setAppointments(prev => [newAppointment, ...prev])
    setModal(null)
    setPage(role === 'Patient' ? 'Appointments' : 'Appointments')
    notify('Appointment added to this demo successfully.')
  }
  const updateStatus = (id, status) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a))
    notify(`Appointment ${status.toLowerCase()}.`)
  }
  const updateDoctor = (id, field, value) => setDoctors(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d))
  const titleForPage = page === 'Overview' ? (role === 'Patient' ? 'Good morning, Rahul 👋' : `${role} dashboard`) : page
  const subtitleForPage = page === 'Overview' ? meta.subtitle : `Manage ${page.toLowerCase()} in one place.`

  const sidebar = <aside className="flex h-full flex-col bg-white p-4">
    <div className="mb-8 flex items-center gap-3 px-2 pt-1">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-aqua text-white shadow-sm"><HeartPulse size={24}/></div>
      <div><p className="text-lg font-extrabold tracking-tight text-teal">MediCare</p><p className="text-[10px] font-semibold tracking-[.16em] text-slate-400">HEALTHCARE PORTAL</p></div>
      <button onClick={() => setMobileOpen(false)} className="ml-auto rounded-lg p-2 text-slate-400 lg:hidden" aria-label="Close menu"><X size={19}/></button>
    </div>
    <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">Workspace</p>
    <nav className="space-y-1">
      {menu.map(([label, Icon]) => <button key={label} onClick={() => navigate(label)} className={`nav-item ${page === label ? 'active' : ''}`}><Icon size={18}/><span>{label}</span>{page === label && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-aqua"/>}</button>)}
    </nav>
    <div className="mt-7 border-t border-borderSoft pt-5">
      <label className="mb-2 block px-3 text-[10px] font-bold uppercase tracking-[.16em] text-slate-400" htmlFor="role-select">Preview role</label>
      <select id="role-select" value={role} onChange={e => changeRole(e.target.value)} className="field">
        {Object.keys(roleMeta).map(r => <option key={r}>{r}</option>)}
      </select>
    </div>
    <div className="mt-auto pt-8">
      <div className="rounded-2xl bg-pale p-4"><div className="mb-2 flex items-center gap-2 text-aqua"><ShieldCheck size={19}/><span className="text-xs font-bold text-teal">Care you can trust</span></div><p className="text-xs leading-5 text-slate-500">A simple space for managing healthcare appointments.</p></div>
      <button onClick={() => notify('This is a frontend demo. Sign-out is not connected.')} className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500 hover:bg-pale"><LogOut size={17}/> Sign out</button>
    </div>
  </aside>

  function renderOverview() {
    const myAppointments = role === 'Patient' ? appointments.filter(a => a.patient === profile.name) : role === 'Doctor' ? appointments.filter(a => a.doctor === 'Dr. Ananya Sharma') : appointments
    const totalCount = role === 'Patient' ? myAppointments.length : role === 'Doctor' ? myAppointments.length : appointments.length
    return <div className="space-y-6">
      <div className="grid-bg overflow-hidden rounded-2xl border border-cyan-100 p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="max-w-xl"><Badge tone="info">YOUR HEALTH COMPANION</Badge><h2 className="mt-3 text-2xl font-bold tracking-tight text-teal sm:text-3xl">{role === 'Patient' ? 'Your health comes first.' : role === 'Doctor' ? 'Your clinic at a glance.' : role === 'Receptionist' ? 'Keep every visit on track.' : 'Welcome to clinic management.'}</h2><p className="mt-2 max-w-lg text-sm leading-6 text-slate-600">{role === 'Patient' ? 'Find a specialist, book a convenient time, and keep your appointments organised.' : role === 'Doctor' ? 'Review your upcoming visits and keep your availability up to date.' : role === 'Receptionist' ? 'Book visits, check schedules, and help patients get the care they need.' : 'Manage doctors, patients, appointments and clinic activity from one place.'}</p><button onClick={() => role === 'Patient' || role === 'Receptionist' ? (setForm(f => ({ ...f, patient: role === 'Patient' ? profile.name : '' })), setModal('booking')) : navigate(role === 'Doctor' ? 'Schedule' : 'Doctors')} className="btn-primary mt-5">{role === 'Patient' || role === 'Receptionist' ? 'Book an appointment' : role === 'Doctor' ? 'Manage schedule' : 'Manage doctors'}<ChevronRight size={17}/></button></div>
          <div className="hidden h-28 w-28 shrink-0 items-center justify-center rounded-[2rem] bg-white/90 text-aqua shadow-soft sm:flex"><HeartPulse size={54} strokeWidth={1.5}/></div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={CalendarCheck} label={role === 'Patient' ? 'My appointments' : 'Total appointments'} value={String(totalCount).padStart(2, '0')} hint="In this demo workspace"/>
        <StatCard icon={Users} label={role === 'Patient' ? 'Available doctors' : 'Registered patients'} value={role === 'Patient' ? doctors.filter(d => d.available).length : '24'} hint="Sample data" tint="green"/>
        <StatCard icon={Clock3} label="Pending visits" value={String(appointments.filter(a => a.status === 'Pending').length).padStart(2, '0')} hint="Awaiting confirmation" tint="amber"/>
        <StatCard icon={CircleDollarSign} label="Consultation fee" value={money(role === 'Patient' ? 800 : appointments.reduce((sum, a) => sum + a.fee, 0))} hint={role === 'Patient' ? 'Example doctor fee' : 'Sample appointment value'}/>
      </div>
      {role === 'Patient' && <Card>
        <SectionTitle title="Upcoming appointment" subtitle="Your next scheduled visit" action={<button className="text-sm font-semibold text-aqua hover:text-teal" onClick={() => navigate('Appointments')}>View all <ArrowUpRight size={15} className="ml-1 inline"/></button>}/>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <DoctorAvatar initials="AS" large/>
          <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-teal">Dr. Ananya Sharma</h3><Badge tone="success">Confirmed</Badge></div><p className="mt-1 text-sm text-slate-500">Cardiology · General consultation</p><div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500"><span className="inline-flex items-center gap-1.5"><CalendarDays size={15}/> 2 Nov 2026</span><span className="inline-flex items-center gap-1.5"><Clock3 size={15}/> 10:30 AM</span></div></div>
          <div className="flex items-center justify-between gap-3 border-t border-borderSoft pt-3 sm:border-0 sm:pt-0"><div><p className="text-xs text-slate-400">Consultation fee</p><p className="mt-1 text-xl font-bold text-teal">{money(800)}</p></div><button className="btn-secondary" onClick={() => navigate('Appointments')}>Details</button></div>
        </div>
      </Card>}
      <div><SectionTitle title={role === 'Patient' ? 'Recommended doctors' : 'Recent appointments'} subtitle={role === 'Patient' ? 'Choose a specialist for your next visit' : 'Latest activity in your clinic'} action={<button onClick={() => navigate(role === 'Patient' ? 'Find Doctors' : 'Appointments')} className="text-sm font-semibold text-aqua hover:text-teal">View all <ChevronRight size={15} className="ml-1 inline"/></button>}/>
        {role === 'Patient' ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{doctors.slice(0, 3).map(d => <DoctorCard key={d.id} doctor={d} onBook={() => { setForm(f => ({ ...f, doctorId: String(d.id), patient: profile.name })); setModal('booking') }}/> )}</div> : <AppointmentTable appointments={appointments.slice(0, 3)} role={role} onStatus={updateStatus}/>}
      </div>
    </div>
  }

  function renderDoctors() {
    return <div className="space-y-5">
      <Card className="grid-bg"><h2 className="text-xl font-bold text-teal">Find your specialist</h2><p className="mt-1 text-sm text-slate-500">Browse available doctors and choose a suitable time.</p><div className="mt-4 grid gap-3 sm:grid-cols-[1fr_220px]"><div className="relative flex items-center">{!query && <Search className="pointer-events-none absolute left-3.5 top-3 text-slate-400" size={17}/>}<input className={`field transition-all ${query ? 'pl-3.5 pr-9' : 'pl-10'}`} value={query} onChange={e => setQuery(e.target.value)} placeholder="Search doctor or specialty..."/>{query && <button type="button" onClick={() => setQuery('')} className="absolute right-3 top-3 text-slate-400 hover:text-teal" aria-label="Clear search"><X size={17}/></button>}</div><select className="field" value={specialty} onChange={e => setSpecialty(e.target.value)}><option>All specialties</option>{[...new Set(doctors.map(d => d.specialty))].map(s => <option key={s}>{s}</option>)}</select></div></Card>
      {filteredDoctors.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filteredDoctors.map(d => <DoctorCard key={d.id} doctor={d} onBook={() => { setForm(f => ({ ...f, doctorId: String(d.id), patient: profile.name })); setModal('booking') }}/>)}</div> : <Card><Empty title="No doctors found" description="Try another name or choose a different specialty."/></Card>}
    </div>
  }

  function renderAppointments() {
    const list = role === 'Patient' ? appointments.filter(a => a.patient === profile.name) : role === 'Doctor' ? appointments.filter(a => a.doctor === 'Dr. Ananya Sharma') : appointments
    return <Card><SectionTitle title={role === 'Patient' ? 'My appointments' : 'Appointment management'} subtitle="Review appointment details and status" action={(role === 'Patient' || role === 'Receptionist') && <button className="btn-primary" onClick={() => { setForm(f => ({ ...f, patient: role === 'Patient' ? profile.name : '' })); setModal('booking') }}><Plus size={16}/> New booking</button>}/>{list.length ? <AppointmentTable appointments={list} role={role} onStatus={updateStatus}/> : <Empty title="No appointments yet" description="Book an appointment to see it listed here."/>}</Card>
  }

  function renderSchedule() {
    const slots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM']
    return <div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
      <Card><SectionTitle title="Availability schedule" subtitle="Monday, 2 November 2026"/><div className="space-y-2">{slots.map((s, i) => <div key={s} className="flex items-center justify-between gap-3 rounded-xl border border-borderSoft p-3"><div className="flex items-center gap-3"><div className="rounded-lg bg-cyan-50 p-2 text-aqua"><Clock3 size={17}/></div><span className="text-sm font-medium text-teal">{s}</span></div><Badge tone={i === 3 ? 'warning' : 'success'}>{i === 3 ? 'Booked' : 'Available'}</Badge><button onClick={() => notify(`${s} selected in the demo schedule.`)} className="rounded-lg p-2 text-slate-400 hover:bg-pale"><MoreHorizontal size={18}/></button></div>)}</div></Card>
      <Card><SectionTitle title="Schedule summary" subtitle="Your working day"/><div className="space-y-4"><div className="rounded-xl bg-pale p-4"><p className="text-sm text-slate-500">Working hours</p><p className="mt-1 text-lg font-bold text-teal">09:00 AM – 05:00 PM</p></div><div className="flex items-center justify-between"><span className="text-sm text-slate-500">Available slots</span><span className="font-bold text-teal">7</span></div><div className="flex items-center justify-between"><span className="text-sm text-slate-500">Booked slots</span><span className="font-bold text-teal">1</span></div><button onClick={() => notify('Schedule changes are demo-only; backend not connected.')} className="btn-primary w-full"><Check size={16}/> Save availability</button></div></Card>
    </div>
  }

  function renderPayments() {
    return <div className="space-y-5"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"><StatCard icon={Wallet} label="Total paid" value={money(1800)} hint="Demo transactions" tint="green"/><StatCard icon={Clock3} label="Pending payments" value={money(600)} hint="Awaiting payment" tint="amber"/><StatCard icon={CreditCard} label="Transactions" value="03" hint="Sample payment history"/></div><Card><SectionTitle title="Payment history" subtitle="Consultation charges and transaction status"/><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead><tr className="border-b border-borderSoft text-xs uppercase tracking-wide text-slate-400"><th className="pb-3 font-semibold">Transaction</th><th className="pb-3 font-semibold">Patient</th><th className="pb-3 font-semibold">Method</th><th className="pb-3 font-semibold">Amount</th><th className="pb-3 font-semibold">Status</th></tr></thead><tbody>{[{id:'PAY-3001',patient:'Rahul Verma',method:'UPI',fee:800,status:'Paid'},{id:'PAY-3002',patient:'Priya Singh',method:'Card',fee:600,status:'Pending'},{id:'PAY-3003',patient:'Aman Joshi',method:'UPI',fee:1000,status:'Paid'}].map(p => <tr key={p.id} className="border-b border-slate-50 last:border-0"><td className="py-4 font-semibold text-teal">{p.id}</td><td className="py-4 text-slate-600">{p.patient}</td><td className="py-4 text-slate-600">{p.method}</td><td className="py-4 font-semibold text-teal">{money(p.fee)}</td><td className="py-4"><Badge tone={p.status === 'Paid' ? 'success' : 'warning'}>{p.status}</Badge></td></tr>)}</tbody></table></div></Card></div>
  }

  function renderNotifications() {
    const items = [{title:'Appointment confirmed',body:'Your visit with Dr. Ananya Sharma is scheduled for 2 Nov at 10:30 AM.',time:'Today',icon:CalendarCheck},{title:'Payment update',body:'Your demo payment history has been updated.',time:'Yesterday',icon:CreditCard},{title:'Appointment reminder',body:'Remember to review the details of your upcoming visit.',time:'2 days ago',icon:Bell}]
    return <Card><SectionTitle title="Notifications" subtitle="Updates about your appointments and account" action={<button className="btn-secondary" onClick={() => {setNotificationRead(true); notify('All notifications marked as read.')}}>Mark all read</button>}/><div className="divide-y divide-slate-100">{items.map((n, i) => <div key={n.title} className={`flex gap-4 py-5 first:pt-1 ${!notificationRead && i === 0 ? 'bg-cyan-50/40' : ''}`}><div className="h-fit rounded-xl bg-cyan-50 p-3 text-aqua"><n.icon size={19}/></div><div className="flex-1"><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-semibold text-teal">{n.title}</p>{!notificationRead && i === 0 && <span className="h-2 w-2 rounded-full bg-aqua"/>}</div><p className="mt-1 text-sm leading-6 text-slate-500">{n.body}</p><p className="mt-2 text-xs text-slate-400">{n.time}</p></div></div>)}</div></Card>
  }

  function renderPatients() {
    const people = role === 'Doctor' ? appointments.filter(a => a.doctor === 'Dr. Ananya Sharma').map(a => ({ name: a.patient, sub: `${a.specialty} · ${dateLabel(a.date)}`, id: a.id })) : [{name:'Rahul Verma',sub:'Patient · P-101',id:'P-101'},{name:'Priya Singh',sub:'Patient · P-102',id:'P-102'},{name:'Aman Joshi',sub:'Patient · P-103',id:'P-103'}]
    return <Card><SectionTitle title="Patient records" subtitle="Demo patient list"/><div className="space-y-2">{people.map(p => <div key={p.id} className="flex items-center gap-3 rounded-xl border border-borderSoft p-3"><DoctorAvatar initials={p.name.split(' ').map(x => x[0]).join('').slice(0,2)}/><div className="flex-1"><p className="text-sm font-semibold text-teal">{p.name}</p><p className="mt-1 text-xs text-slate-500">{p.sub}</p></div><button className="btn-secondary" onClick={() => notify(`Viewing ${p.name} (demo only).`)}>View</button></div>)}</div></Card>
  }

  function renderDoctorsAdmin() {
    return <Card><SectionTitle title="Manage doctors" subtitle="Doctor directory and availability" action={<button className="btn-primary" onClick={() => notify('Add-doctor form can be connected in the backend phase.')}><UserPlus size={16}/> Add doctor</button>}/><div className="space-y-3">{doctors.map(d => <div key={d.id} className="flex flex-col gap-3 rounded-xl border border-borderSoft p-4 sm:flex-row sm:items-center"><DoctorAvatar initials={d.initials}/><div className="flex-1"><p className="font-semibold text-teal">{d.name}</p><p className="mt-1 text-sm text-slate-500">{d.specialty} · {d.experience} · {money(d.fee)}</p></div><Badge tone={d.available ? 'success' : 'neutral'}>{d.available ? 'Available' : 'Unavailable'}</Badge><button className="btn-secondary" onClick={() => updateDoctor(d.id, 'available', !d.available)}>{d.available ? 'Set unavailable' : 'Set available'}</button></div>)}</div></Card>
  }

  function renderReports() {
    return <div className="space-y-5"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"><StatCard icon={CalendarCheck} label="Appointments" value={appointments.length} hint="All demo records"/><StatCard icon={Users} label="Doctors" value={doctors.length} hint="Directory entries" tint="green"/><StatCard icon={CircleDollarSign} label="Sample revenue" value={money(1800)} hint="Paid demo records" tint="amber"/></div><Card><SectionTitle title="Clinic overview" subtitle="Summary of sample system activity"/><div className="space-y-5">{[{label:'Confirmed appointments',value:appointments.filter(a => a.status === 'Confirmed').length,total:appointments.length},{label:'Pending appointments',value:appointments.filter(a => a.status === 'Pending').length,total:appointments.length},{label:'Available doctors',value:doctors.filter(d => d.available).length,total:doctors.length}].map(x => <div key={x.label}><div className="mb-2 flex justify-between text-sm"><span className="text-slate-600">{x.label}</span><span className="font-semibold text-teal">{x.value} / {x.total}</span></div><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-aqua transition-all" style={{width:`${x.total ? x.value / x.total * 100 : 0}%`}}/></div></div>)}</div></Card></div>
  }

  function renderSettings() {
    return <div className="grid gap-5 xl:grid-cols-[1fr_.8fr]"><Card><SectionTitle title="Profile settings" subtitle="Manage your demo account details"/><form className="space-y-4" onSubmit={e => {e.preventDefault();setSettingsSaved(true);notify('Profile saved in this session.')}}><div><label className="mb-1.5 block text-sm font-medium text-teal">Full name</label><input className="field" value={profile.name} onChange={e => setProfile({...profile,name:e.target.value})} required/></div><div><label className="mb-1.5 block text-sm font-medium text-teal">Email address</label><input type="email" className="field" value={profile.email} onChange={e => setProfile({...profile,email:e.target.value})} required/></div><div><label className="mb-1.5 block text-sm font-medium text-teal">Phone number</label><input className="field" value={profile.phone} onChange={e => setProfile({...profile,phone:e.target.value})}/></div><button className="btn-primary" type="submit"><Check size={16}/> Save changes</button>{settingsSaved && <p className="text-sm text-emerald-700">Changes saved for this session.</p>}</form></Card><Card><SectionTitle title="Preferences" subtitle="Simple account options"/><div className="space-y-4"><div className="flex items-center justify-between gap-4 rounded-xl border border-borderSoft p-3"><div><span className="block text-sm font-semibold text-teal">Theme Appearance</span><span className="mt-0.5 block text-xs text-slate-500">Toggle theme (Shortcut: Press D or Ctrl+D)</span></div><button type="button" onClick={toggleTheme} className="btn-secondary !px-3 !py-1.5 text-xs flex items-center gap-1.5">{theme === 'dark' ? <Sun size={14} className="text-amber-400"/> : <Moon size={14} className="text-slate-600"/>}<span>{theme === 'dark' ? 'Dark mode' : 'Light mode'}</span></button></div>{[{title:'Appointment reminders',body:'Receive demo reminders for upcoming visits.'},{title:'Payment updates',body:'Show payment-related notifications.'},{title:'Email notifications',body:'Keep important account updates visible.'}].map((p,i)=><label key={p.title} className="flex cursor-pointer items-start justify-between gap-4"><span><span className="block text-sm font-semibold text-teal">{p.title}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{p.body}</span></span><input type="checkbox" defaultChecked={i !== 1} className="mt-1 h-4 w-4 accent-cyan-600"/></label>)}</div></Card></div>
  }

  function renderContent() {
    if (page === 'Overview') return renderOverview()
    if (page === 'Find Doctors') return renderDoctors()
    if (page === 'Appointments' || page === 'My Appointments') return renderAppointments()
    if (page === 'Schedule') return renderSchedule()
    if (page === 'Payments') return renderPayments()
    if (page === 'Notifications') return renderNotifications()
    if (page === 'Settings') return renderSettings()
    if (page === 'Patients') return renderPatients()
    if (page === 'Doctors') return renderDoctorsAdmin()
    if (page === 'Reports') return renderReports()
    if (page === 'Book Appointment') return <Card><SectionTitle title="Book appointment" subtitle="Create a booking for a patient"/><button className="btn-primary" onClick={() => {setForm(f => ({...f, patient:''}));setModal('booking')}}><Plus size={16}/> New booking</button></Card>
    return renderOverview()
  }

  return <div className="min-h-screen bg-pale text-teal">
    <div className="min-h-screen lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
      <div className="hidden border-r border-borderSoft lg:block">{sidebar}</div>
      {mobileOpen && <div className="fixed inset-0 z-40 lg:hidden"><button aria-label="Close navigation overlay" className="absolute inset-0 bg-slate-900/30" onClick={() => setMobileOpen(false)}/><div className="relative z-10 h-full w-[280px] max-w-[85vw] shadow-2xl">{sidebar}</div></div>}
      <main className="min-w-0">
        <header className="sticky top-0 z-20 flex min-h-[76px] items-center justify-between gap-3 border-b border-borderSoft bg-white/95 px-4 py-3 backdrop-blur sm:px-7">
          <div className="flex min-w-0 items-center gap-3"><button onClick={() => setMobileOpen(true)} className="rounded-xl border border-borderSoft p-2 text-teal lg:hidden" aria-label="Open navigation"><Menu size={19}/></button><div className="min-w-0"><h1 className="truncate text-lg font-bold text-teal sm:text-xl">{titleForPage}</h1><p className="mt-0.5 hidden text-xs text-slate-500 sm:block">{subtitleForPage}</p></div></div>
          <div className="flex items-center gap-2 sm:gap-4"><button onClick={() => navigate('Notifications')} className="relative rounded-xl border border-borderSoft p-2.5 text-slate-500 transition hover:bg-pale" aria-label="Notifications"><Bell size={18}/>{!notificationRead && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-aqua ring-2 ring-white"/>}</button><div className="hidden h-8 w-px bg-borderSoft sm:block"/><div className="flex items-center gap-2"><div className="hidden text-right sm:block"><p className="text-sm font-semibold text-teal">{role === 'Patient' ? profile.name : meta.name}</p><p className="text-xs text-slate-400">{role}</p></div><div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-50 text-sm font-bold text-teal ring-1 ring-inset ring-cyan-100">{role === 'Patient' ? profile.name.split(' ').map(x=>x[0]).join('').slice(0,2) : meta.initials}</div></div></div>
        </header>
        <div className="mx-auto max-w-[1500px] p-4 sm:p-7"><div className="mb-6 flex items-center gap-2 text-xs text-slate-400"><span>Workspace</span><ChevronRight size={13}/><span className="font-semibold text-slate-600">{page}</span></div>{renderContent()}<footer className="mt-10 border-t border-borderSoft py-5 text-center text-xs text-slate-400">© {new Date().getFullYear()} MediCare · Developed by <span className="font-semibold text-slate-600">Yash</span> · Licensed under MIT · All rights reserved</footer></div>
      </main>
    </div>
    {toast && <div role="status" className="fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-3 rounded-2xl bg-teal px-4 py-3 text-sm font-medium text-white shadow-xl"><CheckCircle2 size={18} className="shrink-0"/>{toast}</div>}
    {modal === 'booking' && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/35 p-4 backdrop-blur-[2px]"><div className="my-auto w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-7"><div className="mb-5 flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-aqua">MEDICARE APPOINTMENTS</p><h2 className="mt-1 text-xl font-bold text-teal">Book an appointment</h2><p className="mt-1 text-sm text-slate-500">Choose a doctor, date and available time.</p></div><button onClick={() => setModal(null)} className="rounded-xl p-2 text-slate-400 hover:bg-pale" aria-label="Close booking form"><X size={19}/></button></div><form onSubmit={createAppointment} className="space-y-4"><div><label className="mb-1.5 block text-sm font-semibold text-teal">Patient name</label><input className="field" required value={form.patient} onChange={e => setForm({...form,patient:e.target.value})} placeholder="Enter patient name"/></div><div><label className="mb-1.5 block text-sm font-semibold text-teal">Choose doctor</label><select className="field" value={form.doctorId} onChange={e => setForm({...form,doctorId:e.target.value})}>{doctors.map(d => <option key={d.id} value={d.id}>{d.name} — {d.specialty} ({money(d.fee)})</option>)}</select></div><div className="grid gap-4 sm:grid-cols-2"><div><label className="mb-1.5 block text-sm font-semibold text-teal">Appointment date</label><input type="date" min="2026-10-27" required className="field" value={form.date} onChange={e => setForm({...form,date:e.target.value})}/></div><div><label className="mb-1.5 block text-sm font-semibold text-teal">Available time</label><select className="field" value={form.time} onChange={e => setForm({...form,time:e.target.value})}>{['09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','02:00 PM','02:30 PM'].map(t => <option key={t}>{t}</option>)}</select></div></div><div className="flex items-center justify-between rounded-xl bg-pale p-4"><div><p className="text-xs text-slate-500">Consultation fee</p><p className="mt-1 text-xl font-bold text-teal">{money(currentDoctor.fee)}</p></div><Badge tone="info">Demo booking</Badge></div><div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button type="submit" className="btn-primary"><CalendarCheck size={17}/> Confirm appointment</button></div><p className="text-xs leading-5 text-slate-400">This is a frontend demonstration. It does not send notifications or process payments.</p></form></div></div>}
  </div>
}

function DoctorCard({ doctor, onBook }) {
  return <div className="card p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-start justify-between gap-3"><DoctorAvatar initials={doctor.initials} large/><Badge tone={doctor.available ? 'success' : 'neutral'}>{doctor.available ? 'Available' : 'Unavailable'}</Badge></div><h3 className="mt-4 font-bold text-teal">{doctor.name}</h3><p className="mt-1 text-sm text-slate-500">{doctor.specialty}</p><div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500"><span>★ {doctor.rating}</span><span>·</span><span>{doctor.experience} experience</span></div><div className="mt-5 flex items-center justify-between border-t border-borderSoft pt-4"><div><p className="text-xs text-slate-400">Consultation fee</p><p className="mt-1 text-lg font-bold text-teal">{money(doctor.fee)}</p></div><button disabled={!doctor.available} onClick={onBook} className="btn-primary">{doctor.available ? 'Book visit' : 'Unavailable'}</button></div></div>
}
function AppointmentTable({ appointments, role, onStatus }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[730px] text-left text-sm"><thead><tr className="border-b border-borderSoft text-xs uppercase tracking-wide text-slate-400"><th className="pb-3 font-semibold">Appointment</th><th className="pb-3 font-semibold">{role === 'Doctor' ? 'Patient' : 'Doctor'}</th><th className="pb-3 font-semibold">Date & time</th><th className="pb-3 font-semibold">Fee</th><th className="pb-3 font-semibold">Status</th>{role !== 'Patient' && <th className="pb-3 font-semibold">Action</th>}</tr></thead><tbody>{appointments.map(a => <tr key={a.id} className="border-b border-slate-50 last:border-0"><td className="py-4"><p className="font-semibold text-teal">{a.id}</p><p className="mt-1 text-xs text-slate-400">{a.specialty}</p></td><td className="py-4 text-slate-600">{role === 'Doctor' ? a.patient : a.doctor}</td><td className="py-4 text-slate-600">{dateLabel(a.date)}<p className="mt-1 text-xs text-slate-400">{a.time}</p></td><td className="py-4 font-semibold text-teal">{money(a.fee)}</td><td className="py-4"><Badge tone={a.status === 'Confirmed' ? 'success' : a.status === 'Cancelled' ? 'danger' : 'warning'}>{a.status}</Badge></td>{role !== 'Patient' && <td className="py-4"><select aria-label={`Update ${a.id} status`} value={a.status} onChange={e => onStatus(a.id,e.target.value)} className="rounded-lg border border-borderSoft bg-white px-2 py-1.5 text-xs text-teal"><option>Pending</option><option>Confirmed</option><option>Completed</option><option>Cancelled</option></select></td>}</tr>)}</tbody></table></div>
}
