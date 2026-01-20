import PDFDocument from "pdfkit";

export const generateInvoicePDF = (order, res) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${order._id}.pdf`
  );

  doc.pipe(res);

  doc.fontSize(20).text("HerAura Cosmetics", { align: "center" }).moveDown(0.5);
  doc.fontSize(10).text("Invoice", { align: "center" }).moveDown(2);

  doc.fontSize(12);
  doc.text(`Invoice ID: ${order._id}`);
  doc.text(`Order Date: ${new Date(order.createdAt).toDateString()}`);
  doc.text(`Order Status: ${order.orderStatus}`);
  doc.moveDown();

  doc.text("Bill To:");
  doc.text(order.shippingAddress?.fullName || "Customer");
  doc.text(order.shippingAddress?.addressLine1 || "");
  doc.text(order.shippingAddress?.city || "");
  doc.text(order.shippingAddress?.country || "");
  doc.moveDown();

  doc.text("Items:");
  doc.moveDown(0.5);

  order.items.forEach((item, index) => {
    doc.text(`${index + 1}. ${item.name} | Qty: ${item.qty} | Price: ${item.price}`);
  });

  doc.moveDown();
  doc.fontSize(14).text(`Total Amount: PKR ${order.total}`, { align: "right" });

  doc.moveDown(2);
  doc.fontSize(10).text("Thank you for shopping with HerAura!", { align: "center" });

  doc.end();
};
