// server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;  // port này phải khớp với URL front-end
const ORDERS_FILE = path.join(__dirname, 'orders.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Tạo orders.json nếu chưa tồn tại
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, '[]', 'utf8');
}

// Nhận đơn hàng từ client
app.post('/api/orders', (req, res) => {
  const order = req.body;
  if (!order.customer || !order.items?.length) {
    return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ.' });
  }

  order.id = `ORD_${Date.now()}`;
  order.createdAt = new Date().toISOString();

  const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
  orders.push(order);
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');

  console.log(`Đơn mới: ${order.id}`);
  res.json({ success: true, orderId: order.id });
});

// (tùy chọn) Xem tất cả đơn đã lưu
app.get('/api/orders', (req, res) => {
  const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
  res.json(orders);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://192.168.1.21:${PORT}`);
});
