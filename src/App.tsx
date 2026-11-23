import { useEffect, useMemo, useState } from 'react'
import { Activity, ArrowDownToLine, ArrowLeft, Bell, BookOpen, Bus, CalendarDays, Check, ChevronDown, CircleHelp, ClipboardCheck, Clock3, CreditCard, FileText, GraduationCap, LayoutDashboard, LogOut, Menu, Moon, MoreHorizontal, Plus, Search, Settings, ShieldCheck, Sun, Users, Wallet, X, Sparkles, Megaphone, TrendingUp, UserRound, CheckCircle2, XCircle, Globe2 } from 'lucide-react'
import { roleMenus, roleNames, type Role, type RecordItem } from './data/seed'
import { schoolConfig } from './config/school.config'
import { loadStore, saveStore, exportCSV, downloadPoster, type Store } from './lib/storage'

const iconMap:Record<string,any> = {Overview:LayoutDashboard,Attendance:ClipboardCheck,Approvals:ShieldCheck,'Notice Board':Bell,'E-Diary':BookOpen,'Create Notice':Megaphone,'My Submissions':FileText,'Manage Staff':Users,Students:GraduationCap,'Exam Schedule':CalendarDays,'Exam Syllabus':BookOpen,'School Calendar':CalendarDays,'Smart Learning':Sparkles,Settings:Settings,'Class Room':GraduationCap,Announcements:Megaphone,'Events & Achievements':Sparkles,'School Timetable':Clock3,'Apply Leave':CalendarDays,'Notes for Students':FileText,'Fee Details':Wallet,'Fee Dues':CreditCard,'Exam Marks':TrendingUp,'Bus Routes':Bus,'My Children':Users,'View Diary':BookOpen,'View Attendance':ClipboardCheck,'Fees Status':Wallet,'Class Notes':FileText,Events:Sparkles,'School Achievements':Sparkles}
const moduleKey:Record<string,string> = {'Attendance':'attendance','Approvals':'approvals','Notice Board':'notices','E-Diary':'diary','Create Notice':'notices','My Submissions':'submissions','Manage Staff':'staff','Students':'students','Class Room':'students','Fee Details':'fees','Fee Dues':'fees','Exam Marks':'marks','Bus Routes':'buses','Smart Learning':'learning','School Calendar':'calendar','Apply Leave':'leaves','Events & Achievements':'events','Events':'events','Class Notes':'notes','Notes for Students':'notes','Exam Schedule':'exams','Exam Syllabus':'exams','View Diary':'diary','View Attendance':'attendance','Fees Status':'fees','School Timetable':'exams','Announcements':'notices'}
const descriptions:Record<string,string> = {
  Overview:'Your school at a glance. Review activity, priorities and important updates.',
  Attendance:'Daily attendance records and class-wise attendance overview.',
  Approvals:'Review submissions and approve or reject content before it goes live.',
  'Notice Board':'All approved school notices in one place.',
  'E-Diary':'Classwork, homework and daily classroom communication.',
  'Create Notice':'Create a school, class, staff or office announcement.',
  'My Submissions':'Track items you have submitted for approval.',
  'Manage Staff':'Manage staff profiles, roles and class allocations.',
  Students:'Student directory and class information.',
  'Class Room':'Manage class groups and student lists.',
  'Fee Details':'View fixed fee structure and student fee information.',
  'Fee Dues':'Track outstanding fees and payment status.',
  'Exam Marks':'Class-wise student progress and examination results.',
  'Bus Routes':'Transport routes, drivers, stops and timings.',
  'Smart Learning':'Great people, inspiring quotes and curated learning resources.',
  'School Calendar':'Holidays, birthdays, festivals and school events.',
  'Apply Leave':'Submit and track leave requests.',
  'Exam Schedule':'Upcoming examinations and schedules.',
  'Exam Syllabus':'Subject-wise syllabus and preparation resources.',
  'School Timetable':'Class timetable and daily periods.',
  'My Children':'Switch between children linked to your parent account.',
  'View Diary':'See your child’s classwork and homework.',
  'View Attendance':'Review your child’s attendance record.',
  'Fees Status':'Review paid fees and outstanding term dues.',
  'Class Notes':'Learning notes and shared classroom resources.',
  Events:'School event updates and photo gallery links.',
  'School Achievements':'Celebrate student and school achievements.',
  Settings:'School identity, appearance and demo preferences.'
}
const roleHome:Record<Role,string> = {principal:'Principal Workspace',incharge:'Class Operations',teacher:'Teaching Workspace',office:'Administration Desk',parent:'Parent Portal'}
const roleSubtitle:Record<Role,string> = {principal:'Lead with clarity. Keep every school operation connected.',incharge:'Your classes, attendance and daily coordination.',teacher:'Everything you need for a focused teaching day.',office:'Fees, transport and academic administration in one view.',parent:'Stay connected with your child’s school journey.'}

