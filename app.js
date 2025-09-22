// Daftar produk
const products = [
    { id: 1, name: "Almond Cookies", img: "image/Almond Cookies.png", jarPrice: 75000, kiloPrice: 160000 },
    { id: 2, name: "Crunchy Cheese", img: "image/Crunchy Cheese Cornflakes Cookies.png", jarPrice: 75000, kiloPrice: 205000 },
    { id: 3, name: "Kacang mede", img: "image/kacang mede.png", jarPrice: 75000, kiloPrice: 150000 },
    { id: 4, name: "Lidah Kucing Coklat", img: "image/lidah kucing Coklat.png", jarPrice: 50000, kiloPrice: 160000 },
    { id: 5, name: "Nastar", img: "image/Nastar.png", jarPrice: 80000, kiloPrice: 175000 },
    { id: 6, name: "Putri Salju Premium", img: "image/Putri Salju Premium.png", jarPrice: 75000, kiloPrice: 150000 },
    { id: 7, name: "Sagu keju Corflakes", img: "image/Sagu Keju Cornflakes.png", jarPrice: 75000, kiloPrice: 160000 },
    { id: 8, name: "Sagu Keju Edam", img: "image/Sagu Keju Edam.png", jarPrice: 75000, kiloPrice: 185000 },
    { id: 9, name: "Thumbprint Coklat Almond", img: "image/Thumbprint Coklat Almond.png", jarPrice: 60000, kiloPrice: 160000 },
    { id: 10, name: "Thumbprint Coklat", img: "image/Thumbprint Cookies.png", jarPrice: 75000, kiloPrice: 160000 },
  ];
  
  // Render produk
  const productList = document.getElementById("product-list");
  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.dataset.id = p.id;
    div.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <label><input type="radio" name="price-${p.id}" value="jar" checked> Toples - Rp ${p.jarPrice.toLocaleString("id-ID")}</label><br>
      <label><input type="radio" name="price-${p.id}" value="kilo"> Kilo - Rp ${p.kiloPrice.toLocaleString("id-ID")}</label><br>
      <button onclick="addToCart(${p.id})">Tambah ke Keranjang</button>
    `;
    productList.appendChild(div);
  });
  
  // Keranjang
  let cart = [];
  
  function addToCart(id) {
    const product = products.find(p => p.id === id);
    const selectedRadio = document.querySelector(`input[name="price-${id}"]:checked`);
    const priceType = selectedRadio.value;
    const price = priceType === "jar" ? product.jarPrice : product.kiloPrice;
  
    const existing = cart.find(item => item.id === id && item.priceType === priceType);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ ...product, price, priceType, qty: 1 });
    }
    renderCart();
  }
  
  function renderCart() {
    const tbody = document.querySelector("#cart-table tbody");
    tbody.innerHTML = "";
    let total = 0;
  
    cart.forEach((item, index) => {
      const row = document.createElement("tr");
      const itemTotal = item.price * item.qty;
      total += itemTotal;
  
      row.innerHTML = `
        <td>${item.name} (${item.priceType === "jar" ? "Toples" : "Kilo"})</td>
        <td>Rp ${item.price.toLocaleString("id-ID")}</td>
        <td><input type="number" value="${item.qty}" min="1" onchange="updateQty(${index}, this.value)"></td>
        <td>Rp ${itemTotal.toLocaleString("id-ID")}</td>
        <td><button onclick="removeFromCart(${index})">Hapus</button></td>
      `;
      tbody.appendChild(row);
    });
  
    document.getElementById("cart-total").innerText = `Total: Rp ${total.toLocaleString("id-ID")}`;
  }
  
  function updateQty(index, value) {
    cart[index].qty = parseInt(value);
    renderCart();
  }
  
  function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
  }
  
  function checkout() {
    if (cart.length === 0) {
      alert("Keranjang kosong!");
      return;
    }
  
    let message = "Halo, saya ingin memesan:%0A";
    let subtotal = 0;
  
    cart.forEach(item => {
      const total = item.price * item.qty;
      subtotal += total;
      message += `- ${item.name} (${item.priceType === "jar" ? "Toples" : "Kilo"}), Jumlah: ${item.qty}, Harga: Rp ${item.price.toLocaleString("id-ID")} x ${item.qty} = Rp ${total.toLocaleString("id-ID")}%0A`;
    });
  
    const ppn = Math.round(subtotal * 0.11);
    const grandtotal = subtotal + ppn;
  
    message += `%0ASubtotal: Rp ${subtotal.toLocaleString("id-ID")}`;
    message += `%0APPn 11%: Rp ${ppn.toLocaleString("id-ID")}`;
    message += `%0ATotal Bayar: Rp ${grandtotal.toLocaleString("id-ID")}`;
  
    const phoneNumber = "628126955534"; // ganti dengan nomor WA kamu
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
  
    window.open(url, "_blank");
  }
  