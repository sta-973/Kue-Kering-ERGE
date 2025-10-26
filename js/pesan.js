// pesan.js — kirim pesanan via WhatsApp ke pemilik & pembeli

function kirimPesanWA() {
    if (!window.cart || window.cart.length === 0) {
      alert("Keranjang kosong! Tambahkan produk terlebih dahulu.");
      return;
    }
  
    // Data pemesan dari form
    const nama = document.getElementById("customer-name")?.value || "-";
    const alamat = document.getElementById("customer-address")?.value || "-";
    const noPemesan = document.getElementById("customer-phone")?.value || "-";
  
    // Nomor WhatsApp pemilik toko (dua nomor)
    const ownerPhones = ["628163171992", "6283172379779"];
  
    // Format pesan
    let pesan = `🧁 *PESANAN BARU - TOKO KUE ERGE*\n\n`;
    pesan += `📅 Tanggal: ${new Date().toLocaleString("id-ID")}\n`;
    pesan += `👤 Nama: ${nama}\n🏠 Alamat: ${alamat}\n📱 No HP: ${noPemesan}\n\n`;
    pesan += `🛍️ *Daftar Pesanan:*\n`;
  
    let total = 0;
    window.cart.forEach((item, i) => {
      const subtotal = item.qty * item.price;
      total += subtotal;
      pesan += `${i + 1}. ${item.name} (${item.unit}) x ${item.qty} = Rp ${subtotal.toLocaleString("id-ID")}\n`;
    });
  
    pesan += `\n💰 *Total: Rp ${total.toLocaleString("id-ID")}*\n\n`;
    pesan += `_Terima kasih sudah memesan di Toko Kue ERGE 💕_\n`;
    pesan += `_Pesanan akan kami konfirmasi secepatnya._`;
  
    // Kirim ke pemilik toko (dua nomor)
    ownerPhones.forEach(phone => {
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(pesan)}`, "_blank");
    });
  
    // Kirim juga ke pemesan (jika no WA diisi)
    if (noPemesan && noPemesan.length >= 8 && /^\d+$/.test(noPemesan)) {
      const pesanPembeli = `Halo ${nama},\n\nTerima kasih sudah memesan di *Toko Kue ERGE* 🍰\n\nBerikut salinan pesanan Anda:\n\n${pesan}`;
      setTimeout(() => {
        window.open(`https://wa.me/${noPemesan}?text=${encodeURIComponent(pesanPembeli)}`, "_blank");
      }, 1000);
    } else {
      alert("Nomor WA pemesan tidak valid, hanya dikirim ke pemilik toko.");
    }
  }
  