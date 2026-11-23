export type Role = 'principal' | 'incharge' | 'teacher' | 'office' | 'parent'
export type RecordItem = { id: string; title: string; subtitle?: string; status?: string; date?: string; category?: string; amount?: number; [key: string]: any }

// English role labels are used throughout the school workspace.
export const roleNames: Record<Role,string> = {
  principal:'Principal',
  incharge:'Incharge',
  teacher:'Teacher',
  office:'Office Staff',
  parent:'Parent'
}
export const roleNamesEnglish: Record<Role,string> = {
  principal:'Principal', incharge:'Incharge', teacher:'Teacher', office:'Office Staff', parent:'Parent'
}
export const roleMenus: Record<Role,string[]> = {
  principal:['Overview','Approvals','E-Diary','Notice Board','My Submissions','Attendance','Create Notice','Manage Staff','Students','Exam Schedule','Exam Syllabus','School Calendar','Smart Learning','Settings'],
  incharge:['Overview','Attendance','E-Diary','Notice Board','Announcements','My Submissions','Class Room','Events & Achievements','Exam Schedule','School Timetable','School Calendar','Smart Learning','Apply Leave'],
  teacher:['Overview','E-Diary','My Submissions','Notice Board','Announcements','Notes for Students','Exam Schedule','School Timetable','School Calendar','Smart Learning','Apply Leave'],
  office:['Overview','Fee Details','Fee Dues','Notice Board','My Submissions','Exam Marks','Bus Routes','Smart Learning','Apply Leave'],
  parent:['Overview','My Children','View Diary','Notice Board','View Attendance','Apply Leave','Fee Details','Fees Status','Bus Routes','Exam Schedule','Exam Syllabus','School Calendar','Class Notes','Events','Exam Marks','School Achievements','Smart Learning']
}
const today = new Date().toISOString().slice(0,10)
export const initialData: Record<string,RecordItem[]> = {
  students: [
    {id:'ST-1001',title:'K. Sai Teja',subtitle:'Grade 6 · A',category:'Student',status:'Active',admission:'1001',parent:'P. Raju'},
    {id:'ST-1002',title:'S. Tulasi',subtitle:'Grade 6 · A',category:'Student',status:'Active',admission:'1002',parent:'B. Lakshmi'},
    {id:'ST-1003',title:'Ch. Vamsi Krishna',subtitle:'Grade 7 · B',category:'Student',status:'Active',admission:'1003',parent:'K. Srinu'}
  ],
  staff: [
    {id:'SF-001',title:'S. Tulasi',subtitle:'Mathematics · Grade 6A',category:'Teacher',status:'Active'},
    {id:'SF-002',title:'K. Srinivas',subtitle:'Incharge · Grade 7B',category:'Incharge',status:'Active'},
    {id:'SF-003',title:'B. Lakshmi',subtitle:'Office Administration',category:'Office',status:'Active'}
  ],
  attendance: [
    {id:'AT-01',title:'Grade 6 · Section A',subtitle:'28 present · 2 absent',category:'Attendance',date:today,status:'93%'},
    {id:'AT-02',title:'Grade 7 · Section B',subtitle:'30 present · 1 absent',category:'Attendance',date:today,status:'97%'},
    {id:'AT-03',title:'Grade 8 · Section A',subtitle:'26 present · 4 absent',category:'Attendance',date:today,status:'87%'}
  ],
  approvals: [
    {id:'AP-01',title:'Grade 6 Mathematics Diary',subtitle:'Submitted by S. Tulasi',category:'Diary',date:today,status:'Pending'},
    {id:'AP-02',title:'Annual Sports Day Announcement',subtitle:'Submitted by K. Srinivas',category:'Announcement',date:today,status:'Pending'},
    {id:'AP-03',title:'Science Exhibition Photos',subtitle:'Submitted by K. Srinivas',category:'Achievement',date:today,status:'Pending'}
  ],
  notices: [
    {id:'NT-01',title:'Parent–Teacher Meeting',subtitle:'Meeting scheduled for Saturday at 10:00 AM.',category:'School',date:today,status:'Approved'},
    {id:'NT-02',title:'Unit Test – Mathematics',subtitle:'Please revise chapters 1 to 4.',category:'Grade 6',date:today,status:'Approved'}
  ],
  diary: [
    {id:'DR-01',title:'Mathematics',subtitle:'Classwork: Fractions · Homework: Exercise 4.2',category:'Grade 6A',date:today,status:'Approved'},
    {id:'DR-02',title:'English',subtitle:'Reading comprehension · Write five sentences',category:'Grade 6A',date:today,status:'Pending'}
  ],
  submissions: [
    {id:'SB-01',title:'Weekly class diary',subtitle:'Grade 6A · Mathematics',category:'Diary',date:today,status:'Approved'},
    {id:'SB-02',title:'Class announcement',subtitle:'Grade 6A · Unit test reminder',category:'Announcement',date:today,status:'Pending'}
  ],
  fees: [
    {id:'FE-01',title:'K. Sai Teja',subtitle:'Grade 6 · Admission fee',category:'Fee',amount:5000,status:'Paid'},
    {id:'FE-02',title:'S. Tulasi',subtitle:'Grade 6 · Term 2 fee',category:'Fee',amount:7500,status:'Due'},
    {id:'FE-03',title:'Ch. Vamsi Krishna',subtitle:'Grade 7 · Transport fee',category:'Fee',amount:3200,status:'Due'}
  ],
  buses: [
    {id:'BU-01',title:'Route 01 · Palakollu',subtitle:'Driver: P. Raju · 7:30 AM',category:'Bus',status:'Active'},
    {id:'BU-02',title:'Route 02 · Mogalthur',subtitle:'Driver: K. Srinu · 7:15 AM',category:'Bus',status:'Active'}
  ],
  marks: [
    {id:'MK-01',title:'K. Sai Teja',subtitle:'Grade 6 · Mathematics',category:'Progress Report',status:'82%'},
    {id:'MK-02',title:'S. Tulasi',subtitle:'Grade 6 · Science',category:'Progress Report',status:'91%'}
  ],
  calendar: [
    {id:'CL-01',title:'Parent–Teacher Meeting',subtitle:'School event',category:'Event',date:today,status:'Upcoming'},
    {id:'CL-02',title:'Children’s Day',subtitle:'Special day',category:'Celebration',date:'2026-11-14',status:'Upcoming'}
  ],
  learning: [
    {id:'SL-01',title:'Great People: Dr. A.P.J. Abdul Kalam',subtitle:'A short profile and life lessons',category:'Great People',status:'Published'},
    {id:'SL-02',title:'Quote of the Week',subtitle:'“Dream, dream, dream. Dreams transform into thoughts.”',category:'Great Quotes',status:'Published'},
    {id:'SL-03',title:'Learn Something New',subtitle:'Add a Google Docs learning resource link',category:'Learning Link',status:'Published'}
  ],
  exams: [
    {id:'EX-01',title:'Periodic Assessment 2',subtitle:'Grades 6–8 · 9:30 AM onwards',category:'Exam',date:'2026-12-02',status:'Scheduled'}
  ],
  notes: [
    {id:'NO-01',title:'Grade 6 – Science Notes',subtitle:'Chapter 3 · Google Drive resource',category:'Class Notes',status:'Available'}
  ],
  events: [
    {id:'EV-01',title:'Science Exhibition',subtitle:'School gallery · Google Photos link can be added',category:'Event',status:'Published'}
  ],
  leaves: [
    {id:'LV-01',title:'K. Sai Teja',subtitle:'One day · Personal reason',category:'Student Leave',date:today,status:'Pending'}
  ]
}
