import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://odfabesmvesqcljnluwr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kZmFiZXNtdmVzcWNsam5sdXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNTc3MzMsImV4cCI6MjA5NTkzMzczM30.FgnU8s6Qr85etlZTLeeNejuDeSN4WIO3HZ-Ixc8GqX0';

// createClient = fungsi untuk bikin koneksi ke Supabase
// parameter ketiga adalah konfigurasi tambahan
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,        // tempat nyimpan session
        autoRefreshToken: true,       // otomatis refresh token kalau mau expired
        persistSession: true,         // simpan session meski app ditutup
        detectSessionInUrl: false,    // matikan ini karena kita mobile, bukan web
    },
});

