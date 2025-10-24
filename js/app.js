window.cart = []; // global// ===== EMAIL REKAP OTOMATIS =====
// 🔹 Nempel di sini, setelah window.cart
function sendEmailRekap(){
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    if(!orders.length) return;

    let csv = "No,Nama,Produk,Jumlah,Total,Tanggal\n";
    orders.forEach((order,index)=>{
        order.items.forEach(item=>{
            csv+=`${index+1},${order.customerName},${item.name},${item.qty} ${item.unit},${item.price*item.qty},${order.date}\n`;
        });
    });

    emailjs.send("YOUR_SERVICE_ID","YOUR_TEMPLATE_ID",{
        to_email: "admin@example.com",
        subject: "Rekap Pesanan Harian",
        message: csv
    }).then(res=>console.log("Email terkirim"),err=>console.error(err));
}

function scheduleEmail(){
    const now = new Date();
    const millisTill17 = new Date(now.getFullYear(), now.getMonth(), now.getDate(),17,0,0,0) - now;
    setTimeout(()=>{
        sendEmailRekap();
        setInterval(sendEmailRekap,24*60*60*1000); // ulang tiap 24 jam
    }, millisTill17);
}


// ===== DATA PRODUK =====
const allProducts = {
  "kuekering": [
    { id: 1, name: "Almond Cookies", img: "image/Almond Cookies.png", jarPrice: 75000, kiloPrice: 160000 },
    { id: 2, name: "Crunchy Cheese", img: "image/Crunchy Cheese Cornflakes Cookies.png", jarPrice: 75000, kiloPrice: 205000 },
    { id: 3, name: "Kacang mede", img: "image/kacang mede.png", jarPrice: 75000, kiloPrice: 150000 },
    { id: 4, name: "Lidah Kucing Coklat", img: "image/lidah kucing Coklat.png", jarPrice: 50000, kiloPrice: 160000 },
    { id: 5, name: "Nastar", img: "image/Nastar.png", jarPrice: 80000, kiloPrice: 175000 },
    { id: 6, name: "Putri Salju Premium", img: "image/Putri Salju Premium.png", jarPrice: 75000, kiloPrice: 150000 },
    { id: 7, name: "Sagu keju Cornflakes", img: "image/Sagu Keju Cornflakes.png", jarPrice: 75000, kiloPrice: 160000 },
    { id: 8, name: "Sagu Keju Edam", img: "image/Sagu Keju Edam.png", jarPrice: 75000, kiloPrice: 185000 },
    { id: 9, name: "Thumbprint Coklat Almond", img: "image/Thumbprint Coklat Almond.png", jarPrice: 60000, kiloPrice: 160000 }
  ],
  "bolu": [
    { id: 10, name: "Bolu Pandan", img: "image/70bolu_pandan.png", price: 55000 },
    { id: 11, name: "Bolu Pisang", img: "image/70bolu_Pisang.png", price: 55000 },
    { id: 12, name: "Bolu Tape Keju", img: "image/70Bolu_Tape_Keju.png", price: 60000 },
    { id: 13, name: "Bolu Tape Pandan", img: "image/70BoluTapePandan.png", price: 60000 },
    { id: 14, name: "Bolu Rainbow", img: "image/70RainBow.png", price: 60000 },
    { id: 15, name: "Bolu Brownis Coklat", img: "image/90BrownisCoklat.png", price: 60000 },
    { id: 16, name: "Bolu Brownis Pandan", img: "image/90BrownisPandan.png", price: 60000 },
    { id: 17, name: "Bolu Butter Marmer", img: "image/90Butter_Marmer_cake.png", price: 60000 },
    { id: 18, name: "Bolu Macan", img: "image/90Macan.png", price: 60000 }
  ],
  "rendang": [
    { id: 19, name: "Rendang Daging", img: "image/Rendang.png", kiloPrice: 350000 },
    { id: 20, name: "Keripik Talas", img: "image/KeripikTalas.png", price: 20000 },
    { id: 21, name: "Raki Maco", img: "image/RakiMaco.png", price: 20000 }
  ],
  "kuliner": [
    { id: 22, name: "Bolen Pisang", img: "image/Bolen.png", price: 5000 },
    { id: 23, name: "Donat Ubi", img: "image/DonatUbi.png", price: 5000 },
    { id: 24, name: "Risoles", img: "image/Risoles.png", price: 5000 },
    { id: 25, name: "Kue Pai Coklat", img: "image/kuePaiCoklat.png", price: 5000 }
  ]
};

