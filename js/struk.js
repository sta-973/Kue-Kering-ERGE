function printStruk() {
  if (!window.cart || window.cart.length === 0) {
    alert("Keranjang kosong!");
    return;
  }

  // Ambil data pemesan
  window.customerName = document.getElementById("customer-name")?.value || "-";
  window.customerAddress = document.getElementById("customer-address")?.value || "-";
  window.customerPhone = document.getElementById("customer-phone")?.value || "-";

  const { jsPDF } = window.jspdf;

  // Ukuran kertas & layout
  const pageWidthFixed = 80; // mm
  const lineHeight = 6;
  const leftMargin = 10;
  const rightMargin = 10;
  const priceArea = 30;

  // Hitung tinggi dokumen berdasarkan isi
  const tmp = new jsPDF({ unit: "mm", format: [pageWidthFixed, 200] });
  const wrapWidth = pageWidthFixed - leftMargin - rightMargin - priceArea;
  let totalLines = 0;

  window.cart.forEach(item => {
    const nameText = `${item.name} (${item.unit}) x ${item.qty}`;
    const lines = tmp.splitTextToSize(nameText, wrapWidth);
    totalLines += lines.length;
  });

  const headerSpace = 40;
  const totalsSpace = 28;
  const customerSpace = 20;
  const extraPadding = 10;
  const docHeight = Math.max(
    120,
    headerSpace + (totalLines * lineHeight) + totalsSpace + customerSpace + extraPadding
  );

  // Buat dokumen PDF
  const doc = new jsPDF({ unit: "mm", format: [pageWidthFixed, docHeight] });
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 8;

  // Tanggal transaksi
  const now = new Date();
  const tanggal = now.toLocaleDateString("id-ID", {
    day: "2-digit", month: "2-digit", year: "numeric"
  });
  const jam = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  function buildAndSave() {
    y += 2;

    // Header toko
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Toko Kue ERGE", pageWidth / 2, y, { align: "center" });
    y += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Jn. Padang panjang - Solok no.19a", pageWidth / 2, y, { align: "center" });
    y += 4;
    doc.text("Bunga tanjung - Tanah Datar", pageWidth / 2, y, { align: "center" });
    y += 6;

    // Tambah tanggal transaksi
    doc.setFontSize(9);
    doc.text(`Tanggal : ${tanggal} ${jam}`, pageWidth / 2, y, { align: "center" });
    y += 6;

    doc.setLineWidth(0.3);
    doc.line(leftMargin, y, pageWidth - rightMargin, y);
    y += 4;

    // Daftar item
    let subtotal = 0;
    window.cart.forEach(item => {
      const nameText = `${item.name} (${item.unit}) x ${item.qty}`;
      const lines = doc.splitTextToSize(nameText, wrapWidth);

      lines.forEach((line, idx) => {
        if (y + lineHeight > doc.internal.pageSize.getHeight() - 20) {
          doc.addPage();
          y = 10;
        }
        doc.text(line, leftMargin, y);
        if (idx === lines.length - 1) {
          const priceNumber = item.price * item.qty;
          const priceText = `Rp ${priceNumber.toLocaleString("id-ID")}`;
          doc.text(priceText, pageWidth - rightMargin, y, { align: "right" });
        }
        y += lineHeight;
      });
      subtotal += item.price * item.qty;
    });

    // Garis pemisah & total
    y += 2;
    doc.line(leftMargin, y, pageWidth - rightMargin, y);
    y += 4;

    const ppn = Math.round(subtotal * 0.0);
    const ongkir = 0;
    const total = subtotal + ppn + ongkir;

    doc.text("Subtotal", leftMargin, y);
    doc.text(`Rp ${subtotal.toLocaleString("id-ID")}`, pageWidth - rightMargin, y, { align: "right" });
    y += lineHeight;

    doc.text("PPN 0%", leftMargin, y);
    doc.text(`Rp ${ppn.toLocaleString("id-ID")}`, pageWidth - rightMargin, y, { align: "right" });
    y += lineHeight;

    doc.text("Ongkir", leftMargin, y);
    doc.text(`Rp ${ongkir.toLocaleString("id-ID")}`, pageWidth - rightMargin, y, { align: "right" });
    y += lineHeight;

    doc.setFont("helvetica", "bold");
    doc.text("TOTAL", leftMargin, y);
    doc.text(`Rp ${total.toLocaleString("id-ID")}`, pageWidth - rightMargin, y, { align: "right" });
    y += (lineHeight + 6);

    doc.setLineWidth(0.3);
    doc.line(leftMargin, y, pageWidth - rightMargin, y);
    y += 4;

    // Data pemesan
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Nama   : ${window.customerName}`, leftMargin, y); y += 6;

    const addrLines = doc.splitTextToSize(
      `Alamat : ${window.customerAddress}`,
      pageWidth - leftMargin - rightMargin
    );
    addrLines.forEach(line => { doc.text(line, leftMargin, y); y += 5; });

    doc.text(`No HP  : ${window.customerPhone}`, leftMargin, y);
    y += 6;

    // ✅ Buka PDF di tab baru agar bisa cetak di HP
    const pdfBlob = doc.output("blob");
    const pdfURL = URL.createObjectURL(pdfBlob);
    window.open(pdfURL);

// simpan PDF
if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
  // jika di HP, buka file PDF di tab baru
  const pdfBlob = doc.output("blob");
  const blobUrl = URL.createObjectURL(pdfBlob);
  window.open(blobUrl, "_blank");
} else {
  // jika di laptop/PC, tetap simpan otomatis
  doc.save("struk_TKE.pdf");
}

    // ✅ Simpan otomatis ke file
    doc.save("struk_TKE.pdf");
  }

  // Logo toko
  const logoImg = new Image();
  logoImg.src = "image/logo-erge.png";

  logoImg.onload = function () {
    const logoW = 22;
    const logoH = (logoImg.height / logoImg.width) * logoW;
    doc.addImage(logoImg, "PNG", (pageWidth - logoW) / 2, 4, logoW, logoH);
    y = 4 + logoH + 2;
    buildAndSave();
  };

  logoImg.onerror = function () {
    buildAndSave();
  };
}