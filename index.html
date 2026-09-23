<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>MABI Batch Analyzer</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/5.0.4/tesseract.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<style>
:root{--blue:#0a4d8c;--bg:#f4f6f9;--ok:#1a9e57;--err:#d64545;--wait:#e0a72e}
*{box-sizing:border-box}
body{font-family:Segoe UI,Arial,sans-serif;max-width:900px;margin:20px auto;padding:0 15px;background:var(--bg);color:#222}
h2{color:var(--blue)}
.card{background:#fff;border-radius:10px;padding:18px;margin-bottom:16px;box-shadow:0 1px 4px rgba(0,0,0,.08)}
input[type=file]{padding:8px;border:1px dashed #999;border-radius:6px;width:100%}
button{background:var(--blue);color:#fff;border:none;padding:10px 20px;border-radius:6px;cursor:pointer;font-size:14px;margin-top:10px}
button:disabled{background:#aaa;cursor:not-allowed}
button.green{background:var(--ok)}
.file-row{display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;font-size:14px}
.badge{font-size:12px;padding:2px 8px;border-radius:12px;color:#fff}
.badge.wait{background:var(--wait)} .badge.ok{background:var(--ok)} .badge.err{background:var(--err)}
#progressText{color:var(--blue);font-weight:600;font-size:14px}
</style>
</head>
<body>
<h2>📄 MABI Batch Analyzer</h2>
<div class="card">
<p>Upload beberapa dokumen MAB sekaligus (PDF/JPG). Sistem proses satu per satu, lalu semua hasil bisa didownload jadi 1 file Excel.</p>
<input type="file" id="fileInput" accept=".pdf,.jpg,.jpeg,.png" multiple>
<br><button id="processBtn">🚀 Proses & Analisa Semua File</button>
</div>
<div class="card" id="progressCard" style="display:none">
<p id="progressText"></p>
<div id="fileList"></div>
</div>
<div class="card" id="downloadCard" style="display:none">
<p>✅ Semua file selesai diproses.</p>
<button class="green" id="downloadBtn">⬇️ Download Rekap Excel</button>
</div>

<script>
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
const fileInput = document.getElementById('fileInput');
const processBtn = document.getElementById('processBtn');
const progressCard = document.getElementById('progressCard');
const progressText = document.getElementById('progressText');
const fileList = document.getElementById('fileList');
const downloadCard = document.getElementById('downloadCard');
const downloadBtn = document.getElementById('downloadBtn');
let allResults = [];

processBtn.addEventListener('click', async () => {
  const files = Array.from(fileInput.files);
  if (files.length === 0) { alert('Pilih file dulu.'); return; }
  processBtn.disabled = true;
  progressCard.style.display = 'block';
  downloadCard.style.display = 'none';
  fileList.innerHTML = '';
  allResults = [];
  files.forEach((f, i) => {
    const row = document.createElement('div');
    row.className = 'file-row';
    row.innerHTML = `<span>${f.name}</span><span class="badge wait" id="badge-${i}">Menunggu</span>`;
    fileList.appendChild(row);
  });
  for (let i = 0; i < files.length; i++) {
    progressText.textContent = `Memproses file ${i+1} dari ${files.length}: ${files[i].name}`;
    document.getElementById('badge-'+i).textContent = 'Ekstraksi...';
    try {
      const text = await extractText(files[i]);
      document.getElementById('badge-'+i).textContent = 'Analisa AI...';
      const data = await analyzeText(text);
      data._fileName = files[i].name;
      allResults.push(data);
      document.getElementById('badge-'+i).textContent = 'Selesai';
      document.getElementById('badge-'+i).className = 'badge ok';
    } catch(err) {
      allResults.push({_fileName: files[i].name, _error: err.message});
      document.getElementById('badge-'+i).textContent = 'Gagal';
      document.getElementById('badge-'+i).className = 'badge err';
    }
    if (i < files.length - 1) await new Promise(r => setTimeout(r, 3000));
  }
  progressText.textContent = `Semua ${files.length} file selesai diproses.`;
  downloadCard.style.display = 'block';
  processBtn.disabled = false;
});

async function extractText(file) {
  if (file.type === 'application/pdf') {
    const buf = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({data: buf}).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(it => it.str).join(' ');
      if (pageText.trim().length > 20) { fullText += pageText + '\n\n'; }
      else {
        const viewport = page.getViewport({scale: 2});
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width; canvas.height = viewport.height;
        await page.render({canvasContext: canvas.getContext('2d'), viewport}).promise;
        const { data: { text } } = await Tesseract.recognize(canvas, 'ind+eng');
        fullText += text + '\n\n';
      }
    }
    return fullText.trim();
  } else {
    const { data: { text } } = await Tesseract.recognize(file, 'ind+eng');
    return text.trim();
  }
}

async function analyzeText(text) {
  const res = await fetch('/api/analyze', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.result;
}

downloadBtn.addEventListener('click', () => {
  const wb = XLSX.utils.book_new();
  const eko = [];
  allResults.forEach((d, idx) => {
    if (d._error) { eko.push({No: idx+1, 'Nama File': d._fileName, Error: d._error}); return; }
    const mgmt = d.management && d.management.length ? d.management : [{}];
    const sup = d.supplier && d.supplier.length ? d.supplier : [{}];
    const buy = d.buyer && d.buyer.length ? d.buyer : [{}];
    const maxLen = Math.max(mgmt.length, sup.length, buy.length, 1);
    for (let i = 0; i < maxLen; i++) {
      eko.push({
        No: i===0 ? idx+1 : '',
        CIF: i===0 ? (d.cif||'') : '',
        'Nama Debitur': i===0 ? (d.nama_debitur||'') : '',
        'Regional Office': i===0 ? (d.regional_office||'') : '',
        'Total Plafon (Rp Juta)': i===0 ? (d.total_plafon_juta||'') : '',
        'Nama (Management)': mgmt[i]?.nama || '',
        'Jabatan': mgmt[i]?.jabatan || '',
        'Data Supplier': sup[i]?.nama_perusahaan || '',
        'Alamat Supplier': sup[i]?.alamat || '',
        'Data Buyer': buy[i]?.nama_perusahaan || '',
        'Alamat Buyer': buy[i]?.alamat || ''
      });
    }
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(eko), 'Data Ekosistem');

  const fbi = [];
  allResults.forEach((d, idx) => {
    if (d._error) return;
    const fas = d.fasilitas_kredit && d.fasilitas_kredit.length ? d.fasilitas_kredit : [{}];
    fas.forEach((f, i) => {
      fbi.push({
        No: i===0 ? idx+1 : '',
        'Regional Office': i===0 ? (d.regional_office||'') : '',
        'CBC Office': i===0 ? (d.cbc_office||'') : '',
        'Nama Debitur': i===0 ? (d.nama_debitur||'') : '',
        'Fasilitas Pinjaman': f.jenis_fasilitas || '',
        'Status Pinjaman': f.status_pinjaman || '',
        'Tenor (Bulan)': f.tenor_bulan || '',
        'Plafon (Rp Juta)': f.plafon_juta || '',
        'Suku Bunga (%)': f.suku_bunga_persen || '',
        'Biaya Provisi (Rp Juta)': f.biaya_provisi_juta || '',
        'Biaya Administrasi (Rp Juta)': f.biaya_administrasi_juta || '',
        'Servicing Fee': f.servicing_fee || ''
      });
    });
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(fbi), 'Data Fasilitas');

  const ai = allResults.map((d, idx) => d._error ? {No: idx+1, 'Nama File': d._fileName, Error: d._error} : {
    No: idx+1,
    'Nama Debitur': d.nama_debitur || '',
    'Jenis Kredit Diajukan': d.jenis_kredit_diajukan || '',
    'Kegunaan Kredit': d.kegunaan_kredit || '',
    'Jangka Waktu Kredit': d.jangka_waktu_kredit || '',
    'Deskripsi Bisnis': d.bisnis?.deskripsi || '',
    'Model Bisnis': d.bisnis?.model_bisnis || '',
    'Analisa & Catatan AI': d.analisa_ai || ''
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(ai), 'Analisa AI');

  XLSX.writeFile(wb, 'Rekap_MABI_' + new Date().toISOString().slice(0,10) + '.xlsx');
});
</script>
</body>
</html>
