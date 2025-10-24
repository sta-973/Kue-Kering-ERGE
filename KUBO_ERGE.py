from fpdf import FPDF

pdf = FPDF()
pdf.add_page()
pdf.set_font("Arial", 'B', 16)
pdf.cell(0, 10, "Checklist Final KUBO-ERGE Admin & Customer WebApp", ln=True, align="C")

pdf.set_font("Arial", '', 12)
checklist_items = [
    "Admin.html menampilkan tabel rekap pesanan",
    "Tombol Reset Pesanan bekerja dan membersihkan localStorage",
    "Tombol Export ke Excel / CSV siap",
    "Nomor WA toko bisa disimpan dan ditampilkan",
    "Keranjang di app.js bekerja → tambah, kurangi, hapus item",
    "Total harga otomatis update",
    "Checkout WA membuka chat dengan pesan yang terformat benar",
    "Input Nama, Alamat, No HP bisa kosong diganti tanda '-'",
    "Semua kategori produk tampil",
    "Gambar produk muncul di web & mobile",
    "Harga Toples/Kilo/Pcs muncul sesuai kategori",
    "Pilihan unit (jar/kilo) berfungsi di keranjang",
    "Tombol Cetak Struk PDF berfungsi",
    "Isi struk sesuai keranjang saat checkout",
    "Format harga & unit tampil rapi",
    "EmailJS SDK ditambahkan di admin.html",
    "Fungsi sendEmailRekap() mengekstrak data dari localStorage",
    "Fungsi scheduleEmail() mengirim email otomatis jam 17:00",
    "Email dalam format CSV → bisa dibuka di Excel",
    "Dashboard & keranjang tampil di desktop & HP",
    "Tabel, gambar, dan tombol tetap rapi saat di HP",
    "CSS sudah memuat style dasar dan margin/padding rapi",
    "Data pesanan tersimpan di localStorage jika browser ditutup",
    "Tombol reset memiliki konfirmasi sebelum menghapus data"
]

for item in checklist_items:
    pdf.cell(0, 10, f"[ ] {item}", ln=True)

pdf.output("KUBO_ERGE_Checklist.pdf")
