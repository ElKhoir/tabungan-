const $ = s => document.querySelector(s);
const tbody = $('#tbl tbody');

async function load() {
  const res = await fetch('/api/siswa');
  const data = await res.json();
  tbody.innerHTML = data.map(s => `
    <tr>
      <td>${s.id}</td>
      <td>${s.nama}</td>
      <td>Rp ${Number(s.saldo).toLocaleString('id-ID')}</td>
      <td><button data-del="${s.id}" class="danger">Hapus</button></td>
    </tr>`).join('');
}

$('#add').onclick = async () => {
  const nama = $('#nama').value.trim();
  if (!nama) return alert('Nama wajib');
  const r = await fetch('/api/siswa', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ nama }) });
  if (r.ok) { $('#nama').value=''; load(); } else alert('Gagal tambah');
};

tbody.addEventListener('click', async e => {
  const id = e.target.getAttribute('data-del');
  if (id && confirm('Hapus siswa?')) {
    const r = await fetch('/api/siswa/'+id, { method:'DELETE' });
    if (r.ok) load();
  }
});

$('#setor').onclick = async () => {
  const id = +$('#sid').value, jumlah = +$('#jumlah').value;
  if (!id || !jumlah) return alert('Isi ID & jumlah');
  const r = await fetch(`/api/siswa/${id}/tambah`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ jumlah }) });
  if (r.ok) load(); else alert('Gagal setor');
};

$('#tarik').onclick = async () => {
  const id = +$('#sid').value, jumlah = +$('#jumlah').value;
  if (!id || !jumlah) return alert('Isi ID & jumlah');
  const r = await fetch(`/api/siswa/${id}/kurang`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ jumlah }) });
  if (r.ok) load(); else alert('Gagal tarik');
};

window.onload = () => { $('#year').textContent = new Date().getFullYear(); load(); };
