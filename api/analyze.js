export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Teks kosong' });

  const prompt = `Kamu adalah analis kredit bank profesional. Baca dokumen Memorandum Analisa Bisnis (MAB) di bawah, ekstrak ke JSON sesuai skema berikut.

Untuk data yang TIDAK ADA di dokumen (terutama alamat kantor supplier/buyer/debitur), gunakan Google Search untuk mencari informasi publik resmi perusahaan tersebut (situs resmi, direktori bisnis). Tandai field "sumber_data" dengan "Dokumen" jika dari teks dokumen, atau "Internet - perlu verifikasi" jika hasil pencarian.

Skema JSON (isi "" jika benar-benar tidak ditemukan dari dokumen maupun internet):
{
  "identitas_debitur": {"nama_debitur":"","cif":"","npwp":"","alamat_kantor_pusat":"","bentuk_badan_usaha":"","nib":""},
  "regional_office":"", "total_plafon_juta":"",
  "management": [{"nama":"","jabatan":""}],
  "supplier": [{"nama_perusahaan":"","alamat":"","sumber_data":""}],
  "buyer": [{"nama_perusahaan":"","alamat":"","sumber_data":""}],
  "fasilitas_kredit": [{"jenis_fasilitas":"","status_pinjaman":"","tenor_bulan":"","plafon_juta":"","suku_bunga_persen":"","biaya_provisi_juta":"","biaya_administrasi_juta":"","servicing_fee":""}],
  "bisnis": {"deskripsi":"","model_bisnis":""},
  "jenis_kredit_diajukan":"", "kegunaan_kredit":"", "jangka_waktu_kredit":"",
  "agunan": [{"jenis":"","nilai_juta":"","lokasi":""}],
  "analisa_keuangan": {"omzet_juta":"","laba_bersih_juta":"","der":""},
  "risiko_dan_legalitas": {"legalitas_status":"","group_afiliasi":"","red_flags":""},
  "rekomendasi_analis": "",
  "analisa_ai": ""
}

Aturan: "management" = semua Direktur/Komisaris/UBO. "red_flags" isi kejanggalan (plafon vs skala usaha, legalitas kurang, dll) atau "Tidak ada" jika wajar. "rekomendasi_analis" = rekomendasi awal 1-2 kalimat, sebutkan ini masih perlu review manusia. "analisa_ai" = catatan umum 2-3 kalimat. Balas HANYA dengan JSON valid, tanpa markdown code fence, tanpa teks lain.

Dokumen:
"""
${text}
"""`;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          tools: [{ google_search: {} }]
        })
      }
    );
    const data = await response.json();
    const parts = data.candidates?.[0]?.content?.parts || [];
    let raw = parts.map(p => p.text || '').join('').trim();
    if (!raw) return res.status(200).json({ error: 'Gemini error: ' + JSON.stringify(data).slice(0,500) });
    raw = raw.replace(/^```json\s*/i, '').replace(/```$/,'').trim();
    let parsed;
    try { parsed = JSON.parse(raw); } catch(e) {
      return res.status(200).json({ error: 'Gagal parse JSON: ' + raw.slice(0,300) });
    }
    res.status(200).json({ result: parsed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
