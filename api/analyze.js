export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Teks kosong' });

  const prompt = `Kamu adalah analis kredit bank profesional. Baca teks dokumen Memorandum Analisa Bisnis (MAB) berikut, lalu ekstrak informasinya ke JSON PERSIS seperti skema ini (jangan tambah teks lain di luar JSON):

{
  "cif": "", "nama_debitur": "", "regional_office": "", "cbc_office": "", "total_plafon_juta": "",
  "management": [{"nama": "", "jabatan": ""}],
  "supplier": [{"nama_perusahaan": "", "alamat": ""}],
  "buyer": [{"nama_perusahaan": "", "alamat": ""}],
  "fasilitas_kredit": [{"jenis_fasilitas": "", "status_pinjaman": "", "tenor_bulan": "", "plafon_juta": "", "suku_bunga_persen": "", "biaya_provisi_juta": "", "biaya_administrasi_juta": "", "servicing_fee": ""}],
  "bisnis": {"deskripsi": "", "model_bisnis": ""},
  "jenis_kredit_diajukan": "", "kegunaan_kredit": "", "jangka_waktu_kredit": "", "analisa_ai": ""
}

Aturan: kalau info tidak ditemukan isi "". "management" mencakup semua Direktur/Komisaris/UBO. "analisa_ai" isi catatan singkat 2-4 kalimat (kewajaran plafon vs skala bisnis, red flag jika ada). Balas HANYA JSON valid, tanpa markdown.

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
          generationConfig: { responseMimeType: 'application/json' }
        })
      }
    );
    const data = await response.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) return res.status(200).json({ error: 'Gemini error: ' + JSON.stringify(data) });
    let parsed;
    try { parsed = JSON.parse(raw); } catch(e) {
      return res.status(200).json({ error: 'Gagal parse JSON: ' + raw.slice(0,300) });
    }
    res.status(200).json({ result: parsed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
