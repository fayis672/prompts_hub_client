const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

if (!url || !key) {
    console.log("No url/key");
    process.exit(1);
}

const supabase = createClient(url, key);

async function check() {
    console.log("Fetching buckets...");
    const { data: buckets, error: bError } = await supabase.storage.listBuckets();
    console.log("Error:", bError);
    
    if (buckets) {
       for (const b of buckets) {
           console.log(`- ${b.name} (public: ${b.public})`);
           const { data: files, error: fError } = await supabase.storage.from(b.name).list();
           if (fError) {
               console.log(`  error fetching files for ${b.name}:`, fError);
           } else {
               console.log(`  files in ${b.name}: ${files?.length || 0}`);
           }
       }
    } else {
        console.log("No buckets found or RLS blocks anon from listing buckets.");
    }
}
check();
