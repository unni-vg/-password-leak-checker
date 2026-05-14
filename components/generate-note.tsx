'use client';
import { useState } from 'react';
export function GenerateNoteButton({threatId}:{threatId:string}){const [note,setNote]=useState('');
return <div className='glass rounded-xl p-4'><button className='bg-cyan-600 px-3 py-2 rounded' onClick={async()=>{const r=await fetch('/api/notes',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({threatId})});const d=await r.json();setNote(d.markdown);}}>Generate SOC Analyst Note</button>{note&&<textarea className='w-full mt-3 h-64 bg-black/30 p-2' value={note} readOnly/>}</div>}
