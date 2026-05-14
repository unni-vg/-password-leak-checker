// Daily ingestion skeleton: fetch -> normalize -> dedupe -> enrich -> upsert.
const sources=['https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json','https://services.nvd.nist.gov/rest/json/cves/2.0'];
async function run(){for(const s of sources){console.log('planned fetch',s)}console.log('TODO: parse vendor advisories, extract attributed IOCs, map ATT&CK, store in Supabase with source IDs.');}
run();
