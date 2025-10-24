console.log("Admin.js berhasil dipanggil");

// js/admin.js

document.addEventListener("DOMContentLoaded", () => {
  const rekapList = document.getElementById("rekap-list");
  const resetBtn = document.getElementById("reset-orders");
  const exportBtn = document.createElement("button");

  exportBtn.textContent = "Export ke Excel";
  document.getElementById("rekap-section").appendChild(exportBtn);

  // Contoh data pesanan (sementara dari localStorage)
  const orders = JSON.parse(localStorage.getItem("orders")) || [
    { id: 1, nama: "Budi", produk: "Kue Nastar", jumlah: 2, total: 50000 },
    { id: 2, nama: "Siti", produk: "Kue Putri Salju", jumlah: 1, total: 30000 }
  ];

  function renderTable() {
    let html = `
      <table border="1" cellpadding="5" cellspacing="0">
        <tr>
          <th>ID</th>
          <th>Nama</th>
          <th>Produk</th>
          <th>Jumlah</th>
          <th>Total</th>
        </tr>
    `;
    orders.forEach(o => {
      html += `
        <tr>
          <td>${o.id}</td>
          <td>${o.nama}</td>
          <td>${o.produk}</td>
          <td>${o.jumlah}</td>
          <td>Rp ${o.total.toLocaleString()}</td>
        </tr>
      `;
    });
    html += "</table>";
    rekapList.innerHTML = html;
  }

  renderTable();

  // Reset pesanan
  resetBtn.addEventListener("click", () => {
    localStorage.removeItem("orders");
    rekapList.innerHTML = "<p>Belum ada pesanan</p>";
  });

  // Export ke Excel (sederhana pakai CSV)
  exportBtn.addEventListener("click", () => {
    let csv = "ID,Nama,Produk,Jumlah,Total\n";
    orders.forEach(o => {
      csv += `${o.id},${o.nama},${o.produk},${o.jumlah},${o.total}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "rekap_pesanan.csv";
    a.click();
    URL.revokeObjectURL(url);
  });
});