// ===== RENDER PRODUK =====
function renderProducts(products) {
  const productsDiv = document.getElementById("products");
  productsDiv.innerHTML = "";

  products.forEach(product => {
    const div = document.createElement("div");
    div.className = "product";

    if(product.kiloPrice && product.jarPrice) {
      div.innerHTML = `
        <img src="${encodeURI(product.img)}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>Rp ${product.jarPrice.toLocaleString()} / Toples | Rp ${product.kiloPrice.toLocaleString()} / Kilo</p>
        <select id="unit-${product.id}">
          <option value="jar">Toples</option>
          <option value="kilo">Kilo</option>
        </select>
        <button onclick="addToCart(${product.id})">Tambah ke Keranjang</button>
      `;
    } else if(product.kiloPrice) {
      div.innerHTML = `
        <img src="${encodeURI(product.img)}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>Rp ${product.kiloPrice.toLocaleString()} / Kilo</p>
        <select id="unit-${product.id}">
          <option value="kilo">Kilo</option>
        </select>
        <button onclick="addToCart(${product.id})">Tambah ke Keranjang</button>
      `;
    } else if(product.price) {
      div.innerHTML = `
        <img src="${encodeURI(product.img)}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>Rp ${product.price.toLocaleString()} / pcs</p>
        <div class="qty-control">
          <button onclick="changeQty(${product.id}, -1)">-</button>
          <span id="qty-${product.id}">0</span>
          <button onclick="changeQty(${product.id}, 1)">+</button>
        </div>
      `;
    }

    productsDiv.appendChild(div);
  });
}

// ===== ADD TO CART =====
function addToCart(id) {
  const products = Object.values(allProducts).flat();
  const product = products.find(p => p.id === id);
  const unitEl = document.getElementById(`unit-${id}`);
  const unit = unitEl ? unitEl.value : "pcs";
  const price = product.kiloPrice && unit==="kilo" ? product.kiloPrice :
                product.jarPrice && unit==="jar" ? product.jarPrice :
                product.price;

  const item = window.cart.find(i => i.id===id && i.unit===unit);
  if(item) item.qty += 1;
  else window.cart.push({id:product.id,name:product.name,unit,price,qty:1});

  updateCart();
}

// ===== QTY CONTROL PER PCS =====
function changeQty(id, delta) {
  const product = Object.values(allProducts).flat().find(p=>p.id===id);
  const qtySpan = document.getElementById(`qty-${id}`);
  if(!qtySpan) return;
  let qty = parseInt(qtySpan.textContent) + delta;
  if(isNaN(qty) || qty < 0) qty = 0;
  qtySpan.textContent = qty;

  if(qty > 0){
    const item = window.cart.find(i=>i.id===id && i.unit==="pcs");
    if(item) item.qty = qty;
    else window.cart.push({id:product.id,name:product.name,unit:"pcs",price:product.price,qty});
  } else {
    window.cart = window.cart.filter(i=>!(i.id===id && i.unit==="pcs"));
  }
  updateCart();
}

// ===== UPDATE CART =====
function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  cartItems.innerHTML = "";
  let total = 0;

  window.cart.forEach(item=>{
    total += item.price*item.qty;
    const li = document.createElement("li");
    li.textContent = `${item.name} (${item.unit}) x ${item.qty}`;
    const span = document.createElement("span");
    span.textContent = `Rp ${(item.price*item.qty).toLocaleString()}`;
    span.style.float="right";
    li.appendChild(span);
    cartItems.appendChild(li);
  });

  cartTotal.textContent = total.toLocaleString();
}

// ===== CLEAR CART =====
function clearCart() {
  window.cart = [];
  Object.values(allProducts).flat().forEach(p=>{
    const s = document.getElementById(`qty-${p.id}`);
    if(s) s.textContent="0";
  });
  updateCart();
}

// ===== NAVIGASI =====
function showSection(sectionId){
  ["home-section","products-section","contact-section"].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.style.display="none";
  });
  const active=document.getElementById(sectionId);
  if(active) active.style.display="block";
}

