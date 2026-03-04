"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export default function InvoiceGeneratorTool() {
  const t = useTranslations("tools.invoice-generator");
  const tc = useTranslations("common");
  const [processing, setProcessing] = useState(false);

  const [invoiceNumber, setInvoiceNumber] = useState("INV-001");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [currency, setCurrency] = useState("EUR");

  const [fromName, setFromName] = useState("");
  const [fromAddress, setFromAddress] = useState("");
  const [toName, setToName] = useState("");
  const [toAddress, setToAddress] = useState("");

  const [items, setItems] = useState<LineItem[]>([
    { id: crypto.randomUUID(), description: "", quantity: 1, price: 0 },
  ]);
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState("");

  const addItem = () => {
    setItems([...items, { id: crypto.randomUUID(), description: "", quantity: 1, price: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.price, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const currencySymbols: Record<string, string> = { EUR: "\u20AC", USD: "$", GBP: "\u00A3", CHF: "CHF" };
  const sym = currencySymbols[currency] || currency;

  const generatePdf = async () => {
    setProcessing(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      const pw = doc.internal.pageSize.getWidth();

      // Header
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("INVOICE", 20, 30);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`${t("invoice_number")}: ${invoiceNumber}`, pw - 20, 20, { align: "right" });
      doc.text(`${t("date")}: ${invoiceDate}`, pw - 20, 26, { align: "right" });
      if (dueDate) doc.text(`${t("due_date")}: ${dueDate}`, pw - 20, 32, { align: "right" });

      // From / To
      let y = 50;
      doc.setFont("helvetica", "bold");
      doc.text(t("from"), 20, y);
      doc.text(t("to"), 110, y);
      doc.setFont("helvetica", "normal");
      y += 6;
      fromName && doc.text(fromName, 20, y);
      toName && doc.text(toName, 110, y);
      y += 5;
      fromAddress.split("\n").forEach((line, i) => doc.text(line, 20, y + i * 5));
      toAddress.split("\n").forEach((line, i) => doc.text(line, 110, y + i * 5));

      // Table header
      y = 90;
      doc.setFillColor(72, 120, 119);
      doc.rect(20, y, pw - 40, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text(t("item_description"), 22, y + 5.5);
      doc.text(t("qty"), 120, y + 5.5);
      doc.text(t("price"), 145, y + 5.5);
      doc.text(t("amount"), pw - 22, y + 5.5, { align: "right" });

      // Table rows
      doc.setTextColor(55, 71, 75);
      doc.setFont("helvetica", "normal");
      y += 12;
      items.forEach((item) => {
        doc.text(item.description || "-", 22, y);
        doc.text(String(item.quantity), 120, y);
        doc.text(`${sym}${item.price.toFixed(2)}`, 145, y);
        doc.text(`${sym}${(item.quantity * item.price).toFixed(2)}`, pw - 22, y, { align: "right" });
        y += 7;
      });

      // Totals
      y += 5;
      doc.line(120, y, pw - 20, y);
      y += 8;
      doc.text(t("subtotal"), 120, y);
      doc.text(`${sym}${subtotal.toFixed(2)}`, pw - 22, y, { align: "right" });
      if (taxRate > 0) {
        y += 7;
        doc.text(`${t("tax")} (${taxRate}%)`, 120, y);
        doc.text(`${sym}${tax.toFixed(2)}`, pw - 22, y, { align: "right" });
      }
      y += 7;
      doc.setFont("helvetica", "bold");
      doc.text(t("total"), 120, y);
      doc.text(`${sym}${total.toFixed(2)}`, pw - 22, y, { align: "right" });

      // Notes
      if (notes) {
        y += 15;
        doc.setFont("helvetica", "bold");
        doc.text(t("notes"), 20, y);
        doc.setFont("helvetica", "normal");
        y += 6;
        doc.setFontSize(9);
        notes.split("\n").forEach((line) => {
          doc.text(line, 20, y);
          y += 5;
        });
      }

      doc.save(`${invoiceNumber}.pdf`);
    } catch {
      // Error generating PDF
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout toolSlug="invoice-generator">
      <div className="space-y-6">
        {/* Invoice Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">{t("invoice_number")}</label>
            <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">{t("date")}</label>
            <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">{t("due_date")}</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">{t("currency")}</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal">
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
              <option value="CHF">CHF</option>
            </select>
          </div>
        </div>

        {/* From / To */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">{t("from")}</label>
            <input type="text" value={fromName} onChange={(e) => setFromName(e.target.value)} placeholder={t("company_name")} className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:border-teal" />
            <textarea value={fromAddress} onChange={(e) => setFromAddress(e.target.value)} placeholder={t("address")} rows={3} className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-teal" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">{t("to")}</label>
            <input type="text" value={toName} onChange={(e) => setToName(e.target.value)} placeholder={t("client_name")} className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:border-teal" />
            <textarea value={toAddress} onChange={(e) => setToAddress(e.target.value)} placeholder={t("address")} rows={3} className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-teal" />
          </div>
        </div>

        {/* Line Items */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">{t("items")}</label>
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, "description", e.target.value)}
                  placeholder={t("item_description")}
                  className="col-span-5 bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
                />
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                  className="col-span-2 bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
                />
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={item.price}
                  onChange={(e) => updateItem(item.id, "price", Number(e.target.value))}
                  className="col-span-2 bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
                />
                <p className="col-span-2 text-sm text-right font-mono">{sym}{(item.quantity * item.price).toFixed(2)}</p>
                <button
                  onClick={() => removeItem(item.id)}
                  disabled={items.length <= 1}
                  className="col-span-1 text-muted-foreground hover:text-red-500 disabled:opacity-30 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button onClick={addItem} className="mt-2 text-sm text-teal hover:underline">
            + {t("add_item")}
          </button>
        </div>

        {/* Tax and Totals */}
        <div className="flex justify-end">
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("subtotal")}</span>
              <span className="font-mono">{sym}{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{t("tax")}</span>
              <input
                type="number"
                min={0}
                max={100}
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-16 bg-card border border-border rounded px-2 py-1 text-xs text-center focus:outline-none focus:border-teal"
              />
              <span className="text-muted-foreground">%</span>
              <span className="ml-auto font-mono">{sym}{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold border-t border-border pt-2">
              <span>{t("total")}</span>
              <span className="font-mono">{sym}{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">{t("notes")}</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("notes_placeholder")}
            rows={3}
            className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm resize-y focus:outline-none focus:border-teal"
          />
        </div>

        <button
          onClick={generatePdf}
          disabled={processing}
          className="bg-teal text-white font-medium px-6 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm disabled:opacity-50"
        >
          {processing ? tc("processing") : t("download_pdf")}
        </button>
      </div>
    </ToolLayout>
  );
}
