import smtplib
from email.message import EmailMessage
import os
from datetime import datetime

# ===== CONFIG =====
SENDER_EMAIL = "is.setia1@gmail.com"      # ganti dengan email kamu
SENDER_PASSWORD = "M1nt10n;/c0ng0R"          # ganti dengan App Password Gmail
RECEIVER_EMAIL = "penerima@email.com"    # email tujuan

CSV_PATH = "orders.csv"                   # path file CSV

# ===== CHECK FILE =====
if not os.path.exists(CSV_PATH):
    print(f"File {CSV_PATH} tidak ditemukan!")
    exit()

# ===== BUAT EMAIL =====
msg = EmailMessage()
msg['Subject'] = f"Rekap Pesanan KUBO-ERGE - {datetime.now().strftime('%d-%m-%Y')}"
msg['From'] = SENDER_EMAIL
msg['To'] = RECEIVER_EMAIL
msg.set_content("Berikut terlampir rekap pesanan harian KUBO-ERGE.")

# Lampirkan CSV
with open(CSV_PATH, "rb") as f:
    file_data = f.read()
    file_name = os.path.basename(CSV_PATH)

msg.add_attachment(file_data, maintype="text", subtype="csv", filename=file_name)

# ===== KIRIM EMAIL =====
try:
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login(SENDER_EMAIL, SENDER_PASSWORD)
        smtp.send_message(msg)
    print("Email berhasil dikirim!")
except Exception as e:
    print("Gagal mengirim email:", e)
