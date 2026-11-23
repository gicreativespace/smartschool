import { initialData, type RecordItem } from '../data/seed'
const KEY = 'schoolos-demo-v1'
export type Store = Record<string,RecordItem[]>
export function loadStore(): Store {
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : structuredClone(initialData) }
  catch { return structuredClone(initialData) }
}
export function saveStore(data: Store) { localStorage.setItem(KEY, JSON.stringify(data)) }
export function exportCSV(rows: RecordItem[], filename: string) {
  const cols = Array.from(new Set(rows.flatMap(r => Object.keys(r))))
  const csv = [cols.join(','), ...rows.map(r => cols.map(c => `"${String(r[c] ?? '').replaceAll('"','""')}"`).join(','))].join('\\n')
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'})
  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url)
}
export function downloadPoster(title: string, body: string) {
  const canvas = document.createElement('canvas'); canvas.width=1080; canvas.height=1350
  const ctx = canvas.getContext('2d')!; const g=ctx.createLinearGradient(0,0,1080,1350)
  g.addColorStop(0,'#101b35'); g.addColorStop(1,'#263f70'); ctx.fillStyle=g; ctx.fillRect(0,0,1080,1350)
  ctx.strokeStyle='#d9b66d'; ctx.lineWidth=5; ctx.strokeRect(54,54,972,1242)
  ctx.fillStyle='#d9b66d'; ctx.font='600 34px Arial'; ctx.textAlign='center'; ctx.fillText('SCHOOL NOTICE',540,220)
  ctx.fillStyle='#fff'; ctx.font='bold 68px Arial'; wrap(ctx,title,540,430,850,90)
  ctx.fillStyle='#dbe5f7'; ctx.font='36px Arial'; wrap(ctx,body,540,700,820,58)
  ctx.fillStyle='#d9b66d'; ctx.font='28px Arial'; ctx.fillText('Inspired by Godavari',540,1170)
  const a=document.createElement('a'); a.download='school-notice.png'; a.href=canvas.toDataURL('image/png'); a.click()
}
function wrap(ctx:CanvasRenderingContext2D,text:string,x:number,y:number,max:number,line:number) {
  let words=text.split(' '), row='', yy=y
  for(const word of words){ const test=row+word+' '; if(ctx.measureText(test).width>max && row){ctx.fillText(row.trim(),x,yy);row=word+' ';yy+=line}else row=test }
  if(row)ctx.fillText(row.trim(),x,yy)
}
