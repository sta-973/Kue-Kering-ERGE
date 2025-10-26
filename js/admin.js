alert("admin.js jalan");

const rekapList = document.getElementById("rekap-list");
const ordersBody = document.getElementById("orders-body");

// ===== RENDER REKAP =====
function renderOrders(){
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  ordersBody.innerHTML = "";

  orders.forEach((order,index)=>{
    order.items.forEach(item=>{
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${index+1}</td>
        <td>${order.customerName}</td>
        <td>${item.name}</td>
        <td>${item.qty} ${item.unit}</td>
        <td>Rp ${(item.price*item.qty).toLocaleString()}</td>
        <td>${order.date}</td>
      `;
      ordersBody.appendChild(tr);
    });
  });
}

// ===== RESET =====
document.getElementById("reset-orders").onclick = () => {
  if(confirm("Hapus semua rekap pesanan?")){
    localStorage.removeItem("orders");
    renderOrders();
  }
};

// ===== EXPORT KE EXCEL (CSV sederhana) =====
document.getElementById("export-excel").onclick = () => {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  let csv = "No,Nama,Produk,Jumlah,Total,Tanggal\n";
  orders.forEach((order,index)=>{
    order.items.forEach(item=>{
      csv+=`${index+1},${order.customerName},${item.name},${item.qty} ${item.unit},${item.price*item.qty},${order.date}\n`;
    });
  });
  const blob = new Blob([csv],{type:"text/csv"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "rekap_pesanan.csv";
  a.click();
  URL.revokeObjectURL(url);
};

// ===== LOAD =====
document.addEventListener("DOMContentLoaded",()=>{
  renderOrders();
});
// ===== EMAIL REKAP OTOMATIS =====
// 🔹 Nempel di sini, di akhir admin.js
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

// 🔹 Pastikan ini dipanggil di akhir admin.js
scheduleEmail();
