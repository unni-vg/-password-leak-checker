import { threats } from '@/lib/mock';
export async function POST(req:Request){const {threatId}=await req.json();const t=threats.find(x=>x.id===threatId);if(!t) return Response.json({error:'not found'},{status:404});
const markdown=`# SOC Analyst Note\n- Threat Name: ${t.title}\n- Date: ${t.date}\n- Severity: ${t.severity}\n- Summary: ${t.summary}\n- Affected Products: ${t.affectedProducts.join(', ')}\n- IOCs: ${t.iocs.length?t.iocs.map(i=>`${i.type}:${i.value}`).join(', '):'None published in cited sources'}\n- MITRE ATT&CK: ${t.mitre.map(m=>m.subTechnique??m.technique).join(', ')}\n- Detection Recommendations: ${t.actions.join(' ')}\n- Escalation Priority: P1\n- Confidence: Medium\n\n## Sources\n${t.sources.map(s=>`- ${s.name}: ${s.url}`).join('\n')}`;
return Response.json({markdown});}
