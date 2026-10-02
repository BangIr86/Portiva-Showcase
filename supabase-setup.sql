-- ==============================================================================
-- SKRIP SQL DATABASE LENGKAP: PORTIVA (Showcase Portofolio Canva Site SMK)
-- Jalankan skrip ini di: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. BUAT TABEL PORTOFOLIO
CREATE TABLE IF NOT EXISTS public.portfolios (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nama TEXT NOT NULL,
  jurusan TEXT NOT NULL,
  canva_url TEXT NOT NULL,
  deskripsi TEXT DEFAULT '',
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 2. INDEXING UNTUK PERFORMA QUERY
CREATE INDEX IF NOT EXISTS idx_portfolios_approved_id ON public.portfolios (is_approved, id ASC);
CREATE INDEX IF NOT EXISTS idx_portfolios_jurusan ON public.portfolios (jurusan);

-- 3. AKTIFKAN ROW LEVEL SECURITY (RLS)
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

-- 4. KEBIJAKAN AKSES (POLICIES) UNTUK OPERASI CRUD
-- Hapus policy lama jika ada untuk menghindari konflik
DROP POLICY IF EXISTS "Public select portofolio" ON public.portfolios;
DROP POLICY IF EXISTS "Admin insert portofolio" ON public.portfolios;
DROP POLICY IF EXISTS "Admin update portofolio" ON public.portfolios;
DROP POLICY IF EXISTS "Admin delete portofolio" ON public.portfolios;
DROP POLICY IF EXISTS "Public dapat melihat portofolio approved" ON public.portfolios;
DROP POLICY IF EXISTS "Admin All Access" ON public.portfolios;

-- A. Izin Baca (SELECT) - Semua orang dapat melihat data
CREATE POLICY "Public select portofolio"
  ON public.portfolios
  FOR SELECT
  USING (true);

-- B. Izin Tambah (INSERT) - Mengizinkan penambahan data dari panel Admin
CREATE POLICY "Admin insert portofolio"
  ON public.portfolios
  FOR INSERT
  WITH CHECK (true);

-- C. Izin Perbarui (UPDATE) - Mengizinkan edit & toggle approval dari Admin
CREATE POLICY "Admin update portofolio"
  ON public.portfolios
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- D. Izin Hapus (DELETE) - Mengizinkan penghapusan portofolio dari Admin
CREATE POLICY "Admin delete portofolio"
  ON public.portfolios
  FOR DELETE
  USING (true);

-- 5. DATA AWAL CONTOH (SAMPLE SEED DATA)
-- Hanya masukkan data contoh jika tabel masih kosong
INSERT INTO public.portfolios (nama, jurusan, canva_url, deskripsi, is_approved)
SELECT * FROM (
  VALUES
    ('Ahmad Fauzi', 'RPL', 'https://ahmadfauzi.my.canva.site/', 'Frontend developer dengan spesialisasi React, Next.js, dan Tailwind CSS. 3 proyek web aplikasi nyata.', true),
    ('Siti Nurhaliza', 'DKV', 'https://sitinurhaliza.my.canva.site/', 'Desainer grafis & branding. Portofolio mencakup visual identity, logo design, dan kemasan produk UMKM.', true),
    ('Budi Santoso', 'TKJ', 'https://budisantoso.my.canva.site/', 'Network administrator & server Linux. Sertifikasi Mikrotik MTCNA dan instalasi jaringan fiber optic.', true),
    ('Dewi Anggraini', 'RPL', 'https://dewianggraini.my.canva.site/', 'Fullstack web developer. Berpengalaman membangun REST API dan sistem manajemen inventaris sekolah.', true),
    ('Rizky Pratama', 'DKV', 'https://rizkypratama.my.canva.site/', 'Motion designer & visual content creator. Proyek animasi promosi digital dan infografis interaktif.', true),
    ('Nadia Putri', 'TKJ', 'https://nadiaputri.my.canva.site/', 'Cloud infrastructure & cyber security enthusiast. Konfigurasi server Proxmox dan monitoring jaringan.', true),
    ('Fajar Hidayat', 'RPL', 'https://fajarhidayat.my.canva.site/', 'Mobile developer Flutter dan UI/UX enthusiast. Portofolio aplikasi presensi berbasis geolokasi.', true),
    ('Lina Marlina', 'DKV', 'https://linamarlina.my.canva.site/', 'Ilustrator digital dan desain karakter 2D. Karya buku cerita bergambar dan aset game indie.', true),
    ('Eko Prasetyo', 'TKJ', 'https://ekoprasetyo.my.canva.site/', 'Teknisi router, firewall, dan sistem otomasi server Debian. Proyek Smart Home IoT berbasis ESP32.', true),
    ('Rina Wulandari', 'RPL', 'https://rinawulandari.my.canva.site/', 'Web developer & database administrator dengan pengalaman magang di software house regional.', true)
) AS v(nama, jurusan, canva_url, deskripsi, is_approved)
WHERE NOT EXISTS (SELECT 1 FROM public.portfolios LIMIT 1);