export default function App() {
  const [role,setRole]=useState<Role>('principal')
  const [page,setPage]=useState('Overview')
  const [store,setStore]=useState<Store>(()=>loadStore())
  const [dark,setDark]=useState(false)
  const [menuOpen,setMenuOpen]=useState(false)
  const [search,setSearch]=useState('')
  const [modal,setModal]=useState<{kind:string;item?:RecordItem}|null>(null)
  const [toast,setToast]=useState('')
  const [telugu,setTelugu]=useState(false)
  const [selectedChild,setSelectedChild]=useState('Aarav Kumar')
  const [userName,setUserName]=useState('Alex Morgan')
  const [loggedIn,setLoggedIn]=useState(true)
  useEffect(()=>saveStore(store),[store])
  useEffect(()=>{if(toast){const t=setTimeout(()=>setToast(''),2800);return()=>clearTimeout(t)}},[toast])
  const nav=roleMenus[role]
  const key=moduleKey[page]
  const rows=key?(store[key]||[]):[]
  const filtered=rows.filter(r=>(r.title+' '+(r.subtitle||'')+' '+(r.category||'')).toLowerCase().includes(search.toLowerCase()))
  const pending=store.approvals.filter(x=>x.status==='Pending').length
  const allStudents=store.students.length
  const update=(k:string,items:RecordItem[])=>setStore(s=>({...s,[k]:items}))
  const addItem=(item:RecordItem)=>{
    const k=moduleKey[page]||'notices'; update(k,[{...item,id:`${k.slice(0,2).toUpperCase()}-${Date.now()}`},...(store[k]||[])])
    if(k==='notices' && role!=='principal') update('approvals',[{...item,id:`AP-${Date.now()}`,status:'Pending'},...store.approvals])
    setModal(null);setToast('Saved successfully')
  }
  const changeStatus=(item:RecordItem,status:string)=>{
    const k=page==='Approvals'?'approvals':(key||'approvals')
    update(k,(store[k]||[]).map(x=>x.id===item.id?{...x,status}:x))
    if(page==='Approvals' && status==='Approved' && item.category==='Announcement') update('notices',[{...item,status:'Approved'},...store.notices])
    setToast(`Marked ${status.toLowerCase()}`)
  }
  const doLogout=()=>{setLoggedIn(false);setToast('You have been logged out')}
  if(!loggedIn) return <Login onLogin={(r,n)=>{setRole(r);setUserName(n);setLoggedIn(true);setPage('Overview')}}/>
  const pageIcon=iconMap[page]||FileText
  return <div className={dark?'app dark':'app'}>
    <aside className={`sidebar ${menuOpen?'open':''}`}>
      <div className="brand"><div className="brand-mark"><GraduationCap size={23}/></div><div><b>SmartSchool</b><small>DIGITAL CAMPUS</small></div><button className="mobile-close icon-btn" onClick={()=>setMenuOpen(false)}><X size={18}/></button></div>
      <div className="school-chip"><div className="school-avatar">{schoolConfig.initials}</div><div><b>{schoolConfig.shortName}</b><small>{schoolConfig.locationLabel} · {schoolConfig.academicYear}</small></div><ChevronDown size={15}/></div>
      <div className="nav-label">WORKSPACE</div>
      <nav>{nav.map(item=>{const I=iconMap[item]||FileText;return <button key={item} className={`nav-item ${page===item?'active':''}`} onClick={()=>{setPage(item);setSearch('');setMenuOpen(false)}}><I size={18}/><span>{item}</span>{item==='Approvals'&&pending>0&&<em>{pending}</em>}</button>})}</nav>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><CircleHelp size={18}/></div><b>Need a hand?</b><p>Explore your workspace and get things done.</p><button onClick={()=>setToast('Help centre will be connected in a later phase')}>Help centre <ArrowLeft size={14}/></button></div><div className="profile-mini"><div className="profile-avatar">{userName.split(' ').map(x=>x[0]).join('').slice(0,2)}</div><div><b>{userName}</b><small>{roleNames[role]}</small></div><button className="icon-btn" onClick={doLogout}><LogOut size={17}/></button></div></div>
    </aside>
    <main className="main">
      <header className="topbar"><div className="top-left"><button className="mobile-menu icon-btn" onClick={()=>setMenuOpen(true)}><Menu/></button><div className="crumb">Workspace <span>/</span> <b>{page}</b></div></div><div className="top-actions"><div className="search-box"><Search size={16}/><input placeholder="Search this workspace..." value={search} onChange={e=>setSearch(e.target.value)}/><kbd>⌘ K</kbd></div><button className="icon-btn theme-toggle" title="Toggle theme" onClick={()=>setDark(!dark)}>{dark?<Sun size={18}/>:<Moon size={18}/>}</button><button className="notification-btn" onClick={()=>{setPage(role==='principal'?'Approvals':'Notice Board');setToast('Here are your latest updates')}}><Bell size={18}/><i/></button><div className="top-avatar">{userName.split(' ').map(x=>x[0]).join('').slice(0,2)}</div></div></header>
      <div className="content">
        {page==='Overview'?<Overview role={role} userName={userName} pending={pending} store={store} setPage={setPage} setModal={setModal} allStudents={allStudents} />:
          page==='Settings'?<SettingsPage dark={dark} setDark={setDark} telugu={telugu} setTelugu={setTelugu} setToast={setToast}/>:
          page==='Create Notice'?<CreateNotice onSave={addItem} />:
          page==='My Children'?<Children selected={selectedChild} setSelected={setSelectedChild}/>:
          <ModulePage page={page} role={role} rows={filtered} allRows={rows} search={search} setModal={setModal} changeStatus={changeStatus} setToast={setToast} store={store} telugu={telugu} setTelugu={setTelugu} />}
      </div>
      <footer className="app-footer"><button onClick={()=>setModal({kind:'contact'})}>A GI creative space work</button><span>Inspired by Godavari</span></footer>
    </main>
    <nav className="mobile-bottom-nav" aria-label="Primary navigation">
      {(role==='principal'?['Overview','Approvals','E-Diary','Notice Board']:role==='incharge'?['Overview','Attendance','E-Diary','My Submissions']:role==='teacher'?['Overview','E-Diary','My Submissions','Notice Board']:role==='office'?['Overview','Fee Dues','Notice Board','My Submissions']:['Overview','View Diary','Notice Board','View Attendance']).map(item=>{const I=iconMap[item]||FileText;return <button key={item} className={`mobile-nav-item ${page===item?'active':''}`} onClick={()=>{setPage(item);setSearch('');setMenuOpen(false)}}><I size={20}/><span>{item}</span>{item==='Approvals'&&pending>0&&<em>{pending}</em>}</button>})}
      <button className="mobile-nav-item" onClick={()=>setMenuOpen(true)}><Menu size={20}/><span>More</span></button>
    </nav>
    {modal&&<Modal modal={modal} page={page} onClose={()=>setModal(null)} onSave={addItem} onStatus={changeStatus} setToast={setToast}/>}
    {toast&&<div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
  </div>
}

function Login({onLogin}:{onLogin:(r:Role,n:string)=>void}) {
  const [role,setRole]=useState<Role>('principal'),[mobile,setMobile]=useState('9876543210'),[pin,setPin]=useState('1234')
  return <div className="login-screen"><div className="login-visual"><div className="login-orbit orbit-one"/><div className="login-orbit orbit-two"/><div className="login-visual-content"><div className="brand-mark large"><GraduationCap size={32}/></div><div className="eyebrow light">A BETTER CONNECTED CAMPUS</div><h1>Every school day,<br/><i>beautifully</i> organised.</h1><p>One calm, connected space for school leaders, teachers, staff and families.</p><div className="login-stats"><div><b>5</b><small>Role workspaces</small></div><div><b>360°</b><small>Campus view</small></div><div><b>1</b><small>Connected school</small></div></div></div><div className="visual-footer">SCHOOL MANAGEMENT · COMMUNICATION · LEARNING</div></div><div className="login-form-wrap"><div className="login-form"><div className="brand compact"><div className="brand-mark"><GraduationCap/></div><div><b>School<span>OS</span></b><small>DIGITAL CAMPUS</small></div></div><div className="eyebrow">WELCOME BACK</div><h2>Sign in to your<br/>workspace</h2><p className="muted">Use the demo credentials to explore the experience.</p><label>Mobile number</label><input value={mobile} onChange={e=>setMobile(e.target.value)} placeholder="Enter mobile number"/><label>Demo PIN</label><input value={pin} onChange={e=>setPin(e.target.value)} type="password" placeholder="Enter PIN"/><label>Explore as</label><select value={role} onChange={e=>setRole(e.target.value as Role)}>{Object.entries(roleNames).map(([k,v])=><option value={k} key={k}>{v}</option>)}</select><button className="primary-btn full" onClick={()=>onLogin(role,role==='parent'?'Ravi Kumar':roleNames[role]+' User')}>Continue to dashboard <ArrowLeft className="arrow-right" size={17}/></button><div className="demo-note"><ShieldCheck size={16}/> Demo mode · No backend connected</div><small className="login-bottom">By continuing, you agree to the school’s acceptable use policy.</small></div></div></div>
}

function Overview({role,userName,pending,store,setPage,setModal,allStudents}:{role:Role;userName:string;pending:number;store:Store;setPage:(p:string)=>void;setModal:(m:any)=>void;allStudents:number}) {
  const statData = role==='principal'
    ? [['Total Students',String(allStudents),'Across all classes',Users],['Today’s Attendance','94.6%','Across active classes',Activity],['Pending Approvals',String(pending),'Items needing review',ClipboardCheck],['Fee Collection','78%','Current academic year',Wallet]]
    : role==='parent'
    ? [['Attendance','94.6%','This academic year',Activity],['Diary Updates',String(store.diary.length),'Class updates available',BookOpen],['Fee Status','Paid','Term 1 status',Wallet],['Upcoming Exams',String(store.exams.length).padStart(2,'0'),'Scheduled examinations',CalendarDays]]
    : role==='office'
    ? [['Fee Collection','78%','Current academic year',Wallet],['Outstanding','₹ 2.4L','Across active students',CreditCard],['Bus Routes',String(store.buses.length).padStart(2,'0'),'Active transport routes',Bus],['Student Records',String(allStudents),'In current sample',Users]]
    : [['My Classes','04','Assigned classes',GraduationCap],['Today’s Attendance','94.6%','Across assigned classes',Activity],['Pending Items',String(store.submissions.filter(x=>x.status==='Pending').length),'Your items to track',FileText],['Upcoming Events',String(store.events.length).padStart(2,'0'),'On school calendar',CalendarDays]]

  const quick = role==='principal'
    ? ['Approvals','E-Diary','Notice Board','My Submissions']
    : role==='incharge'
    ? ['E-Diary','Attendance','Notice Board','My Submissions']
    : role==='teacher'
    ? ['E-Diary','My Submissions','Notice Board','Announcements']
    : role==='office'
    ? ['Fee Dues','Notice Board','My Submissions','Bus Routes']
    : ['Notice Board','View Diary','View Attendance','Fees Status']

  const activitySource = role==='principal'
    ? [{icon:ShieldCheck,item:store.approvals[0],label:'Approvals',color:'purple'},{icon:BookOpen,item:store.diary[0],label:'E-Diary',color:'blue'},{icon:Megaphone,item:store.notices[0],label:'Notice Board',color:'green'}]
    : role==='parent'
    ? [{icon:BookOpen,item:store.diary[0],label:'E-Diary',color:'blue'},{icon:Megaphone,item:store.notices[0],label:'Notice Board',color:'green'},{icon:Wallet,item:store.fees[0],label:'Fee update',color:'purple'}]
    : role==='office'
    ? [{icon:Wallet,item:store.fees[0],label:'Fee update',color:'green'},{icon:Megaphone,item:store.notices[0],label:'Notice Board',color:'blue'},{icon:FileText,item:store.submissions[0],label:'Submission',color:'purple'}]
    : [{icon:BookOpen,item:store.diary[0],label:'E-Diary',color:'blue'},{icon:FileText,item:store.submissions[0],label:'Submission',color:'purple'},{icon:Megaphone,item:store.notices[0],label:'Notice Board',color:'green'}]
  const activities = activitySource.filter(x=>x.item).slice(0,3)
  const todayLabel = new Intl.DateTimeFormat('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date())

  return <>
    <section className="dashboard-hero">
      <div className="dashboard-hero-copy">
        <div className="hero-school-label"><span className="hero-school-mark"><GraduationCap size={17}/></span> {schoolConfig.schoolName.toUpperCase()}</div>
        <div className="hero-date"><CalendarDays size={14}/>{todayLabel}</div>
        <h1>Welcome, {userName.split(' ')[0]}!</h1>
        <p>{roleSubtitle[role]}</p>
        <div className="hero-quote"><span>“</span><b>Great schools build great futures.</b></div>
      </div>
      <div className="dashboard-hero-actions">
        <button className="hero-btn hero-btn-soft" onClick={()=>setPage('Notice Board')}><Bell size={16}/> Notice board</button>
        <button className="hero-btn hero-btn-primary" onClick={()=>setPage(role==='principal'?'Create Notice':role==='parent'?'View Diary':'E-Diary')}><Plus size={16}/>{role==='principal'?'Create notice':role==='parent'?'View diary':'Open E-Diary'}</button>
      </div>
      <div className="hero-decoration hero-decoration-one"/>
      <div className="hero-decoration hero-decoration-two"/>
    </section>

    <section className="dashboard-section">
      <div className="section-heading dashboard-section-heading">
        <div><h2>School overview</h2><p>Your key information, clearly organised.</p></div>
        <span className="today-pill"><span/> Overview</span>
      </div>
      <div className="stat-grid">{statData.map(([label,value,caption,Icon]:any,i)=><div className="stat-card" key={label}>
        <div className={`stat-icon stat-${i}`}><Icon size={21}/></div>
        <div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-caption">{caption}</div>
      </div>)}</div>
    </section>

    <section className="dashboard-section">
      <div className="section-heading dashboard-section-heading">
        <div><h2>Your workspace</h2><p>Quick access to the sections you use most.</p></div>
      </div>
      <div className="quick-grid">{quick.map((q,i)=>{const I=iconMap[q]||FileText;return <button className="quick-card" key={q} onClick={()=>setPage(q)}>
        <div className={`quick-icon q-${i}`}><I size={22}/></div><b>{q}</b><small>{descriptions[q]||'Open this section and manage updates.'}</small><span className="quick-arrow">↗</span>
      </button>})}</div>
    </section>

    <section className="panel activity-panel dashboard-activity">
      <div className="panel-head"><div><h3>Today's activity</h3><p>Updates from your school workspace.</p></div><button className="text-btn" onClick={()=>setPage(role==='principal'?'Approvals':role==='parent'?'Notice Board':'My Submissions')}>View all <ArrowLeft size={14}/></button></div>
      {activities.length>0?<div className="activity-list">{activities.map((entry:any,index:number)=><ActivityItem key={entry.item.id||index} icon={entry.icon} title={entry.item.title} detail={entry.item.subtitle||entry.item.category||entry.label} time={entry.item.status||entry.label} color={entry.color}/>)}</div>:<div className="dashboard-empty"><FileText size={22}/><span>No activity to show yet. New updates will appear here.</span></div>}
    </section>
    <div className="dashboard-footnote"><ShieldCheck size={16}/> Demo workspace · Sample records are stored in this browser until a live school database is connected.</div>
  </>
}
function ActivityItem({icon:Icon,title,detail,time,color}:any){return <div className="activity-item"><div className={`activity-icon ${color}`}><Icon size={19}/></div><div className="activity-copy"><b>{title}</b><small>{detail}</small></div><time>{time}</time></div>}

function ModulePage({page,role,rows,allRows,search,setModal,changeStatus,setToast,store,telugu,setTelugu}:{page:string;role:Role;rows:RecordItem[];allRows:RecordItem[];search:string;setModal:(m:any)=>void;changeStatus:(i:RecordItem,s:string)=>void;setToast:(s:string)=>void;store:Store;telugu:boolean;setTelugu:(v:boolean)=>void}) {
  const isApproval=page==='Approvals', isNotice=page==='Notice Board', isLeave=page==='Apply Leave', isFee=page==='Fee Details'||page==='Fee Dues'||page==='Fees Status', isAttendance=page==='Attendance'||page==='View Attendance'
  const [filter,setFilter]=useState('All')
  const display=rows.filter(r=>filter==='All'||r.status===filter)
  const title=page==='View Diary'?'Your child’s diary':page==='View Attendance'?'Your child’s attendance':page
  return <><div className="module-heading"><div><div className="eyebrow">{roleNames[role].toUpperCase()} WORKSPACE</div><h1>{title}</h1><p>{descriptions[page]||'Manage and review school information.'}</p></div><div className="module-actions">{role==='parent'&&<button className="secondary-btn" onClick={()=>setTelugu(!telugu)}><Globe2 size={16}/>{telugu?'English':'తెలుగు'}</button>}{(page==='Manage Staff'||page==='Students'||page==='Class Room')&&<button className="secondary-btn" onClick={()=>{exportCSV(allRows,`${page.toLowerCase().replaceAll(' ','-')}.csv`);setToast('CSV exported')}}><ArrowDownToLine size={16}/> Export CSV</button>}{!['Notice Board','View Diary','View Attendance','Fees Status','Exam Schedule','Exam Syllabus','School Timetable','School Calendar','Smart Learning','Bus Routes','My Children','School Achievements'].includes(page)&&<button className="primary-btn" onClick={()=>setModal({kind:'new'})}><Plus size={17}/> {isLeave?'Apply leave':'Add new'}</button>}</div></div>
  {isAttendance&&<div className="attendance-summary"><div><span>Overall attendance</span><b>94.6%</b><small>Today · Across active classes</small></div><div className="progress-track"><span style={{width:'94.6%'}}/></div><div className="attendance-mini"><b>84</b><small>Present</small></div><div className="attendance-mini"><b>5</b><small>Absent</small></div><div className="attendance-mini"><b>2</b><small>On leave</small></div></div>}
  {isFee&&<div className="fee-summary"><div><small>Total collected</small><b>₹ 18,45,000</b></div><div><small>Outstanding dues</small><b>₹ 2,40,000</b></div><div><small>Collection rate</small><b>78%</b></div></div>}
  {isApproval&&<div className="info-banner"><ShieldCheck size={19}/><div><b>Principal approval centre</b><span>Only approved submissions are published to the school notice board.</span></div></div>}
  {isNotice&&<div className="info-banner"><Bell size={19}/><div><b>School-wide notice board</b><span>These notices have been reviewed and approved for sharing.</span></div></div>}
  {page==='Smart Learning'&&<div className="learning-hero"><div className="learning-spark"><Sparkles size={24}/></div><div><div className="eyebrow light">GROW A LITTLE EVERY DAY</div><h2>Curiosity makes<br/>every day brighter.</h2><p>Explore inspiring people, thoughtful quotes and new ideas.</p></div><div className="learning-decoration">✳</div></div>}
  {page==='My Submissions'&&<div className="filter-row">{['All','Pending','Approved','Rejected'].map(f=><button className={filter===f?'filter active':'filter'} key={f} onClick={()=>setFilter(f)}>{f}{f==='Pending'&&<span>{allRows.filter(r=>r.status==='Pending').length}</span>}</button>)}</div>}
  <div className="records-panel"><div className="records-head"><div><h3>{isApproval?'Items awaiting your review':page==='My Submissions'?'Your submitted items':`${page} records`}</h3><p>{display.length} {display.length===1?'record':'records'} {search?'matching your search':'available'}</p></div><div className="records-tools"><span className="records-count">{display.length} items</span><button className="icon-btn" onClick={()=>{exportCSV(display,`${page.toLowerCase().replaceAll(' ','-')}.csv`);setToast('CSV downloaded')}}><ArrowDownToLine size={17}/></button></div></div>
  {display.length===0?<div className="empty-state"><div><Search size={23}/></div><b>No records found</b><p>Try a different search or add a new record.</p></div>:<div className="record-list">{display.map(item=><RecordRow key={item.id} item={item} isApproval={isApproval} isNotice={isNotice} isLeave={isLeave} isFee={isFee} onStatus={changeStatus} setModal={setModal} setToast={setToast}/>)}</div>}</div>
  {page==='Smart Learning'&&<div className="learning-tip"><Sparkles size={17}/><span>Content can be managed by the Principal and shared across all five workspaces.</span></div>}
  </>
}

function RecordRow({item,isApproval,isNotice,isLeave,isFee,onStatus,setModal,setToast}:{item:RecordItem;isApproval:boolean;isNotice:boolean;isLeave:boolean;isFee:boolean;onStatus:(i:RecordItem,s:string)=>void;setModal:(m:any)=>void;setToast:(s:string)=>void}) {
  const status=(item.status||'Available').toLowerCase()
  return <div className="record-row"><div className="record-type-icon"><FileText size={18}/></div><div className="record-main"><b>{item.title}</b><span>{item.subtitle||item.category||'School record'} {item.date?`· ${item.date}`:''}</span></div><div className="record-meta">{item.amount?`₹ ${item.amount.toLocaleString('en-IN')}`:''}<span className={`status ${status.replaceAll(' ','-')}`}>{item.status||'Available'}</span></div><div className="record-actions">{isApproval?<><button className="approve-btn" onClick={()=>onStatus(item,'Approved')}><Check size={15}/> Approve</button><button className="reject-btn" onClick={()=>onStatus(item,'Rejected')}><X size={15}/> Reject</button></>:isLeave?<button className="secondary-btn small" onClick={()=>setToast('Leave request submitted for approval')}>Submit</button>:<><button className="icon-btn" title="View details" onClick={()=>setModal({kind:'view',item})}><MoreHorizontal size={18}/></button>{isNotice&&<button className="icon-btn" title="Download poster" onClick={()=>{downloadPoster(item.title,item.subtitle||'School announcement');setToast('Poster generated')}}><ArrowDownToLine size={17}/></button>}{isFee&&<button className="icon-btn" title="Update status" onClick={()=>onStatus(item,item.status==='Paid'?'Due':'Paid')}><Check size={17}/></button>}</>}</div></div>
}

function CreateNotice({onSave}:{onSave:(i:RecordItem)=>void}) {
  const [title,setTitle]=useState(''),[body,setBody]=useState(''),[target,setTarget]=useState('School'),[date,setDate]=useState(new Date().toISOString().slice(0,10))
  return <div className="form-layout"><div className="module-heading"><div><div className="eyebrow">COMMUNICATION</div><h1>Create a notice</h1><p>Share a clear, thoughtful update with your school community.</p></div></div><div className="form-card"><div className="form-card-head"><div className="form-icon"><Megaphone/></div><div><h3>Notice details</h3><p>Write your message and choose who should receive it.</p></div></div><label>Notice title</label><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Parent–Teacher Meeting"/><label>Message</label><textarea rows={5} value={body} onChange={e=>setBody(e.target.value)} placeholder="Write the announcement details..."/><div className="form-two"><div><label>Audience</label><select value={target} onChange={e=>setTarget(e.target.value)}><option>School</option><option>Staff</option><option>Office</option><option>Grade 6</option><option>Grade 7</option><option>Grade 8</option></select></div><div><label>Publish date</label><input type="date" value={date} onChange={e=>setDate(e.target.value)}/></div></div><div className="form-foot"><span><ShieldCheck size={16}/> Will be sent for Principal approval</span><button className="primary-btn" disabled={!title.trim()||!body.trim()} onClick={()=>onSave({id:'',title,subtitle:body,category:target,date,status:'Pending'})}>Submit for approval <ArrowLeft className="arrow-right" size={16}/></button></div></div></div>
}

function Children({selected,setSelected}:{selected:string;setSelected:(s:string)=>void}) {
  const kids=['Aarav Kumar','Ananya Rao']
  return <><div className="module-heading"><div><div className="eyebrow">FAMILY PORTAL</div><h1>My children</h1><p>Choose a child to view their school information.</p></div></div><div className="children-grid">{kids.map((kid,i)=><button key={kid} onClick={()=>setSelected(kid)} className={`child-card ${selected===kid?'selected':''}`}><div className={`child-avatar child-${i}`}>{kid.split(' ').map(x=>x[0]).join('')}</div><div><b>{kid}</b><span>Grade {i===0?'6 · A':'6 · A'} · {schoolConfig.shortName}</span></div><span className="child-check">{selected===kid?<Check size={17}/>:''}</span></button>)}</div><div className="selected-child-note"><CheckCircle2 size={17}/> Currently viewing <b>{selected}</b>’s information.</div></>
}

function SettingsPage({dark,setDark,telugu,setTelugu,setToast}:{dark:boolean;setDark:(v:boolean)=>void;telugu:boolean;setTelugu:(v:boolean)=>void;setToast:(s:string)=>void}) {
  return <><div className="module-heading"><div><div className="eyebrow">PREFERENCES</div><h1>Settings</h1><p>Make your workspace feel right for you.</p></div></div><div className="settings-list"><div className="setting-row"><div className="setting-symbol"><Moon/></div><div><b>Appearance</b><small>Switch between light and dark workspace themes.</small></div><button className={`toggle ${dark?'on':''}`} onClick={()=>setDark(!dark)}><i/></button></div><div className="setting-row"><div className="setting-symbol"><Globe2/></div><div><b>Parent language preview</b><small>Enable Telugu labels in the parent workspace.</small></div><button className={`toggle ${telugu?'on':''}`} onClick={()=>setTelugu(!telugu)}><i/></button></div><div className="setting-row"><div className="setting-symbol"><ArrowDownToLine/></div><div><b>Export demo data</b><small>Download a CSV backup of student records.</small></div><button className="secondary-btn small" onClick={()=>{exportCSV(loadStore().students,'students-backup.csv');setToast('Backup exported')}}>Export CSV</button></div><div className="setting-row"><div className="setting-symbol"><ShieldCheck/></div><div><b>Backend connection</b><small>Supabase integration is intentionally not connected yet.</small></div><span className="status pending">Not connected</span></div></div><div className="info-banner settings-info"><ShieldCheck/><div><b>Demo workspace</b><span>Changes are saved in this browser only. Connect Supabase in a later development phase before using real student data.</span></div></div></>
}

function Modal({modal,page,onClose,onSave,onStatus,setToast}:{modal:any;page:string;onClose:()=>void;onSave:(i:RecordItem)=>void;onStatus:(i:RecordItem,s:string)=>void;setToast:(s:string)=>void}) {
  const [title,setTitle]=useState(''),[subtitle,setSubtitle]=useState(''),[category,setCategory]=useState(page),[date,setDate]=useState(new Date().toISOString().slice(0,10))
  if(modal.kind==='contact')return <div className="modal-backdrop" onClick={onClose}><div className="modal-card contact-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={onClose}><X/></button><div className="contact-mark"><Sparkles/></div><div className="eyebrow">POWERED BY GI CREATIVE SPACE</div><h2>For your digital needs,<br/>let’s create something.</h2><p>School digital experiences, creative technology and thoughtful design.</p><a className="primary-btn full" href="https://wa.me/8985361991" target="_blank" rel="noreferrer">Chat on WhatsApp ↗</a><small>Inspired by Godavari</small></div></div>
  if(modal.kind==='view')return <div className="modal-backdrop" onClick={onClose}><div className="modal-card" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={onClose}><X/></button><div className="eyebrow">RECORD DETAILS</div><h2>{modal.item.title}</h2><p className="muted">{modal.item.subtitle}</p><div className="detail-line"><span>Category</span><b>{modal.item.category||'School record'}</b></div><div className="detail-line"><span>Date</span><b>{modal.item.date||'—'}</b></div><div className="detail-line"><span>Status</span><b>{modal.item.status||'Available'}</b></div><button className="primary-btn full" onClick={onClose}>Close</button></div></div>
  return <div className="modal-backdrop" onClick={onClose}><div className="modal-card" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={onClose}><X/></button><div className="eyebrow">NEW SCHOOL RECORD</div><h2>Add to {page}</h2><p className="muted">Create a record in your local demo workspace.</p><label>Title</label><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Enter a title"/><label>Description</label><textarea rows={3} value={subtitle} onChange={e=>setSubtitle(e.target.value)} placeholder="Add a short description"/><div className="form-two"><div><label>Category</label><input value={category} onChange={e=>setCategory(e.target.value)}/></div><div><label>Date</label><input type="date" value={date} onChange={e=>setDate(e.target.value)}/></div></div><div className="modal-actions"><button className="secondary-btn" onClick={onClose}>Cancel</button><button className="primary-btn" disabled={!title.trim()} onClick={()=>onSave({id:'',title,subtitle,category,date,status:page==='Approvals'?'Pending':'Pending'})}>Save record <Check size={16}/></button></div></div></div>
}