function showHome(){ showSection("home-section"); }
function showMenu(menu){ showSection("products-section"); renderProducts(allProducts[menu]); }
function showContact(){ showSection("contact-section"); }

// ===== CHECKOUT WA =====
function checkoutWA() {
  if (!window.cart.length) {
  alert("Keranjang kosong!");
  return;
  }
  
 // ambil dari localStorage kalau ada, kalau tidak pakai default dua nomor
  const waToko = JSON.parse(localStorage.getItem("wa_toko")) || ["628163171992", "6283172379779"];
  const customerName = document.getElementById("customer-name").value || "-";
  const customerAddress = document.getElementById("customer-address").value || "-";
  const customerPhone = document.getElementById("customer-phone").value.replace(/\D/g, "");
  
  // isi pesan pesanan
  let message = `Halo, saya ingin pesan:\n`;
  window.cart.forEach(item => {
  message += `- ${item.name} (${item.unit}) x ${item.qty} = Rp ${(item.price * item.qty).toLocaleString('id-ID')}\n`;
  });
  
  const total = window.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const ppn = Math.round(total * 0.0);
  const grandTotal = total + ppn;
  message += `\nSubtotal: Rp ${total.toLocaleString('id-ID')}`;
  message += `\nPPN 0%: Rp ${ppn.toLocaleString('id-ID')}`;
  message += `\nTotal: Rp ${grandTotal.toLocaleString('id-ID')}\n\n`;
  message += `Nama: ${customerName}\nAlamat: ${customerAddress}\nNo HP: ${customerPhone}\n`;
  
  // deteksi ucapan penutup otomatis menjelang Lebaran 2026
  const now = new Date();
  const startLebaran = new Date("2026-04-05");
  const endLebaran = new Date("2026-04-27");
  
  let closingMessage;
  if (now >= startLebaran && now <= endLebaran) {
  closingMessage = "Pesanan Anda sudah kami catat dan akan kami proses menjelang Lebaran 🌙✨\nSemoga persiapan hari raya Anda lancar dan penuh berkah 🙏\nSelamat menunaikan ibadah Ramadan dan Selamat Hari Raya Idul Fitri 1447 H 🌙";
  } else {
  closingMessage = "Terima kasih sudah memesan di *Toko Kue ERGE!* 😊\nPesanan Anda akan kami proses sesuai jadwal yang disepakati.";
  }
  
  // kirim ke pemilik toko
  //window.open(`https://wa.me/${waToko}?text=${encodeURIComponent(message + "\n" + closingMessage)}`, "_blank");
  waToko.forEach(phone => {
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(pesan)}`, "_blank");
  });
  
  // kirim juga ke pembeli jika nomor valid
  if (customerPhone && customerPhone.length >= 9) {
  setTimeout(() => {
  window.open(`https://wa.me/${customerPhone}?text=${encodeURIComponent("Terima kasih sudah memesan di *Toko Kue ERGE!* Berikut salinan pesanan Anda:\n\n" + message + "\n" + closingMessage)}`, "_blank");
  }, 1500);
  }
  
  // simpan ke rekap lokal
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push({
  date: new Date().toLocaleString("id-ID"),
  customerName,
  customerAddress,
  customerPhone,
  items: window.cart.map(i => ({ name: i.name, unit: i.unit, qty: i.qty, price: i.price })),
  total: grandTotal
  });
  localStorage.setItem("orders", JSON.stringify(orders));
  
  clearCart();
  }
  

// ===== CETAK STRUK =====
function printStruk(){
  if(!window.cart.length){ alert("Keranjang kosong!"); return; }
  let struk = "===== STRUK PEMBELIAN =====\n";
  window.cart.forEach(item=>{
    struk+=`${item.name} (${item.unit}) x ${item.qty} = Rp ${item.price*item.qty}\n`;
  });
  struk+="===========================\n";
  alert(struk);
}

// ===== DEFAULT =====
window.onload = ()=>{
  showHome();
  document.getElementById("checkout-btn").onclick=checkoutWA;
  document.getElementById("print-btn").onclick=printStruk;
  document.getElementById("clear-btn").onclick=clearCart;
};
