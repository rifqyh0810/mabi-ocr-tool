export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Teks kosong' });

  const prompt = `Kamu adalah analis kredit bank. Analisa dokumen paket kredit berikut dan jawab dalam format terstruktur:
1. Nama calon debitur (perusahaan)
2. Plafon yang diajukan
3. Direktur, Komisaris, dan UBO
4. Bisnis dan model bisnisnya
5. Supplier dan Buyer utama
6. Jenis kredit yang diajukan
7. Kegunaan kredit
8. Jangka waktu kredit
9. Analisa tambahan lain yang relevan untuk Memorandum Analisa Bisnis (MAB)

Jika suatu informasi tidak ditemukan dalam dokumen, tulis "Tidak ditemukan dalam dokumen".

Berikut teks dokumennya:
"""${text}"""`;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      }
    );
    const data = await response.json();
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || ('DEBUG ERROR: ' + JSON.stringify(data));
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
