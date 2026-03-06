const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://qtfzeaxfeohcviagifud.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0ZnplYXhmZW9oY3ZpYWdpZnVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxOTkwNTgsImV4cCI6MjA4Nzc3NTA1OH0.DX0szrcp23mLNgcw23rKSujqbWFN7uTTMOWc-aQATjY";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchema() {
    console.log('--- Checking Liabilities Schema ---');
    // Using a hack to get columns from a select that might fail but return error with clues
    // Or try a simple insert with missing fields to see error
    const { data, error } = await supabase.from('liabilities').insert({ name: 'Test' }).select();
    if (error) {
        console.log('Insert error (expected if schema is strict):', error.message);
    } else {
        console.log('Insert success!', data);
    }
}

checkSchema();
