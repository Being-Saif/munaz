// Generates a clean, branded, printable invoice/receipt for an order and
// opens it in a new window with print styling. Used by the admin Orders page
// to produce a bill for delivery.

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const rupee = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export const printInvoice = (order, settings = {}) => {
  const addr = order.shippingAddress || {};
  const items = order.items || [];
  const orderDate = new Date(order.createdAt).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const storeName = settings.storeName || 'Munaz';
  const storeAddress = settings.address || '';
  const contactEmail = settings.contactEmail || '';
  const contactPhone = settings.supportPhone || '';

  const paymentLabel =
    order.paymentMethod === 'cod' ? 'Cash on Delivery'
    : order.paymentMethod ? order.paymentMethod.toUpperCase()
    : '—';

  const itemRows = items.map((it) => `
    <tr>
      <td>
        <div class="item-name">${esc(it.name)}</div>
        ${(it.size || it.color) ? `<div class="item-meta">${[it.size, it.color].filter(Boolean).map(esc).join(' · ')}</div>` : ''}
      </td>
      <td class="center">${it.quantity}</td>
      <td class="right">${rupee(it.price)}</td>
      <td class="right">${rupee(it.price * it.quantity)}</td>
    </tr>
  `).join('');

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Invoice ${esc(order.orderNumber || '')}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1f2937; padding: 28px; font-size: 13px; line-height: 1.5; }
  .brand { font-size: 30px; font-weight: 700; font-style: italic; color: #7E57C2; letter-spacing: -0.5px; }
  .brand-row { display: flex; align-items: center; gap: 8px; }
  .brand-sub { font-size: 11px; color: #9ca3af; margin-top: 2px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #7E57C2; padding-bottom: 16px; margin-bottom: 20px; }
  .invoice-title { text-align: right; }
  .invoice-title h2 { font-size: 18px; color: #111827; letter-spacing: 1px; text-transform: uppercase; }
  .invoice-title .meta { font-size: 11px; color: #6b7280; margin-top: 4px; }
  .cols { display: flex; justify-content: space-between; gap: 24px; margin-bottom: 20px; }
  .col { flex: 1; }
  .label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #9ca3af; margin-bottom: 4px; font-weight: 600; }
  .col .name { font-weight: 600; font-size: 14px; color: #111827; }
  .col p { font-size: 12px; color: #4b5563; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  thead th { background: #f3f4f6; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; padding: 8px 10px; text-align: left; }
  thead th.center, tbody td.center { text-align: center; }
  thead th.right, tbody td.right { text-align: right; }
  tbody td { padding: 10px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
  .item-name { font-weight: 500; color: #111827; }
  .item-meta { font-size: 11px; color: #9ca3af; margin-top: 2px; }
  .totals { margin-left: auto; width: 260px; }
  .totals .row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 12px; color: #4b5563; }
  .totals .grand { border-top: 2px solid #111827; margin-top: 6px; padding-top: 8px; font-size: 15px; font-weight: 700; color: #111827; }
  .payment-badge { display: inline-block; margin-top: 8px; padding: 4px 10px; border-radius: 6px; background: #f3e8ff; color: #7E57C2; font-size: 11px; font-weight: 600; }
  .footer { margin-top: 32px; padding-top: 14px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 11px; color: #9ca3af; }
  @media print { body { padding: 0; } @page { margin: 14mm; } }
</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand-row">
        <svg width="34" height="34" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="inv-mark" x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
              <stop stop-color="#7E57C2" /><stop offset="1" stop-color="#EC4899" />
            </linearGradient>
          </defs>
          <path d="M24 5 C27 12 27 20 24 27 C21 20 21 12 24 5 Z" fill="url(#inv-mark)" />
          <path d="M24 27 C18 22 13 16 12 9 C19 11 24 17 26 25 Z" fill="url(#inv-mark)" opacity="0.85" />
          <path d="M24 27 C30 22 35 16 36 9 C29 11 24 17 22 25 Z" fill="url(#inv-mark)" opacity="0.85" />
          <path d="M24 28 C16 27 8 24 4 18 C11 16 20 19 25 26 Z" fill="url(#inv-mark)" opacity="0.65" />
          <path d="M24 28 C32 27 40 24 44 18 C37 16 28 19 23 26 Z" fill="url(#inv-mark)" opacity="0.65" />
          <path d="M14 32 C18 38 30 38 34 32" stroke="#EC4899" stroke-width="2.5" stroke-linecap="round" fill="none" />
          <circle cx="24" cy="26" r="2" fill="#EC4899" />
        </svg>
        <div class="brand">${esc(storeName).replace(/z$/i, '<span style="color:#EC4899">z</span>')}</div>
      </div>
      <div class="brand-sub">${esc(storeAddress)}</div>
      ${contactEmail ? `<div class="brand-sub">${esc(contactEmail)}</div>` : ''}
      ${contactPhone ? `<div class="brand-sub">${esc(contactPhone)}</div>` : ''}
    </div>
    <div class="invoice-title">
      <h2>Invoice</h2>
      <div class="meta">#${esc(order.orderNumber || '')}</div>
      <div class="meta">${esc(orderDate)}</div>
    </div>
  </div>

  <div class="cols">
    <div class="col">
      <div class="label">Deliver To</div>
      <div class="name">${esc(addr.fullName || '')}</div>
      <p>${esc(addr.address || '')}</p>
      <p>${esc(addr.city || '')}${addr.city ? ', ' : ''}${esc(addr.state || '')} - <strong>${esc(addr.pincode || '')}</strong></p>
      ${addr.phone ? `<p>Phone: ${esc(addr.phone)}</p>` : ''}
      ${order.user?.email ? `<p>Email: ${esc(order.user.email)}</p>` : ''}
    </div>
    <div class="col" style="text-align:right;">
      <div class="label">Payment</div>
      <div class="payment-badge">${esc(paymentLabel)}</div>
      <p style="margin-top:8px; text-transform: capitalize;">Status: ${esc(order.status || '')}</p>
      <p style="text-transform: capitalize;">Shipping: ${esc(order.shippingMethod || 'standard')}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th class="center">Qty</th>
        <th class="right">Price</th>
        <th class="right">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${itemRows}
    </tbody>
  </table>

  <div class="totals">
    <div class="row"><span>Items Total</span><span>${rupee(order.itemsTotal)}</span></div>
    <div class="row"><span>Shipping</span><span>${order.shippingCost ? rupee(order.shippingCost) : 'Free'}</span></div>
    ${order.discount ? `<div class="row"><span>Discount</span><span>- ${rupee(order.discount)}</span></div>` : ''}
    <div class="row grand"><span>Total</span><span>${rupee(order.totalAmount)}</span></div>
  </div>

  <div class="footer">
    Thank you for shopping with ${esc(storeName)}! · This is a computer-generated invoice.
  </div>

  <script>
    window.onload = function () {
      window.print();
      // Close shortly after the print dialog is handled.
      window.onafterprint = function () { window.close(); };
    };
  </script>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=800,height=900');
  if (!win) {
    alert('Please allow pop-ups to print the invoice.');
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
};

export default printInvoice;
