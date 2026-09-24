import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { supabase, supabaseConfigured } from "./supabaseClient";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const Icon = ({ name, size = 18, stroke = 1.8 }) => {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    calendar: <><rect x="3" y="4.5" width="18" height="17" rx="2"/><path d="M16 2.5v4M8 2.5v4M3 9.5h18"/></>,
    arrowUp: <><path d="M12 19V5M6 11l6-6 6 6"/></>,
    arrowDown: <><path d="M12 5v14M6 13l6 6 6-6"/></>,
    factory: <><path d="M3 21V9l6 3V9l6 3V4h6v17H3Z"/><path d="M7 17h2M12 17h2M17 17h2M7 20h2M12 20h2M17 20h2"/></>,
    wallet: <><path d="M4 6.5h14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H5a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2h12"/><path d="M16 13h5M17 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/></>,
    box: <><path d="m12 3 8.5 4.7v8.6L12 21l-8.5-4.7V7.7L12 3Z"/><path d="m3.8 7.9 8.2 4.6 8.2-4.6M12 12.5V21"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    receipt: <><path d="M5 3h14v18l-3-2-4 2-4-2-3 2V3Z"/><path d="M8 8h8M8 12h8M8 16h4"/></>,
    truck: <><path d="M3 5h11v12H3zM14 9h4l3 3v5h-7z"/><path d="M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/></>,
    briefcase: <><rect x="3" y="6" width="18" height="14" rx="2"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M3 11h18M10 11v2h4v-2"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    chevron: <path d="m8 10 4 4 4-4"/>,
    chevronRight: <path d="m9 6 6 6-6 6"/>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></>,
    filter: <><path d="M3 5h18M6 12h12M10 19h4"/></>,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/></>,
    edit: <><path d="m14 6 4 4M4 20l4.5-1 10.3-10.3a2.1 2.1 0 0 0-3-3L5.5 16 4 20Z"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    refresh: <><path d="M20 11a8.1 8.1 0 0 0-14.6-3L3 11M3 5v6h6M4 13a8.1 8.1 0 0 0 14.6 3L21 13M21 19v-6h-6"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.7 1.7-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2h-2.4v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1L8 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H6v-2.4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9L7.3 8.6 9 6.9l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5v-.2h2.4v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.7 1.7-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2V14h-.2a1.7 1.7 0 0 0-1.5 1Z"/></>,
    trend: <><path d="M3 17 9 11l4 4 8-9"/><path d="M16 6h5v5"/></>,
    trash: <><path d="M4 7h16M10 11v6M14 11v6M9 7V4h6v3M6 7l1 14h10l1-14"/></>,
    download: <><path d="M12 3v12M7 10l5 5 5-5M4 21h16"/></>,
    upload: <><path d="M12 16V4M7 9l5-5 5 5M4 21h16"/></>,
    shield: <><path d="M12 3 20 6v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
};

const toNumber = (value) => {
  const normalized = typeof value === "string" ? value.replace(/\s/g, "").replace(",", ".") : value;
  const number = Number(normalized);
  return Number.isFinite(number) ? number : 0;
};
const money = (value) => new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 20, minimumFractionDigits: 0 }).format(toNumber(value));
const amount = (value) => `₺${money(value)}`;
const pdfText = (value) => String(value ?? "");
let ayesFontFiles = null;
const getAyesFontFiles = async () => {
  if (!ayesFontFiles) {
    const load = async (path) => {
      const response = await fetch(path);
      const buffer = await response.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = "";
      for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
      return btoa(binary);
    };
    ayesFontFiles = { regular: await load("/fonts/ayes-regular.ttf"), bold: await load("/fonts/ayes-bold.ttf") };
  }
  return ayesFontFiles;
};
const loadAyesFonts = async (doc) => {
  const files = await getAyesFontFiles();
  if (!doc.getFontList().Ayes) {
    doc.addFileToVFS("ayes-regular.ttf", files.regular);
    doc.addFileToVFS("ayes-bold.ttf", files.bold);
    doc.addFont("ayes-regular.ttf", "Ayes", "normal");
    doc.addFont("ayes-bold.ttf", "Ayes", "bold");
  }
};
const loadLogoDataUrl = async () => {
  try {
    const response = await fetch("/ayes-logo.png");
    if (!response.ok) return null;
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    try {
      const image = await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("logo zaman aşımı")), 8000);
        const img = new Image();
        img.onload = () => { clearTimeout(timer); resolve(img); };
        img.onerror = () => { clearTimeout(timer); reject(new Error("logo okunamadı")); };
        img.src = url;
      });
      const canvas = document.createElement("canvas");
      canvas.width = 400; canvas.height = 400;
      const context = canvas.getContext("2d");
      context.fillStyle = "#ffffff"; context.fillRect(0, 0, 400, 400);
      const scale = Math.min(400 / image.naturalWidth, 400 / image.naturalHeight);
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;
      context.drawImage(image, (400 - width) / 2, (400 - height) / 2, width, height);
      return canvas.toDataURL("image/png");
    } finally { URL.revokeObjectURL(url); }
  } catch { return null; }
};
const dateLabel = (date) => new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short" }).format(new Date(`${date}T12:00:00`));
const fullDateLabel = (date) => { try { return new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${date}T12:00:00`)); } catch { return String(date || ""); } };
const hasValue = (value) => String(value ?? "").trim() !== "";
const debtDirection = (row = {}) => row.direction === "lent" ? "lent" : "owed";
const debtDirectionLabel = (row = {}) => debtDirection(row) === "lent" ? "Verilen" : "Alınan";
const debtPaidTotal = (row = {}) => {
  const txns = Array.isArray(row.transactions) ? row.transactions : [];
  if (txns.length) return txns.reduce((sum, txn) => sum + Math.max(0, toNumber(txn && txn.amount)), 0);
  const total = Math.max(0, toNumber(row.amount));
  if (hasValue(row.paidAmount)) return Math.min(total, Math.max(0, toNumber(row.paidAmount)));
  if (hasValue(row.remainingAmount)) return Math.min(total, Math.max(0, total - toNumber(row.remainingAmount)));
  return 0;
};
const debtAmounts = (row = {}) => {
  const total = Math.max(0, toNumber(row.amount));
  const paid = Math.max(0, debtPaidTotal(row));
  return { total, paid, remaining: Math.max(0, total - paid) };
};
const debtStatusLabel = (row = {}) => {
  const { total, paid, remaining } = debtAmounts(row);
  const lent = debtDirection(row) === "lent";
  if (total > 0 && remaining <= 0) return lent ? "Tahsil edildi" : "Ödendi";
  if (paid > 0) return lent ? "Kısmi tahsilat" : "Kısmi ödendi";
  return lent ? "Tahsil edilmedi" : "Ödenmedi";
};
const normalizeDebtRow = (row = {}) => {
  const direction = debtDirection(row);
  const transactions = (Array.isArray(row.transactions) ? row.transactions : []).filter((txn) => txn && toNumber(txn.amount) > 0).map((txn) => ({ id: txn.id || `txn-${Date.now()}`, date: txn.date || row.date || today, amount: toNumber(txn.amount), note: txn.note || "" }));
  if (transactions.length) return { ...row, direction, transactions };
  const legacyPaid = hasValue(row.paidAmount) ? Math.max(0, toNumber(row.paidAmount)) : (hasValue(row.remainingAmount) ? Math.max(0, toNumber(row.amount) - toNumber(row.remainingAmount)) : 0);
  if (legacyPaid <= 0) return { ...row, direction, transactions: [] };
  return { ...row, direction, transactions: [{ id: `${row.id || "debt"}-legacy`, date: row.date || today, amount: legacyPaid, note: direction === "lent" ? "Aktarılan tahsilat" : "Aktarılan ödeme" }] };
};
const normalizeStoredRecords = (stored = {}) => ({ ...emptyRecords, ...stored, debts: ((stored && stored.debts) || []).map(normalizeDebtRow) });
const isSplitPayment = (payment) => /nakit/i.test(String(payment || "")) && /m-pesa/i.test(String(payment || ""));
const localToday = new Date();
const today = `${localToday.getFullYear()}-${String(localToday.getMonth() + 1).padStart(2, "0")}-${String(localToday.getDate()).padStart(2, "0")}`;
const seedCompanies = [
  { id: "default", name: "AYES GROUP", location: "", status: "Taslak", completion: 0, color: "teal" },
];

const seedStockTuples = [
  ["Sürme Sn. Per. Kasa", "Beyaz", "adet"],
  ["Sürme Kanat", "Beyaz", "adet"],
  ["Sürme Çift Cam Çıtası (Oval)", "Beyaz", "adet"],
  ["Sürme Sn. Per. Kasa", "A. Gri", "adet"],
  ["Sürme Kanat", "A. Gri", "adet"],
  ["Sürme Kanat Adaptörü (6m)", "A. Gri", "adet"],
  ["Sürme Çift Cam Çıtası", "A. Gri", "adet"],
  ["Ventana Per. Kasa", "A. Gri", "adet"],
  ["Almnyum Ray", "", "adet"],
  ["Destek Sacı 2 Bağ (50kg)", "", "bağ"],
  ["Momentum Kasa", "Beyaz", "adet"],
  ["Momentum Per. Kasa", "Beyaz", "adet"],
  ["Momentum Pencere Kanat", "Beyaz", "adet"],
  ["Momentum O. Kayıt", "Beyaz", "adet"],
  ["Momentum Kapı Kanadı", "Beyaz", "adet"],
  ["Easy Slde Sürme Kasa", "Beyaz", "adet"],
  ["Easy Slde Sürme Per. Kasa", "Beyaz", "adet"],
  ["Easy Slde Sürme Sn. Per. Kasa", "Beyaz", "adet"],
  ["Easy Slde Sürme Kanat", "Beyaz", "adet"],
  ["Easy Slde Sürme Fx Kasa", "Beyaz", "adet"],
  ["Momentum Kasa", "A. Meşe", "adet"],
  ["Momentum Pervazlı Kasa", "A. Meşe", "adet"],
  ["Momentum Pencere Kanat", "A. Meşe", "adet"],
  ["Momentum O. Kayıt", "A. Meşe", "adet"],
  ["Momentum Kapı Kanadı", "A. Meşe", "adet"],
  ["Easy Slde Sürme Kasa", "A. Meşe", "adet"],
  ["Easy Slde Sürme Per. Kasa", "A. Meşe", "adet"],
  ["Easy Slde Sürme Sn. Per. Kasa", "A. Meşe", "adet"],
  ["Easy Slde Sürme Kanat", "A. Meşe", "adet"],
  ["Easy Slde Sürme Fx Kasa", "A. Meşe", "adet"],
  ["Çift Açılım (1 Takım)", "A. Meşe", "adet"],
  ["L Kasa (İmpoct)", "Beyaz", "adet"],
  ["Pervazlı Kasa (İmpoct)", "Beyaz", "adet"],
  ["İmpoct Pencere Kanat", "Beyaz", "adet"],
  ["İmpoct Orta Kayıt", "Beyaz", "adet"],
  ["İmpoct Kapı Kanadı", "Beyaz", "adet"],
  ["Vertgo Sürme Per. Kasa", "Beyaz", "adet"],
  ["Vertgo Sürme Kanat", "Beyaz", "adet"],
  ["Vertgo Sürme Fx Kasa", "Beyaz", "adet"],
  ["İmpoct L Kasa", "A. Meşe", "adet"],
  ["İmpoct Per. Kasa", "A. Meşe", "adet"],
  ["İmpoct Per. Kanat", "A. Meşe", "adet"],
  ["Bold O. Kayıt", "A. Meşe", "adet"],
  ["Bold K. Kanadı", "A. Meşe", "adet"],
  ["Vertgo Sürme Per. Kasa", "A. Gri", "adet"],
  ["Vertgo Sürme Sn. Per. Kasa", "A. Meşe", "adet"],
  ["Vertgo Sürme Kanat", "A. Meşe", "adet"],
  ["Vertgo Sürme Fx Kasa", "A. Meşe", "adet"],
  ["Europen L Kasa (4lü)", "Beyaz", "adet"],
  ["Europen Eco Ventana Per. Kasa", "Beyaz", "adet"],
  ["Europen Eco Ventana Per. Kanat", "Beyaz", "adet"],
  ["Europen Eco O. Kayıt (6lı)", "Beyaz", "adet"],
  ["Europen Eco Ventana Kapı Kanadı", "Beyaz", "adet"],
  ["Europen Sürme Kasa (4lü)", "Beyaz", "adet"],
  ["Europen Sürme Per. Kasa (4lü)", "Beyaz", "adet"],
  ["Europen Sürme Sn. Per. Kasa", "Beyaz", "adet"],
  ["Europen Sürme Kanat", "Beyaz", "adet"],
  ["Europen Sürme Fx Kasa (6lı)", "Beyaz", "adet"],
  ["Europen L Kasa (6lı)", "A. Meşe", "adet"],
  ["Europen Eco Ventana Per. Kasa", "A. Meşe", "adet"],
  ["Europen Eco Ventana Per. Kanat", "A. Meşe", "adet"],
  ["Europen Eco O. Kayıt (6lı)", "A. Meşe", "adet"],
  ["Europen Eco Kapı Kanadı (4lü)", "A. Meşe", "adet"],
  ["Europen Sürme Kasa (4lü)", "A. Gri", "adet"],
  ["Europen Sürme Per. Kasa (4lü)", "A. Meşe", "adet"],
  ["Europen Sürme Sn. Per. Kasa", "A. Meşe", "adet"],
  ["Europen Sürme Kanat", "A. Meşe", "adet"],
  ["Europen Sürme Fx Kasa (6lı)", "A. Gri", "adet"],
  ["Destek Sacı", "", "bağ"],
  ["Eco Ventana O. Kayıt", "Beyaz", "mt"],
  ["Lambr", "Beyaz", "adet"],
  ["Sürme Kasa Sacı", "", "bağ"],
  ["Sürme Kanat Sacı", "", "bağ"],
  ["Lambr", "A. Gri", "adet"],
  ["Sürme Tek Cam Çıtası", "Beyaz", "adet"],
  ["Almnyum Ray", "", "mt"],
  ["Sürme Sn. Per. Kasa", "A. Meşe", "adet"],
  ["Sürme Kanat", "A. Meşe", "adet"],
  ["Sürme Kanat Adaptörü", "A. Meşe", "adet"],
  ["Sürme Tek Cam Çıtası", "A. Meşe", "adet"],
  ["Sürme Çift Cam Çıtası", "A. Meşe", "adet"],
  ["Almnyum Ray", "Eloksal", "adet"],
  ["Ventana Tek Cam Çıtası", "Beyaz", "adet"],
  ["Sürme O. Kayıt", "Beyaz", "adet"],
  ["Sürme O. Kayıt", "A. Gri", "adet"],
  ["Vertgo Sürme Alın Brleştrme Ad", "Beyaz", "adet"],
  ["Vertgo Sürme Alın Brleştrme Ad", "A. Gri", "adet"],
  ["Eco Ventana Kasa (Pervazsız)", "A. Gri", "adet"],
  ["Sürme Pervazlı Kasa (Sneklksz)", "A. Gri", "adet"],
  ["Lambr Renkli", "A. Gri", "adet"],
  ["Lambr Renkli", "A. Meşe", "adet"],
];
const seedStockRows = seedStockTuples.map(([item, color, unit], index) => ({ id: `stock-seed-${index}`, companyId: "default", item, color, unit, stock: 10, state: "Takipte" }));
const seedRecords = {
  sales: [],
  expenses: [],
  production: [],
  stock: seedStockRows,
  workers: [],
  debts: [],
  matExpenses: [],
};

const emptyRecords = { sales: [], expenses: [], production: [], stock: [], workers: [], debts: [], matExpenses: [] };
const defaultPaymentMethods = ["Nakit", "Havale / EFT", "Kredi Kartı", "Banka"];
const defaultColors = ["Beyaz", "A. Meşe", "A. Gri"];
const emptyMaterials = { default: [] };
const emptyStockAutomation = {};
const persistedStateKeys = ["companies", "records", "paymentMethods", "colors", "materials", "stockAutomation"];
const samePersistedValue = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const normalizeMaterialName = (value) => String(value || "").trim().replace(/\s+/g, " ").toLocaleLowerCase("tr-TR");
const stockStateFor = (stock, currentState) => toNumber(stock) <= 0 ? "Düşük" : currentState === "Düşük" ? "İyi" : currentState || "Takipte";
const loadStored = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const navGroups = [
  { label: "ANA MENÜ", items: [{ id: "overview", label: "Genel bakış", icon: "grid" }, { id: "daily", label: "Günlük kontrol", icon: "calendar" }, { id: "dailyRecords", label: "Günlük kayıtlar", icon: "calendar" }, { id: "history", label: "Geçmiş dönemler", icon: "receipt" }] },
  { label: "İŞLETME MODÜLLERİ", items: [{ id: "sales", label: "Gelir / satış", icon: "arrowUp" }, { id: "expenses", label: "Giderler", icon: "arrowDown" }, { id: "matExpenses", label: "Malzeme giderleri", icon: "wallet" }, { id: "production", label: "Üretim", icon: "factory" }, { id: "stock", label: "Malzeme stoku", icon: "box" }, { id: "workers", label: "İşçiler", icon: "users" }, { id: "debts", label: "Borçlar", icon: "receipt" }] },
];

const viewCopy = {
  sales: { title: "Gelir ve satışlar", kicker: "SATIŞ KAYITLARI", description: "Fatura, müşteri ve ödeme hareketlerini işletme bazında yönetin.", icon: "arrowUp", primary: "Satış ekle", kind: "sales" },
  expenses: { title: "Gider kayıtları", kicker: "GİDER KONTROLÜ", description: "Günlük işletme harcamalarını kategori ve ödeme kanalına göre izleyin.", icon: "arrowDown", primary: "Gider ekle", kind: "expenses" },
  matExpenses: { title: "Malzeme giderleri", kicker: "MALZEME ALIMLARI", description: "Ürün cinsi, renk, paket, boy ve tutar bilgileriyle malzeme girişlerini yönetin.", icon: "wallet", primary: "Malzeme gideri ekle", kind: "matExpenses" },
  production: { title: "Üretim takibi", kicker: "GÜN SONU ÜRETİMİ", description: "Palet, adet, fire ve hammadde kullanımını günlük olarak takip edin.", icon: "factory", primary: "Üretim kaydı", kind: "production" },
  stock: { title: "Malzeme stoku", kicker: "STOK DURUMU", description: "Ürün ve hammadde bakiyelerini hareketleriyle birlikte yönetin.", icon: "box", primary: "Stok hareketi", kind: "stock" },
  workers: { title: "İşçi ve maaşlar", kicker: "PERSONEL KONTROLÜ", description: "Maaş, avans, devamsızlık ve bakiye durumunu çalışan bazında izleyin.", icon: "users", primary: "Çalışan ekle", kind: "workers" },
  debts: { title: "Borçlar", kicker: "ALINAN VE VERİLEN BORÇLAR", description: "Alınan ve verilen borçları ödeme ve tahsilat hareketleriyle birlikte takip edin.", icon: "receipt", primary: "Borç ekle", kind: "debts" },
  history: { title: "Geçmiş dönemler", kicker: "AY SONU RAPORLARI", description: "Sadece tamamlanmış ayların gelir, gider ve operasyon sonuçlarını karşılaştırın.", icon: "receipt", primary: "", kind: "history" },
  dailyRecords: { title: "Günlük kayıtlar", kicker: "AYLIK GÜN RAPORLARI", description: "Seçili ayın her gününü ve o güne ait otomatik kayıt özetini görüntüleyin.", icon: "calendar", primary: "", kind: "dailyRecords" },
};

function Badge({ children, tone = "neutral" }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function PaymentCell({ row }) {
  const split = isSplitPayment(row.payment) && (hasValue(row.cashAmount) || hasValue(row.mpesaAmount));
  return <div className="payment-cell"><Badge tone={row.payment?.includes("M-Pesa") ? "teal" : "neutral"}>{row.payment}</Badge>{split && <small className="payment-breakdown">Nakit {amount(row.cashAmount)} · Havale / EFT {amount(row.mpesaAmount)}</small>}</div>;
}

function MetricCard({ label, value, detail, icon, tone, trend }) {
  const isZero = trend === "0%";
  return <div className="metric-card">
    <div className="metric-top"><span className={`metric-icon ${tone}`}><Icon name={icon} size={18}/></span><span className={`trend ${isZero ? "neutral" : trend?.startsWith("-") ? "down" : "up"}`}>{!isZero && <Icon name={trend?.startsWith("-") ? "arrowDown" : "arrowUp"} size={12}/>} {trend}</span></div>
    <div className="metric-label">{label}</div><div className="metric-value">{value}</div><div className="metric-detail">{detail}</div>
  </div>;
}

function Modal({ title, onClose, children, wide = false }) {
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <div className={`modal ${wide ? "modal-wide" : ""}`}><div className="modal-head"><div><div className="eyebrow">KAYIT YÖNETİMİ</div><h3>{title}</h3></div><button className="icon-button" onClick={onClose} aria-label="Kapat"><Icon name="close" size={19}/></button></div>{children}</div>
  </div>;
}

function ConfirmModal({ title = "Silme işlemini onayla", message, onClose, onConfirm, confirmLabel = "Sil" }) {
  return <Modal title={title} onClose={onClose}>
    <div className="confirm-modal-body">
      <div className="confirm-icon"><Icon name="trash" size={20}/></div>
      <p>{message}</p>
      <div className="modal-actions">
        <button type="button" className="button secondary" onClick={onClose}>Vazgeç</button>
        <button type="button" className="button danger-confirm" onClick={onConfirm}><Icon name="trash" size={16}/> {confirmLabel}</button>
      </div>
    </div>
  </Modal>;
}

function App({ onSignOut }) {
  const [companies, setCompanies] = useState(() => loadStored("accounting-companies-v2", loadStored("accounting-companies-empty-v1", seedCompanies)));
  const selectedCompanyId = "default";
  const [activeView, setActiveView] = useState("overview");
  const [records, setRecords] = useState(() => normalizeStoredRecords(loadStored("accounting-records-v2", emptyRecords)));
  const [paymentMethods, setPaymentMethods] = useState(() => loadStored("accounting-payment-methods-v2", defaultPaymentMethods));
  const [colors, setColors] = useState(() => loadStored("accounting-colors-v1", defaultColors));
  const [materials, setMaterials] = useState(() => loadStored("accounting-materials-v2", emptyMaterials));
  const [stockAutomation, setStockAutomation] = useState(() => loadStored("accounting-stock-automation-v2", emptyStockAutomation));
  const [selectedDate, setSelectedDate] = useState(today);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");
  const [query, setQuery] = useState("");
  const [dataReady, setDataReady] = useState(!supabaseConfigured);
  const [syncState, setSyncState] = useState(supabaseConfigured ? "Veritabanı bağlanıyor..." : "Yerel mod");
  const fileInputRef = useRef(null);
  const lastSyncedPayloadRef = useRef(null);
  const selectedCompany = companies[0] || seedCompanies[0];
  const selectedRecords = useMemo(() => Object.fromEntries(Object.entries(records).map(([key, rows]) => [key, key === "debts" ? rows.filter((row) => row.companyId === selectedCompanyId).map(normalizeDebtRow) : rows.filter((row) => row.companyId === selectedCompanyId)])), [records, selectedCompanyId]);
  const stockAutomationEnabled = Boolean(stockAutomation[selectedCompanyId]);
  const remotePayload = useMemo(() => ({ version: 3, companies, records, paymentMethods, colors, materials, stockAutomation }), [companies, records, paymentMethods, colors, materials, stockAutomation]);
  const salesTotal = selectedRecords.sales.reduce((sum, row) => sum + toNumber(row.total), 0);
  const expenseTotal = selectedRecords.expenses.reduce((sum, row) => sum + toNumber(row.amount), 0);
  const debtTotal = selectedRecords.debts.reduce((sum, row) => sum + (debtDirection(row) === "lent" ? 0 : debtAmounts(row).remaining), 0);

  useEffect(() => { localStorage.setItem("accounting-companies-v2", JSON.stringify(companies)); }, [companies]);
  useEffect(() => { localStorage.setItem("accounting-records-v2", JSON.stringify(records)); }, [records]);
  useEffect(() => { localStorage.setItem("accounting-payment-methods-v2", JSON.stringify(paymentMethods)); }, [paymentMethods]);
  useEffect(() => { localStorage.setItem("accounting-colors-v1", JSON.stringify(colors)); }, [colors]);
  useEffect(() => { localStorage.setItem("accounting-materials-v2", JSON.stringify(materials)); }, [materials]);
  useEffect(() => { localStorage.setItem("accounting-stock-automation-v2", JSON.stringify(stockAutomation)); }, [stockAutomation]);
  useEffect(() => { if (toast) { const timer = window.setTimeout(() => setToast(""), 2800); return () => window.clearTimeout(timer); } }, [toast]);
  useEffect(() => {
    if (!supabase) { setDataReady(true); return undefined; }
    let mounted = true;
    const loadRemoteState = async () => {
      const { data, error } = await supabase.from("accounting_state").select("payload").eq("id", "main").maybeSingle();
      if (!mounted) return;
      if (error) {
        setSyncState("Yerel yedek kullanılıyor");
        setDataReady(true);
        return;
      }
      const payload = data?.payload;
      const remoteCompanies = [{ ...seedCompanies[0] }];
      const remoteRecords = normalizeStoredRecords({ ...emptyRecords, ...(payload?.records || {}) });
      const remotePaymentMethods = Array.isArray(payload?.paymentMethods) && payload.paymentMethods.length ? payload.paymentMethods : defaultPaymentMethods;
      const remoteColors = Array.isArray(payload?.colors) && payload.colors.length ? payload.colors : defaultColors;
      const remoteMaterials = payload?.materials || emptyMaterials;
      const remoteStockAutomation = payload?.stockAutomation || emptyStockAutomation;
      setCompanies(remoteCompanies);
      setRecords(remoteRecords);
      setPaymentMethods(remotePaymentMethods);
      setColors(remoteColors);
      setMaterials(remoteMaterials);
      setStockAutomation(remoteStockAutomation);
      lastSyncedPayloadRef.current = { version: 3, companies: remoteCompanies, records: remoteRecords, paymentMethods: remotePaymentMethods, colors: remoteColors, materials: remoteMaterials, stockAutomation: remoteStockAutomation };
      setSyncState("Veritabanı bağlı");
      setDataReady(true);
    };
    loadRemoteState();
    return () => { mounted = false; };
  }, []);
  useEffect(() => {
    if (!supabase || !dataReady || !lastSyncedPayloadRef.current) return undefined;
    const baseline = lastSyncedPayloadRef.current;
    const changedKeys = persistedStateKeys.filter((key) => !samePersistedValue(remotePayload[key], baseline[key]));
    if (!changedKeys.length) return undefined;
    const pendingPayload = remotePayload;
    const timer = window.setTimeout(async () => {
      setSyncState("Veritabanına kaydediliyor...");
      const { data: latestRow, error: readError } = await supabase.from("accounting_state").select("payload").eq("id", "main").maybeSingle();
      if (readError) {
        setSyncState("Yerel yedek kullanılıyor");
        return;
      }
      const latestPayload = latestRow?.payload || {};
      const mergedPayload = {
        version: 3,
        companies: [{ ...seedCompanies[0] }],
        records: { ...emptyRecords, ...(latestPayload.records || {}) },
        paymentMethods: Array.isArray(latestPayload.paymentMethods) && latestPayload.paymentMethods.length ? latestPayload.paymentMethods : defaultPaymentMethods,
        colors: Array.isArray(latestPayload.colors) && latestPayload.colors.length ? latestPayload.colors : defaultColors,
        materials: latestPayload.materials || emptyMaterials,
        reconciliation: latestPayload.reconciliation || {},
        stockAutomation: latestPayload.stockAutomation || emptyStockAutomation,
      };
      changedKeys.forEach((key) => { mergedPayload[key] = pendingPayload[key]; });
      const { error } = await supabase.from("accounting_state").upsert({ id: "main", payload: mergedPayload, updated_at: new Date().toISOString() }, { onConflict: "id" });
      if (error) {
        setSyncState("Yerel yedek kullanılıyor");
        return;
      }
      lastSyncedPayloadRef.current = mergedPayload;
      setSyncState("Veritabanı bağlı");
    }, 350);
    return () => window.clearTimeout(timer);
  }, [dataReady, remotePayload]);

  if (!dataReady) return <div className="app-loading"><div className="brand-mark"><span></span><span></span><span></span></div><strong>Veritabanı bağlantısı kuruluyor</strong><span>Muhasebe verileri hazırlanıyor...</span></div>;

  const navigate = (view) => { setActiveView(view); setMobileMenuOpen(false); setQuery(""); };
  const flash = (message) => setToast(message);
  const addMaterial = (name, unit = "adet") => {
    const cleanName = String(name || "").trim();
    if (!cleanName) return null;
    const existing = (materials[selectedCompanyId] || []).find((material) => material.name.toLocaleLowerCase("tr-TR") === cleanName.toLocaleLowerCase("tr-TR"));
    if (existing) return existing;
    const item = { id: `material-${Date.now()}`, name: cleanName, unit: unit || "adet" };
    setMaterials((current) => ({ ...current, [selectedCompanyId]: [...(current[selectedCompanyId] || []), item] }));
    flash("Malzeme işletmenin listesine eklendi.");
    return item;
  };
  const removeMaterial = (materialId) => {
    const material = (materials[selectedCompanyId] || []).find((item) => item.id === materialId);
    if (material) setModal({ type: "confirm-material-delete", material });
  };
  const confirmRemoveMaterial = () => {
    const materialId = modal?.material?.id;
    if (!materialId) return;
    setMaterials((current) => ({ ...current, [selectedCompanyId]: (current[selectedCompanyId] || []).filter((material) => material.id !== materialId) }));
    setModal(null); flash("Malzeme silindi.");
  };
  const addPaymentMethod = (method) => {
    const cleanMethod = String(method || "").trim();
    if (!cleanMethod) return;
    if (paymentMethods.some((item) => item.toLocaleLowerCase("tr-TR") === cleanMethod.toLocaleLowerCase("tr-TR"))) { flash("Bu ödeme yöntemi zaten kayıtlı."); return; }
    setPaymentMethods((current) => [...current, cleanMethod]);
    flash("Yeni ödeme yöntemi eklendi.");
  };
  const removePaymentMethod = (method) => {
    if (paymentMethods.length === 1) { flash("En az bir ödeme yöntemi kalmalı."); return; }
    setModal({ type: "confirm-payment-delete", method });
  };
  const confirmRemovePaymentMethod = () => {
    const method = modal?.method;
    if (!method) return;
    setPaymentMethods((current) => current.filter((item) => item !== method));
    setModal(null); flash("Ödeme yöntemi silindi.");
  };
  const addColor = (color) => {
    const cleanColor = String(color || "").trim();
    if (!cleanColor) return;
    if (colors.some((item) => item.toLocaleLowerCase("tr-TR") === cleanColor.toLocaleLowerCase("tr-TR"))) { flash("Bu renk zaten kayıtlı."); return; }
    setColors((current) => [...current, cleanColor]);
    flash("Yeni renk eklendi.");
  };
  const removeColor = (color) => {
    if (colors.length === 1) { flash("En az bir renk kalmalı."); return; }
    setModal({ type: "confirm-color-delete", color });
  };
  const confirmRemoveColor = () => {
    const color = modal?.color;
    if (!color) return;
    setColors((current) => current.filter((item) => item !== color));
    setModal(null); flash("Renk silindi.");
  };
  const downloadFile = (content, fileName, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = fileName; link.style.display = "none";
    document.body.appendChild(link); link.click();
    window.setTimeout(() => { link.remove(); URL.revokeObjectURL(url); }, 1000);
  };
  const reportModuleKeys = ["sales", "expenses", "matExpenses", "production", "stock", "workers", "debts"];
  const isModuleReport = reportModuleKeys.includes(activeView);
  const reportTitle = isModuleReport ? viewCopy[activeView].title : "Muhasebe raporu";
  const reportSlug = isModuleReport ? activeView : "genel";
  const buildReportSections = () => {
    const all = [
      { key: "sales", title: "Gelir / Satış", widths: [14, 26, 26, 12, 18, 16, 14], rows: selectedRecords.sales,
        columns: [{ h: "Tarih", v: (r) => r.date }, { h: "Müşteri", v: (r) => r.customer }, { h: "Malzeme", v: (r) => r.product }, { h: "Adet", v: (r) => toNumber(r.qty), num: true }, { h: "Tutar", v: (r) => toNumber(r.total), money: true }, { h: "Ödeme", v: (r) => r.payment }, { h: "Fatura", v: (r) => r.invoice }] },
      { key: "expenses", title: "Giderler", widths: [14, 24, 46, 18, 16], rows: selectedRecords.expenses,
        columns: [{ h: "Tarih", v: (r) => r.date }, { h: "Kategori", v: (r) => r.category }, { h: "Açıklama", v: (r) => `${r.detail || ""}${r.worker ? ` (${r.worker})` : ""}${r.note ? ` - ${r.note}` : ""}` }, { h: "Tutar", v: (r) => toNumber(r.amount), money: true }, { h: "Ödeme", v: (r) => r.payment }] },
      { key: "matExpenses", title: "Malzeme giderleri", widths: [14, 30, 16, 16, 14, 18], rows: selectedRecords.matExpenses,
        columns: [{ h: "Tarih", v: (r) => r.date }, { h: "Ürün cinsi", v: (r) => r.product }, { h: "Renk", v: (r) => r.color }, { h: "Paket", v: (r) => r.package }, { h: "Boy", v: (r) => r.length }, { h: "Tutar", v: (r) => toNumber(r.total), money: true }] },
      { key: "production", title: "Üretim", widths: [14, 30, 14, 14, 18], rows: selectedRecords.production,
        columns: [{ h: "Tarih", v: (r) => r.date }, { h: "Ürün", v: (r) => r.product }, { h: "Adet", v: (r) => toNumber(r.qty), num: true }, { h: "Fire", v: (r) => toNumber(r.broken), num: true }, { h: "Hammadde", v: (r) => toNumber(r.cement), num: true }] },
      { key: "stock", title: "Malzeme stoku", widths: [36, 16, 14, 12], rows: selectedRecords.stock,
        columns: [{ h: "Malzeme", v: (r) => r.item }, { h: "Renk", v: (r) => r.color }, { h: "Stok", v: (r) => toNumber(r.stock), num: true }, { h: "Birim", v: (r) => r.unit }] },
      { key: "workers", title: "İşçiler", widths: [30, 20, 20, 20], rows: selectedRecords.workers,
        columns: [{ h: "Çalışan", v: (r) => r.name }, { h: "Maaş", v: (r) => toNumber(r.salary), money: true }, { h: "Avans", v: (r) => toNumber(r.advance), money: true }, { h: "Bakiye", v: (r) => toNumber(r.balance), money: true }] },
      { key: "debts", title: "Borçlar", widths: [26, 14, 18, 18, 18], rows: selectedRecords.debts,
        columns: [{ h: "Kişi", v: (r) => r.creditor }, { h: "Tür", v: (r) => debtDirectionLabel(r) }, { h: "Toplam", v: (r) => debtAmounts(r).total, money: true }, { h: "Ödenen / Tahsil", v: (r) => debtAmounts(r).paid, money: true }, { h: "Kalan", v: (r) => debtAmounts(r).remaining, money: true }] },
    ];
    return isModuleReport ? all.filter((section) => section.key === activeView) : all;
  };
  const displayCell = (column, row) => {
    const value = column.v(row);
    if (column.money) return amount(value);
    if (column.num) return money(value);
    return pdfText(value);
  };
  const exportPdf = async () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    await loadAyesFonts(doc);
    const sections = buildReportSections();
    const logo = await loadLogoDataUrl();
    if (logo) doc.addImage(logo, "PNG", 14, 10, 26, 26);
    doc.setFont("Ayes", "bold"); doc.setFontSize(16);
    doc.text(pdfText(selectedCompany?.name || "AYES GROUP"), 44, 20);
    doc.setFont("Ayes", "normal"); doc.setFontSize(10);
    doc.text(pdfText(`${reportTitle} · ${today}`), 44, 27);
    doc.text(pdfText(isModuleReport ? `Kayıt sayısı: ${sections[0]?.rows.length || 0}` : `Toplam gelir: ${amount(salesTotal)} · Toplam gider: ${amount(expenseTotal)} · Açık borç: ${amount(debtTotal)}`), 44, 33);
    let y = 41;
    const section = (title, head, body) => {
      if (!body.length) return;
      if (y > 170) { doc.addPage(); y = 15; }
      doc.setFont("Ayes", "bold"); doc.setFontSize(11);
      doc.text(pdfText(title), 14, y);
      autoTable(doc, { startY: y + 3, head: [head.map(pdfText)], body: body.map((row) => row.map((value) => pdfText(value))), styles: { font: "Ayes", fontSize: 8 }, headStyles: { fillColor: [19, 38, 48] } });
      y = doc.lastAutoTable.finalY + 10;
    };
    sections.forEach((item) => section(item.title, item.columns.map((column) => column.h), item.rows.map((row) => item.columns.map((column) => displayCell(column, row)))));
    const pages = doc.getNumberOfPages();
    for (let page = 1; page <= pages; page += 1) {
      doc.setPage(page);
      doc.setFont("Ayes", "normal"); doc.setFontSize(8);
      doc.text(pdfText(`${selectedCompany?.name || "AYES GROUP"} · ${reportTitle} · Sayfa ${page} / ${pages}`), 14, 200);
    }
    doc.save(`ayes-muhasebe-${reportSlug}-${today}.pdf`);
    flash("PDF rapor indirildi.");
  };
  const exportDebtReceipt = async (debtRow) => {
    try {
      const debt = normalizeDebtRow(debtRow || {});
      if (!debt.id) { flash("Borç kaydı bulunamadı."); return; }
      const lent = debtDirection(debt) === "lent";
      const { total, paid, remaining } = debtAmounts(debt);
      const receiptTitle = lent ? "Tahsilat Fişi" : "Ödeme Fişi";
      const movementTitle = lent ? "Tahsilat Hareketleri" : "Ödeme Hareketleri";
      const paidLabel = lent ? "Tahsil Edilen" : "Ödenen";
      const txns = [...debt.transactions].sort((left, right) => String(left.date).localeCompare(String(right.date)));
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      await loadAyesFonts(doc);
      const logo = await loadLogoDataUrl();
      if (logo) doc.addImage(logo, "PNG", 14, 10, 26, 26);
      doc.setFont("Ayes", "bold"); doc.setFontSize(16);
      doc.text(pdfText(selectedCompany?.name || "AYES GROUP"), 44, 20);
      doc.setFont("Ayes", "normal"); doc.setFontSize(10);
      doc.text(pdfText(`${receiptTitle} · ${fullDateLabel(today)}`), 44, 27);
      doc.text(pdfText(`${debt.creditor || ""} · ${lent ? "Verilen borç" : "Alınan borç"}`), 44, 33);
      let y = 44;
      doc.setFont("Ayes", "bold"); doc.setFontSize(11);
      doc.text(pdfText("Borç Bilgileri"), 14, y);
      autoTable(doc, {
        startY: y + 3,
        body: [
          [lent ? "Borçlu" : "Alacaklı", debt.creditor || "—"],
          ["Borç Türü", lent ? "Verilen borç (tahsil edilecek)" : "Alınan borç (ödenecek)"],
          ["Kaynak / Açıklama", debt.source || "—"],
          ["Borç Tarihi", debt.date ? fullDateLabel(debt.date) : "—"],
          ["Vade", debt.due || "Açık"],
          ["Durum", debtStatusLabel(debt)],
        ].map((row) => row.map(pdfText)),
        theme: "plain",
        styles: { font: "Ayes", fontSize: 9, cellPadding: 1.5 },
        columnStyles: { 0: { fontStyle: "bold", cellWidth: 42, textColor: [90, 110, 112] }, 1: { cellWidth: "auto" } },
      });
      y = doc.lastAutoTable.finalY + 8;
      autoTable(doc, {
        startY: y,
        head: [[pdfText("Toplam Tutar"), pdfText(paidLabel), pdfText("Kalan")]],
        body: [[amount(total), amount(paid), amount(remaining)].map(pdfText)],
        styles: { font: "Ayes", fontSize: 10, halign: "center" },
        headStyles: { fillColor: [19, 38, 48] },
      });
      y = doc.lastAutoTable.finalY + 8;
      if (y > 250) { doc.addPage(); y = 15; }
      doc.setFont("Ayes", "bold"); doc.setFontSize(11);
      doc.text(pdfText(movementTitle), 14, y);
      if (!txns.length) {
        doc.setFont("Ayes", "normal"); doc.setFontSize(9); doc.setTextColor(130, 140, 142);
        doc.text(pdfText(lent ? "Henüz tahsilat işlenmedi." : "Henüz ödeme işlenmedi."), 14, y + 7);
        doc.setTextColor(0, 0, 0);
        y += 12;
      } else {
        let running = total;
        const body = txns.map((txn, index) => {
          running = Math.max(0, running - Math.max(0, toNumber(txn.amount)));
          return [String(index + 1), fullDateLabel(txn.date), txn.note || "—", amount(txn.amount), amount(running)];
        });
        autoTable(doc, {
          startY: y + 3,
          head: [["#", "Tarih", "Açıklama", paidLabel, "Kalan"].map(pdfText)],
          body: body.map((row) => row.map(pdfText)),
          styles: { font: "Ayes", fontSize: 9 },
          headStyles: { fillColor: [19, 38, 48] },
          columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 32 }, 3: { halign: "right", cellWidth: 34 }, 4: { halign: "right", cellWidth: 34 } },
        });
        y = doc.lastAutoTable.finalY + 7;
        if (y > 255) { doc.addPage(); y = 15; }
        doc.setFont("Ayes", "bold"); doc.setFontSize(10);
        doc.text(pdfText(`Toplam: ${amount(total)} · ${paidLabel}: ${amount(paid)} · Kalan: ${amount(remaining)}`), 196, y, { align: "right" });
        y += 6;
      }
      if (y > 245) { doc.addPage(); y = 20; } else { y += 16; }
      doc.setFont("Ayes", "bold"); doc.setFontSize(10);
      doc.text(pdfText("Teslim Eden"), 14, y);
      doc.text(pdfText("Teslim Alan"), 110, y);
      doc.setDrawColor(180, 190, 192);
      doc.line(14, y + 18, 84, y + 18);
      doc.line(110, y + 18, 180, y + 18);
      doc.setFont("Ayes", "normal"); doc.setFontSize(8); doc.setTextColor(130, 140, 142);
      doc.text(pdfText("Ad Soyad / İmza"), 14, y + 24);
      doc.text(pdfText("Ad Soyad / İmza"), 110, y + 24);
      doc.setTextColor(0, 0, 0);
      const pages = doc.getNumberOfPages();
      for (let page = 1; page <= pages; page += 1) {
        doc.setPage(page);
        doc.setFont("Ayes", "normal"); doc.setFontSize(8);
        doc.text(pdfText(`${selectedCompany?.name || "AYES GROUP"} · ${receiptTitle} · ${debt.creditor || ""} · Sayfa ${page} / ${pages}`), 14, 287);
      }
      const slug = String(debt.creditor || "borc").toLocaleLowerCase("tr-TR").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "borc";
      doc.save(`ayes-${lent ? "tahsilat" : "odeme"}-fisi-${slug}-${today}.pdf`);
      flash("Borç fişi indirildi.");
    } catch (error) {
      flash(`Fiş oluşturulamadı: ${error?.message || error}`);
    }
  };
  const exportData = async (format = "json") => {
    try {
    if (format === "pdf") { await exportPdf(); return; }
    const backup = { version: 3, exportedAt: new Date().toISOString(), companies, records, paymentMethods, colors, materials, stockAutomation };
    downloadFile(JSON.stringify(backup, null, 2), `muhasebe-yedek-${today}.json`, "application/json");
    flash("Tam yedek dışa aktarıldı.");
    } catch (error) {
      flash(`Rapor oluşturulamadı: ${error?.message || error}`);
    }
  };
  const handleImportFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const imported = JSON.parse(await file.text());
      if (!Array.isArray(imported.companies) || !imported.records) throw new Error("Geçersiz yedek");
      const first = imported.companies[0];
      setCompanies([{ id: "default", name: first?.name || "AYES GROUP", location: first?.location || "", status: "Taslak", completion: 0, color: "teal" }]);
      const remapRows = (rows) => (Array.isArray(rows) ? rows : []).map((row) => ({ ...row, companyId: "default" }));
      setRecords(normalizeStoredRecords(Object.fromEntries(Object.entries({ ...emptyRecords, ...imported.records }).map(([key, rows]) => [key, remapRows(rows)]))));
      setPaymentMethods(Array.isArray(imported.paymentMethods) && imported.paymentMethods.length ? imported.paymentMethods : defaultPaymentMethods);
      setColors(Array.isArray(imported.colors) && imported.colors.length ? imported.colors : defaultColors);
      const importedMaterials = Array.isArray(imported.materials) ? imported.materials : Object.values(imported.materials || {}).flat();
      setMaterials(importedMaterials.length ? { default: importedMaterials } : emptyMaterials);
      setStockAutomation({ default: Object.values(imported.stockAutomation || {}).some(Boolean) });
      setModal(null); flash("Yedek içe aktarıldı.");
    } catch {
      flash("Dosya okunamadı. Geçerli bir JSON yedeği seçin.");
    } finally {
      event.target.value = "";
    }
  };
  const setStockAutomationEnabled = (enabled) => {
    const nextEnabled = Boolean(enabled);
    setStockAutomation((current) => ({ ...current, [selectedCompanyId]: nextEnabled }));
    flash(nextEnabled ? "Satış stok otomasyonu açıldı." : "Satış stok otomasyonu kapatıldı.");
  };
  const findStockRow = (stockRows, { rowId, materialId, materialName }) => {
    if (rowId) return stockRows.find((row) => row.companyId === selectedCompanyId && row.id === rowId) || null;
    const normalizedName = normalizeMaterialName(materialName);
    return stockRows.find((row) => row.companyId === selectedCompanyId && ((materialId && row.materialId === materialId) || (normalizedName && normalizeMaterialName(row.item) === normalizedName))) || null;
  };
  const planSaleStock = (stockRows, previousSale, sale, applyNewStock) => {
    const deltas = new Map();
    const addDelta = (row, delta) => deltas.set(row.id, (deltas.get(row.id) || 0) + delta);
    if (previousSale?.stockDeducted && toNumber(previousSale.stockQty ?? previousSale.qty) > 0) {
      const previousStockRow = findStockRow(stockRows, { rowId: previousSale.stockRowId, materialId: previousSale.stockMaterialId, materialName: previousSale.stockMaterialName || previousSale.product });
      if (!previousStockRow) return { error: "Bu satışın bağlı stok kaydı bulunamadı; işlem tamamlanmadı." };
      addDelta(previousStockRow, toNumber(previousSale.stockQty ?? previousSale.qty));
    }
    let stockMetadata = { stockDeducted: false, stockMaterialId: null, stockMaterialName: null, stockQty: null, stockRowId: null };
    if (applyNewStock && toNumber(sale.qty) > 0) {
      const nextStockRow = findStockRow(stockRows, { materialId: sale.materialId, materialName: sale.materialName });
      if (!nextStockRow) return { error: `${sale.materialName || "Seçilen malzeme"} için stok kaydı bulunamadı. Önce Malzeme stoku bölümünden stok ekleyin.` };
      addDelta(nextStockRow, -toNumber(sale.qty));
      stockMetadata = { stockDeducted: true, stockMaterialId: sale.materialId || null, stockMaterialName: sale.materialName, stockQty: toNumber(sale.qty), stockRowId: nextStockRow.id };
    }
    for (const [rowId, delta] of deltas) {
      const row = stockRows.find((item) => item.id === rowId);
      const nextStock = toNumber(row?.stock) + delta;
      if (nextStock < -1e-9) return { error: `${row?.item || "Seçilen malzeme"} stok miktarı yetersiz. Satış kaydı oluşturulmadı.` };
    }
    const nextStockRows = stockRows.map((row) => {
      const delta = deltas.get(row.id);
      if (!delta) return row;
      const nextStock = Math.abs(toNumber(row.stock) + delta) < 1e-12 ? 0 : toNumber(row.stock) + delta;
      return { ...row, stock: nextStock, state: stockStateFor(nextStock, row.state) };
    });
    return { nextStockRows, stockMetadata };
  };
  const saveRecord = (form) => {
    const key = form.kind;
    const id = form.id || `${key}-${Date.now()}`;
    const common = { id, companyId: selectedCompanyId, date: form.date || selectedDate };
    let item = common;
    const selectedMaterial = (materials[selectedCompanyId] || []).find((material) => material.id === form.materialId);
    const materialName = form.materialMode === "new" ? String(form.materialName || "").trim() : selectedMaterial?.name || String(form.materialName || form.description || "").trim();
    const splitPayment = isSplitPayment(form.payment);
    const previousSale = key === "sales" && form.id ? records.sales.find((row) => row.id === form.id) : null;
    const saleStockPlan = key === "sales" ? planSaleStock(records.stock, previousSale, { materialId: selectedMaterial?.id || null, materialName, qty: toNumber(form.qty) }, stockAutomationEnabled || Boolean(previousSale?.stockDeducted)) : { nextStockRows: records.stock, stockMetadata: {} };
    if (saleStockPlan.error) { flash(saleStockPlan.error); return; }
    if (form.saveMaterial && materialName) addMaterial(materialName, form.unit || "adet");
    if (key === "sales") item = { ...common, customer: form.name || "Yeni müşteri", product: materialName || "Yeni ürün", qty: toNumber(form.qty), total: toNumber(form.amount), payment: form.payment, cashAmount: splitPayment ? toNumber(form.cashAmount) : null, mpesaAmount: splitPayment ? toNumber(form.mpesaAmount) : null, invoice: form.invoice || "Taslak", status: "Taslak", ...saleStockPlan.stockMetadata };
    if (key === "expenses") item = { ...common, category: form.category || "Genel gider", detail: form.description || "Yeni gider", note: form.note || "", workerId: form.category === "Çalışan Ödemesi" ? (form.workerId || null) : null, worker: form.category === "Çalışan Ödemesi" ? (form.worker || "") : "", amount: toNumber(form.amount), payment: form.payment, cashAmount: splitPayment ? toNumber(form.cashAmount) : null, mpesaAmount: splitPayment ? toNumber(form.mpesaAmount) : null, status: "Taslak" };
    if (key === "matExpenses") item = { ...common, product: materialName || "Yeni malzeme", color: form.color || "", package: form.package || "", length: form.length || "", unitPrice: hasValue(form.unitPrice) ? toNumber(form.unitPrice) : null, total: toNumber(form.amount) };
    if (key === "production") item = { ...common, product: materialName || "Yeni üretim", pallets: toNumber(form.pallets), qty: toNumber(form.qty), broken: toNumber(form.broken), cement: toNumber(form.cement), remaining: toNumber(form.remaining) };
    if (key === "stock") item = { ...common, item: materialName || "Yeni malzeme", materialId: selectedMaterial?.id || null, color: form.color || "", stock: toNumber(form.qty), unit: form.unit || selectedMaterial?.unit || "adet", state: stockStateFor(form.qty, "Takipte") };
    if (key === "workers") item = { ...common, name: form.name || "Yeni çalışan", salary: toNumber(form.salary ?? form.amount), advance: toNumber(form.advance), absence: toNumber(form.absence), balance: toNumber(form.salary ?? form.amount) - toNumber(form.advance) };
    if (key === "debts") {
      const existingDebt = form.id ? records.debts.find((row) => row.id === form.id) : null;
      const keptTransactions = existingDebt ? normalizeDebtRow(existingDebt).transactions : [];
      item = { ...common, direction: form.direction === "lent" ? "lent" : "owed", creditor: form.name || "Yeni kayıt", source: form.description || "Genel borç", amount: Math.max(0, toNumber(form.amount)), transactions: keptTransactions, due: form.due || "Açık", status: form.status || "Yeni" };
    }
    setRecords((current) => ({ ...current, [key]: form.id ? current[key].map((row) => row.id === form.id ? item : row) : [item, ...current[key]], ...(key === "sales" ? { stock: saleStockPlan.nextStockRows } : {}) }));
    
    
    setModal(null); flash(form.id ? "Kayıt güncellendi." : "Yeni kayıt eklendi.");
  };

  const deleteRecord = (kind, row) => {
    const recordName = row.customer || row.detail || row.product || row.item || row.name || row.creditor || "Bu kayıt";
    setModal({ type: "confirm-record-delete", kind, row, recordName });
  };
  const confirmDeleteRecord = () => {
    const pending = modal;
    if (!pending?.kind || !pending?.row) return;
    const saleStockPlan = pending.kind === "sales" ? planSaleStock(records.stock, pending.row, null, false) : { nextStockRows: records.stock };
    if (saleStockPlan.error) { flash(saleStockPlan.error); return; }
    setRecords((current) => ({ ...current, [pending.kind]: current[pending.kind].filter((item) => item.id !== pending.row.id), ...(pending.kind === "sales" ? { stock: saleStockPlan.nextStockRows } : {}) }));
    setModal(null);
    flash("Kayıt silindi.");
  };

  const saveDebtTransaction = (debtId, txn) => {
    const debt = records.debts.find((row) => row.id === debtId);
    if (!debt) { flash("Borç kaydı bulunamadı."); return; }
    const entry = { id: `txn-${Date.now()}`, date: txn.date || selectedDate, amount: Math.max(0, toNumber(txn.amount)), note: String(txn.note || "").trim() };
    if (!(entry.amount > 0)) { flash("Tutar sıfırdan büyük olmalıdır."); return; }
    setRecords((current) => ({ ...current, debts: current.debts.map((row) => row.id === debtId ? { ...normalizeDebtRow(row), transactions: [...normalizeDebtRow(row).transactions, entry] } : row) }));
    setModal(null);
    flash(debtDirection(debt) === "lent" ? "Tahsilat kaydedildi." : "Ödeme kaydedildi.");
  };

  const pageTitle = activeView === "overview" ? "Genel bakış" : activeView === "daily" ? "Günlük kontrol" : viewCopy[activeView].title;
  const pageDescription = activeView === "overview" ? "İşletmenizin finansal ve operasyonel durumunu tek ekranda takip edin." : activeView === "daily" ? "Günlük işlemlerin tamamlanma durumunu ve kayıt özetini takip edin." : viewCopy[activeView].description;

  return <div className="app-shell">
    <aside className={`sidebar ${mobileMenuOpen ? "open" : ""}`}>
      <div className="brand"><div className="brand-mark"><img src="/ayes-logo.png" alt="AYES GROUP"/></div><div><strong>AYES GROUP</strong><small>muhasebe</small></div></div>
      <nav className="sidebar-nav">{navGroups.map((group) => <div className="nav-group" key={group.label}><div className="nav-label">{group.label}</div>{group.items.map((item) => <button key={item.id} className={`nav-item ${activeView === item.id ? "active" : ""}`} onClick={() => navigate(item.id)}><Icon name={item.icon} size={18}/><span>{item.label}</span>{item.id === "daily" && <span className="nav-dot"/>}</button>)}</div>)}</nav>
      <div className="sidebar-bottom"><button className="nav-item" onClick={() => setModal({ type: "settings" })}><Icon name="settings" size={18}/><span>Ayarlar</span></button></div>
    </aside>
    {mobileMenuOpen && <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)}/>} 
    <main className="main-content">
      <header className="topbar"><div className="topbar-left"><button className="mobile-menu-button" onClick={() => setMobileMenuOpen(true)}><Icon name="grid" size={18}/></button><div className="breadcrumbs"><span>İşletme</span><Icon name="chevronRight" size={14}/><strong>{selectedCompany?.name}</strong></div></div><div className="topbar-actions"><div className="sync-status"><span className="pulse"/> {syncState}</div><div className="top-date"><Icon name="calendar" size={16}/><input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)}/></div></div></header>
      <div className="page-wrap">
        <div className="page-heading"><div><div className="eyebrow">{activeView === "overview" ? "İŞLETME ÖZETİ" : activeView === "daily" ? "GÜN KAPANIŞI" : viewCopy[activeView].kicker}</div><h1>{pageTitle}</h1><p>{pageDescription}</p></div><div className="heading-actions"><button className="button secondary" onClick={() => exportData("pdf")}><Icon name="download" size={16}/> Rapor al</button>{activeView !== "history" && activeView !== "dailyRecords" && <button className="button primary" onClick={() => setModal({ type: "entry", kind: activeView === "overview" || activeView === "daily" ? "sales" : activeView })}><Icon name="plus" size={17}/> {activeView === "overview" || activeView === "daily" ? "Yeni kayıt" : viewCopy[activeView].primary}</button>}</div></div>
        {activeView === "overview" && <Dashboard selectedRecords={selectedRecords} salesTotal={salesTotal} expenseTotal={expenseTotal} debtTotal={debtTotal} selectedDate={selectedDate} onNavigate={navigate} onAdd={() => setModal({ type: "entry", kind: "sales" })} onEdit={(kind, row) => setModal({ type: "entry", kind, edit: row })} />}
        {activeView === "daily" && <DailyControl selectedDate={selectedDate} selectedRecords={selectedRecords} onNavigate={navigate} />}
        {activeView === "dailyRecords" && <DailyRecordsPage selectedRecords={selectedRecords} />}
        {activeView === "history" && <HistoricalPeriods selectedRecords={selectedRecords} />}
        {activeView !== "overview" && activeView !== "daily" && activeView !== "dailyRecords" && activeView !== "history" && <ModuleView activeView={activeView} records={selectedRecords[activeView] || []} query={query} setQuery={setQuery} onAdd={() => setModal({ type: "entry", kind: activeView })} onEdit={(row) => setModal({ type: "entry", kind: activeView, edit: row })} onDelete={(row) => deleteRecord(activeView, row)} onDetail={activeView === "workers" ? (row) => setModal({ type: "worker-detail", worker: row }) : activeView === "debts" ? (row) => setModal({ type: "debt-detail", debtId: row.id }) : undefined} onPay={activeView === "debts" ? (row) => setModal({ type: "debt-pay", debtId: row.id }) : undefined} onPrint={activeView === "debts" ? exportDebtReceipt : undefined} />}
      </div>
    </main>
    <input ref={fileInputRef} type="file" accept="application/json,.json" hidden onChange={handleImportFile}/>
    {modal?.type === "entry" && <EntryModal kind={modal.kind} edit={modal.edit} date={selectedDate} paymentMethods={paymentMethods} colors={colors} workers={selectedRecords.workers} materials={materials[selectedCompanyId] || []} onAddMaterial={addMaterial} onClose={() => setModal(null)} onSave={saveRecord}/>} 
    {modal?.type === "worker-detail" && <WorkerDetailModal worker={modal.worker} expenses={selectedRecords.expenses} onClose={() => setModal(null)}/>}
    {modal?.type === "debt-pay" && <DebtPaymentModal debt={selectedRecords.debts.find((row) => row.id === modal.debtId)} onClose={() => setModal(null)} onSave={saveDebtTransaction}/>}
    {modal?.type === "debt-detail" && <DebtDetailModal debt={selectedRecords.debts.find((row) => row.id === modal.debtId)} onClose={() => setModal(null)} onPay={(row) => setModal({ type: "debt-pay", debtId: row.id })} onPrint={exportDebtReceipt}/>} 
    {modal?.type === "settings" && <SettingsModal companyName={selectedCompany?.name || "AYES GROUP"} paymentMethods={paymentMethods} colors={colors} materials={materials[selectedCompanyId] || []} stockAutomationEnabled={stockAutomationEnabled} onToggleStockAutomation={setStockAutomationEnabled} onAddPayment={addPaymentMethod} onRemovePayment={removePaymentMethod} onAddColor={addColor} onRemoveColor={removeColor} onAddMaterial={addMaterial} onRemoveMaterial={removeMaterial} onExport={exportData} onImport={() => fileInputRef.current?.click()} onSignOut={onSignOut} onClose={() => setModal(null)}/>} 
    {modal?.type === "confirm-record-delete" && <ConfirmModal message={`${modal.recordName} kaydı silinsin mi?`} confirmLabel="Kaydı sil" onClose={() => setModal(null)} onConfirm={confirmDeleteRecord}/>} 
    {modal?.type === "confirm-payment-delete" && <ConfirmModal message={`${modal.method} ödeme yöntemi silinsin mi?`} confirmLabel="Ödeme yöntemini sil" onClose={() => setModal(null)} onConfirm={confirmRemovePaymentMethod}/>} 
    {modal?.type === "confirm-color-delete" && <ConfirmModal message={`${modal.color} rengi silinsin mi?`} confirmLabel="Rengi sil" onClose={() => setModal(null)} onConfirm={confirmRemoveColor}/>} 
    {modal?.type === "confirm-material-delete" && <ConfirmModal message={`${modal.material?.name} malzemesi silinsin mi?`} confirmLabel="Malzemeyi sil" onClose={() => setModal(null)} onConfirm={confirmRemoveMaterial}/>} 
    {toast && <div className="toast"><span className="toast-check"><Icon name="check" size={15}/></span>{toast}</div>}
  </div>;
}

function HistoricalPeriods({ selectedRecords }) {
  const [expandedMonth, setExpandedMonth] = useState(null);
  const currentMonthKey = today.slice(0, 7);
  const reports = useMemo(() => {
    const monthMap = new Map();
    const ensureReport = (month) => {
      if (!monthMap.has(month)) monthMap.set(month, { key: month, salesTotal: 0, expenseTotal: 0, salesCount: 0, expenseCount: 0, productionQty: 0, brokenQty: 0, stockCount: 0, debtCount: 0, cashIn: 0, mpesaIn: 0, cashOut: 0, mpesaOut: 0, activeDays: new Set() });
      return monthMap.get(month);
    };
    const paymentAmounts = (row, amount) => {
      if (hasValue(row.cashAmount) || hasValue(row.mpesaAmount)) return { cash: toNumber(row.cashAmount), mpesa: toNumber(row.mpesaAmount) };
      if (/m-pesa/i.test(String(row.payment || ""))) return { cash: 0, mpesa: amount };
      if (/nakit/i.test(String(row.payment || ""))) return { cash: amount, mpesa: 0 };
      return { cash: 0, mpesa: 0 };
    };
    const forEachHistoricalRecord = (rows, callback) => rows.forEach((row) => {
      const date = String(row.date || "");
      const month = date.slice(0, 7);
      if (!/^\d{4}-\d{2}$/.test(month) || month >= currentMonthKey) return;
      callback(ensureReport(month), row, date);
    });
    forEachHistoricalRecord(selectedRecords.sales, (report, row, date) => {
      const amount = toNumber(row.total);
      const payment = paymentAmounts(row, amount);
      report.salesTotal += amount; report.salesCount += 1; report.cashIn += payment.cash; report.mpesaIn += payment.mpesa; report.activeDays.add(date);
    });
    forEachHistoricalRecord(selectedRecords.expenses, (report, row, date) => {
      const amount = toNumber(row.amount);
      const payment = paymentAmounts(row, amount);
      report.expenseTotal += amount; report.expenseCount += 1; report.cashOut += payment.cash; report.mpesaOut += payment.mpesa; report.activeDays.add(date);
    });
    forEachHistoricalRecord(selectedRecords.production, (report, row, date) => { report.productionQty += toNumber(row.qty); report.brokenQty += toNumber(row.broken); report.activeDays.add(date); });
    forEachHistoricalRecord(selectedRecords.stock, (report, row, date) => { report.stockCount += 1; report.activeDays.add(date); });
    forEachHistoricalRecord(selectedRecords.debts, (report, row, date) => { report.debtCount += 1; report.activeDays.add(date); });
    return [...monthMap.values()].sort((left, right) => right.key.localeCompare(left.key)).map((report) => ({ ...report, net: report.salesTotal - report.expenseTotal, activeDayCount: report.activeDays.size }));
  }, [currentMonthKey, selectedRecords]);
  const monthLabel = (month) => new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }).format(new Date(`${month}-01T12:00:00`));
  const monthEndLabel = (month) => { const [year, monthNumber] = month.split("-").map(Number); return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(year, monthNumber, 0, 12)); };
  if (!reports.length) return <div className="history-page"><section className="panel history-empty"><span className="empty-icon"><Icon name="receipt" size={20}/></span><h2>Henüz kapanmış ay raporu yok</h2><p>Geçmiş dönemler, yalnızca mevcut aydan önceki aylarda kayıt oluştuğunda burada görünür.</p></section></div>;
  return <div className="history-page"><section className="history-intro"><div><div className="eyebrow">KAPANMIŞ DÖNEMLER</div><h2>Ay sonu rapor arşivi</h2><p>Bu sayfada yalnızca tamamlanmış ayların toplu sonuçları gösterilir. Günlük kayıtlar ilgili modüllerde kalır.</p></div><div className="history-count"><span>Raporlanan ay</span><strong>{reports.length}</strong></div></section><div className="history-list">{reports.map((report) => { const expanded = expandedMonth === report.key; return <article className={`panel history-card ${expanded ? "expanded" : ""}`} key={report.key}><button className="history-card-head" onClick={() => setExpandedMonth(expanded ? null : report.key)} aria-expanded={expanded}><div className="history-month-title"><span className="history-month-icon"><Icon name="calendar" size={18}/></span><div><div className="panel-kicker">AY SONU RAPORU</div><h3>{monthLabel(report.key)}</h3><p>{monthEndLabel(report.key)} kapanışı · {report.activeDayCount} aktif gün</p></div></div><div className="history-net"><span>Net sonuç</span><strong className={report.net < 0 ? "negative" : "positive"}>{amount(report.net)}</strong><Icon name="chevron" size={17}/></div></button><div className="history-metrics"><div><span>Toplam gelir</span><strong>{amount(report.salesTotal)}</strong><small>{report.salesCount} satış</small></div><div><span>Toplam gider</span><strong>{amount(report.expenseTotal)}</strong><small>{report.expenseCount} gider</small></div><div><span>Üretim</span><strong>{money(report.productionQty)}</strong><small>{money(report.brokenQty)} fire</small></div><div><span>Ödeme girişleri</span><strong>{amount(report.cashIn + report.mpesaIn)}</strong><small>Nakit {amount(report.cashIn)} · Diğer {amount(report.mpesaIn)}</small></div></div>{expanded && <div className="history-detail"><div><span>Ödeme çıkışları</span><strong>Nakit {amount(report.cashOut)}</strong><small>Diğer {amount(report.mpesaOut)}</small></div><div><span>Stok kayıtları</span><strong>{report.stockCount}</strong><small>Bu ay işlenen hareket</small></div><div><span>Borç kayıtları</span><strong>{report.debtCount}</strong><small>Bu ay açılan/işlenen kayıt</small></div></div>}</article>; })}</div></div>;
}

function Dashboard({ selectedRecords, salesTotal, expenseTotal, debtTotal, selectedDate, onNavigate, onAdd, onEdit }) {
  const latestSales = selectedRecords.sales.slice(0, 5);
  const owedDebtCount = selectedRecords.debts.filter((row) => debtDirection(row) !== "lent").length;
  return <>
    <div className="metric-grid"><MetricCard label="Toplam gelir" value={amount(salesTotal)} detail={`${selectedRecords.sales.length} satış kaydı`} icon="arrowUp" tone="green" trend="0%"/><MetricCard label="Toplam gider" value={amount(expenseTotal)} detail={`${selectedRecords.expenses.length} gider kaydı`} icon="arrowDown" tone="peach" trend="0%"/><MetricCard label="Açık borç" value={amount(debtTotal)} detail={`${owedDebtCount} alınan borç kaydı`} icon="receipt" tone="lilac" trend="0%"/><MetricCard label="Stok kalemi" value={selectedRecords.stock.length} detail="Henüz stok kaydı yok" icon="box" tone="blue" trend="0%"/></div>
    <div className="dashboard-grid single-panel-grid"><RevenueChart selectedRecords={selectedRecords} selectedDate={selectedDate}/></div>
    <div className="dashboard-grid single-panel-grid"><RecentActivity rows={latestSales} onNavigate={onNavigate} onEdit={onEdit} onAdd={onAdd}/></div>
  </>;
}

function RevenueChart({ selectedRecords, selectedDate }) {
  const [rangeDays, setRangeDays] = useState(7);
  const periodRows = useMemo(() => {
    const end = new Date(`${selectedDate}T12:00:00`);
    return Array.from({ length: rangeDays }, (_, index) => {
      const date = new Date(end);
      date.setDate(end.getDate() - (rangeDays - index - 1));
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      const sales = selectedRecords.sales.filter((row) => row.date === key).reduce((sum, row) => sum + toNumber(row.total), 0);
      const expenses = selectedRecords.expenses.filter((row) => row.date === key).reduce((sum, row) => sum + toNumber(row.amount), 0);
      return { date: key, sales, expenses };
    });
  }, [rangeDays, selectedDate, selectedRecords.sales, selectedRecords.expenses]);
  const salesTotal = periodRows.reduce((sum, row) => sum + row.sales, 0);
  const expenseTotal = periodRows.reduce((sum, row) => sum + row.expenses, 0);
  const maxValue = Math.max(...periodRows.map((row) => Math.max(row.sales, row.expenses)), 0);
  const chartMax = maxValue || 1;
  const hasData = maxValue > 0;
  const axisValues = [chartMax, chartMax / 2, 0];
  return <section className="panel chart-panel">
    <div className="panel-head"><div><div className="panel-kicker">PERFORMANS</div><h2>Gelir ve gider dengesi</h2></div><div className="legend"><span><i className="legend-dot teal-dot"/> Gelir</span><span><i className="legend-dot peach-dot"/> Gider</span><select className="select-chip" aria-label="Performans dönemi" value={rangeDays} onChange={(event) => setRangeDays(Number(event.target.value))}><option value="7">Son 7 gün</option><option value="14">Son 14 gün</option><option value="30">Son 30 gün</option></select></div></div>
    <div className="chart-summary"><strong>{amount(salesTotal - expenseTotal)}</strong><span>{hasData ? `Son ${rangeDays} gün net hareketi` : `Son ${rangeDays} günde hareket yok`}</span></div>
    <div className="chart"><div className="chart-y">{axisValues.map((value, index) => <span key={index}>{amount(value)}</span>)}</div><div className="chart-area"><div className="grid-line line-1"/><div className="grid-line line-2"/><div className="grid-line line-3"/><div className="chart-bars">{periodRows.map((row) => <div className="chart-bar-group" key={row.date} title={`${dateLabel(row.date)} · Gelir ${amount(row.sales)} · Gider ${amount(row.expenses)}`}><div className="chart-bar sales-bar" style={{ height: `${row.sales ? Math.max(3, row.sales / chartMax * 100) : 0}%` }} aria-label={`${dateLabel(row.date)} gelir ${amount(row.sales)}`}/><div className="chart-bar expense-bar" style={{ height: `${row.expenses ? Math.max(3, row.expenses / chartMax * 100) : 0}%` }} aria-label={`${dateLabel(row.date)} gider ${amount(row.expenses)}`}/></div>)}</div>{!hasData && <div className="chart-empty"><span className="empty-icon"><Icon name="trend" size={20}/></span><strong>Henüz grafik verisi yok</strong><span>İlk gelir veya gider kaydını eklediğinizde bu alan dolacak.</span></div>}<div className="chart-x">{periodRows.map((row) => <span key={row.date}>{rangeDays > 14 ? row.date.slice(8) : dateLabel(row.date)}</span>)}</div></div></div>
  </section>;
}

function RecentActivity({ rows, onNavigate, onEdit, onAdd }) {
  return <section className="panel activity-panel"><div className="panel-head"><div><div className="panel-kicker">SON HAREKETLER</div><h2>Son satış kayıtları</h2></div><button className="text-button" onClick={() => onNavigate("sales")}>Tümünü gör <Icon name="chevronRight" size={14}/></button></div><div className="table-wrap"><table><thead><tr><th>Müşteri</th><th>Malzeme</th><th>Ödeme</th><th className="align-right">Tutar</th><th></th></tr></thead><tbody>{rows.length ? rows.map((row) => <tr key={row.id}><td><div className="person-cell"><span className="row-avatar">{row.customer.slice(0, 1)}</span><span><strong>{row.customer}</strong><small>{row.invoice} · {dateLabel(row.date)}</small></span></div></td><td>{row.product}</td><td><Badge tone={row.payment.includes("M-Pesa") ? "teal" : "neutral"}>{row.payment}</Badge></td><td className="align-right amount">{amount(row.total)}</td><td><button className="row-action" onClick={() => onEdit("sales", row)} aria-label="Düzenle"><Icon name="edit" size={15}/></button></td></tr>) : <tr><td colSpan="5"><div className="empty-table-state"><span className="empty-icon"><Icon name="receipt" size={19}/></span><strong>Henüz satış kaydı yok</strong><span>İlk satış kaydınızı eklediğinizde burada görünecek.</span></div></td></tr>}</tbody></table></div><button className="add-row" onClick={onAdd}><Icon name="plus" size={15}/> Yeni satış kaydı ekle</button></section>;
}

function DailyControl({ selectedDate, selectedRecords, onNavigate }) {
  const dayRecords = (kind) => selectedRecords[kind].filter((row) => row.date === selectedDate);
  const dailySales = dayRecords("sales");
  const dailyExpenses = dayRecords("expenses");
  const dailyProduction = dayRecords("production");
  const salesTotal = dailySales.reduce((sum, row) => sum + toNumber(row.total), 0);
  const expenseTotal = dailyExpenses.reduce((sum, row) => sum + toNumber(row.amount), 0);
  const productionTotal = dailyProduction.reduce((sum, row) => sum + toNumber(row.qty), 0);
  const brokenTotal = dailyProduction.reduce((sum, row) => sum + toNumber(row.broken), 0);
  const hasRecords = dailySales.length || dailyExpenses.length || dailyProduction.length;
  const completedSections = [dailySales.length > 0, dailyExpenses.length > 0, dailyProduction.length > 0].filter(Boolean).length;
  const controlScore = Math.round(completedSections / 3 * 100);
  return <div className="daily-page"><div className="daily-hero"><div><div className="eyebrow">{dateLabel(selectedDate)} · GÜN KAPANIŞI</div><h2>Bugünün kontrol listesi</h2><p>İşletmenin günlük gelir, gider ve üretim kayıtlarını aynı gün içinde tamamlayın. Gün sonu özeti kayıtlardan otomatik oluşur.</p></div><div className="daily-score"><span>Kontrol skoru</span><strong>{controlScore}%</strong><div className="progress-track"><span style={{ width: `${controlScore}%` }}/></div></div></div><div className="checklist-grid"><div className={`check-card ${dailySales.length ? "done" : ""}`}><span className="check-circle"><Icon name={dailySales.length ? "check" : "arrowUp"} size={15}/></span><div><strong>Satış kayıtları</strong><span>{dailySales.length ? `${dailySales.length} satış kaydı işlendi` : "Henüz kayıt yok"}</span></div><Badge tone={dailySales.length ? "success" : "warning"}>{dailySales.length ? "Tamam" : "Bekliyor"}</Badge></div><div className={`check-card ${dailyProduction.length ? "done" : ""}`}><span className="check-circle muted"><Icon name="box" size={15}/></span><div><strong>Üretim kaydı</strong><span>{dailyProduction.length ? `${dailyProduction.length} üretim kaydı işlendi` : "Henüz kayıt yok"}</span></div><Badge tone={dailyProduction.length ? "success" : "warning"}>{dailyProduction.length ? "Tamam" : "Bekliyor"}</Badge></div><div className="check-card done"><span className="check-circle muted"><Icon name="refresh" size={15}/></span><div><strong>Gün sonu özeti</strong><span>Kayıtlardan otomatik oluşturulur</span></div><Badge tone="success">Otomatik</Badge></div><div className={`check-card ${dailyExpenses.length ? "done" : ""}`}><span className="check-circle"><Icon name={dailyExpenses.length ? "check" : "arrowDown"} size={15}/></span><div><strong>Gider kayıtları</strong><span>{dailyExpenses.length ? `${dailyExpenses.length} gider kaydı işlendi` : "Henüz kayıt yok"}</span></div><Badge tone={dailyExpenses.length ? "success" : "warning"}>{dailyExpenses.length ? "Tamam" : "Bekliyor"}</Badge></div></div><div className="daily-bottom"><div className="panel mini-panel"><div className="panel-head"><div><div className="panel-kicker">GÜNLÜK ÖZET</div><h2>Hareket özeti</h2></div></div><div className="daily-summary-grid"><div><span>Gelir</span><strong>{amount(salesTotal)}</strong><small>{dailySales.length} işlem</small></div><div><span>Gider</span><strong>{amount(expenseTotal)}</strong><small>{dailyExpenses.length} işlem</small></div><div><span>Üretim</span><strong>{money(productionTotal)}</strong><small>adet</small></div><div><span>Fire</span><strong>{money(brokenTotal)}</strong><small>adet</small></div></div></div><div className="panel note-panel"><div className="panel-kicker">GÜN NOTU</div><h2>{hasRecords ? "Gün özeti hazır" : "Henüz kayıt yok"}</h2><p>{hasRecords ? "Bu günün raporu günlük kayıtlar ekranında da otomatik olarak görüntülenir." : "İlk işlemi eklediğinizde bu günün kontrol adımları burada görünecek."}</p><button className="text-button" onClick={() => onNavigate("dailyRecords")}>Günlük kayıtlara git <Icon name="chevronRight" size={14}/></button></div></div></div>;
}

function DailyRecordsPage({ selectedRecords }) {
  const monthOptions = useMemo(() => {
    const months = new Set([today.slice(0, 7)]);
    Object.values(selectedRecords).flat().forEach((row) => {
      const month = String(row.date || "").slice(0, 7);
      if (/^\d{4}-\d{2}$/.test(month)) months.add(month);
    });
    const sortedMonths = [...months].sort();
    const first = sortedMonths[0] || today.slice(0, 7);
    const last = sortedMonths.at(-1) || today.slice(0, 7);
    const [firstYear, firstMonth] = first.split("-").map(Number);
    const [lastYear, lastMonth] = last.split("-").map(Number);
    const options = [];
    for (let cursor = new Date(firstYear, firstMonth - 1, 1); cursor <= new Date(lastYear, lastMonth - 1, 1); cursor.setMonth(cursor.getMonth() + 1)) {
      options.push(`${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`);
    }
    return options.reverse();
  }, [selectedRecords]);
  const [selectedMonth, setSelectedMonth] = useState(today.slice(0, 7));
  useEffect(() => {
    if (!monthOptions.includes(selectedMonth)) setSelectedMonth(monthOptions[0] || today.slice(0, 7));
  }, [monthOptions, selectedMonth]);
  const monthDays = useMemo(() => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const dayCount = new Date(year, month, 0).getDate();
    const sum = (rows, field) => rows.reduce((total, row) => total + toNumber(row[field]), 0);
    return Array.from({ length: dayCount }, (_, index) => {
      const date = `${selectedMonth}-${String(index + 1).padStart(2, "0")}`;
      const sales = selectedRecords.sales.filter((row) => row.date === date);
      const expenses = selectedRecords.expenses.filter((row) => row.date === date);
      const production = selectedRecords.production.filter((row) => row.date === date);
      const income = sum(sales, "total");
      const expense = sum(expenses, "amount");
      const productionQty = sum(production, "qty");
      const brokenQty = sum(production, "broken");
      const recordCount = sales.length + expenses.length + production.length;
      const future = date > today;
      return { date, sales, expenses, production, income, expense, net: income - expense, productionQty, brokenQty, recordCount, future, hasRecords: recordCount > 0 };
    });
  }, [selectedMonth, selectedRecords]);
  const monthIncome = monthDays.reduce((sum, day) => sum + day.income, 0);
  const monthExpense = monthDays.reduce((sum, day) => sum + day.expense, 0);
  const activeDays = monthDays.filter((day) => day.hasRecords).length;
  const monthLabel = new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }).format(new Date(`${selectedMonth}-01T12:00:00`));
  const weekdayLabel = (date) => new Intl.DateTimeFormat("tr-TR", { weekday: "long" }).format(new Date(`${date}T12:00:00`));
  return <div className="daily-records-page">
    <section className="daily-records-toolbar panel">
      <div><div className="panel-kicker">AYLIK GÜN RAPORLARI</div><h2>{monthLabel} günlük kayıtları</h2><p>Ayın her günü burada yer alır. Gün sonu özeti, girilen gelir, gider ve üretim kayıtlarından otomatik oluşur.</p></div>
      <label className="daily-month-select"><span>Ay seçin</span><select value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)}>{monthOptions.map((month) => <option key={month} value={month}>{new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }).format(new Date(`${month}-01T12:00:00`))}</option>)}</select></label>
    </section>
    <section className="daily-records-summary">
      <div className="daily-record-stat"><span>Toplam gelir</span><strong>{amount(monthIncome)}</strong><small>{monthLabel}</small></div>
      <div className="daily-record-stat"><span>Toplam gider</span><strong>{amount(monthExpense)}</strong><small>{monthLabel}</small></div>
      <div className="daily-record-stat"><span>Net hareket</span><strong className={monthIncome - monthExpense < 0 ? "negative" : "positive"}>{amount(monthIncome - monthExpense)}</strong><small>Gelir - gider</small></div>
      <div className="daily-record-stat"><span>Aktif gün</span><strong>{activeDays} / {monthDays.length}</strong><small>Kayıt bulunan gün</small></div>
    </section>
    <div className="daily-record-list">{monthDays.map((day) => <article className={`panel daily-record-card ${day.future ? "future" : day.hasRecords ? "has-records" : "empty"}`} key={day.date}>
      <div className="daily-day-date"><span className="daily-day-icon"><Icon name="calendar" size={17}/></span><div><strong>{day.date.slice(8)}</strong><span>{weekdayLabel(day.date)}</span></div></div>
      <div className="daily-day-metrics"><div><span>Gelir</span><strong>{amount(day.income)}</strong></div><div><span>Gider</span><strong>{amount(day.expense)}</strong></div><div><span>Net</span><strong className={day.net < 0 ? "negative" : "positive"}>{amount(day.net)}</strong></div><div><span>Üretim</span><strong>{money(day.productionQty)}</strong><small>{money(day.brokenQty)} fire</small></div></div>
      <div className="daily-day-status"><Badge tone={day.future ? "neutral" : day.hasRecords ? "success" : "warning"}>{day.future ? "Gelecek gün" : day.hasRecords ? "Kayıt var" : "Kayıt yok"}</Badge><small>{day.recordCount ? `${day.recordCount} işlem` : "Gün sonu özeti bekliyor"}</small></div>
    </article>)}</div>
  </div>;
}

function ModuleView({ activeView, records, query, setQuery, onAdd, onEdit, onDelete, onDetail, onPay, onPrint }) {
  const copy = viewCopy[activeView];
  const isFinanceView = activeView === "sales" || activeView === "expenses";
  const [filterOpen, setFilterOpen] = useState(false);
  const [debtFilter, setDebtFilter] = useState("all");
  const [filters, setFilters] = useState({ dateFrom: "", dateTo: "", payment: "", category: "", status: "" });
  const [sortValue, setSortValue] = useState("date:desc");
  const updateFilter = (key) => (event) => setFilters((current) => ({ ...current, [key]: event.target.value }));
  const clearFilters = () => setFilters({ dateFrom: "", dateTo: "", payment: "", category: "", status: "" });
  const paymentOptions = [...new Set(records.map((row) => row.payment).filter(Boolean))].sort((left, right) => left.localeCompare(right, "tr-TR"));
  const categoryOptions = [...new Set(records.map((row) => row.category).filter(Boolean))].sort((left, right) => left.localeCompare(right, "tr-TR"));
  const statusOptions = [...new Set(records.map((row) => row.status).filter(Boolean))].sort((left, right) => left.localeCompare(right, "tr-TR"));
  const sortOptions = activeView === "sales"
    ? [{ value: "date:desc", label: "Tarih: yeni → eski" }, { value: "date:asc", label: "Tarih: eski → yeni" }, { value: "amount:desc", label: "Tutar: yüksek → düşük" }, { value: "amount:asc", label: "Tutar: düşük → yüksek" }, { value: "qty:desc", label: "Adet: yüksek → düşük" }, { value: "customer:asc", label: "Müşteri: A → Z" }, { value: "product:asc", label: "Malzeme: A → Z" }]
    : activeView === "expenses"
      ? [{ value: "date:desc", label: "Tarih: yeni → eski" }, { value: "date:asc", label: "Tarih: eski → yeni" }, { value: "amount:desc", label: "Tutar: yüksek → düşük" }, { value: "amount:asc", label: "Tutar: düşük → yüksek" }, { value: "category:asc", label: "Kategori: A → Z" }, { value: "description:asc", label: "Açıklama: A → Z" }]
      : [{ value: "date:desc", label: "Tarih: yeni → eski" }, { value: "date:asc", label: "Tarih: eski → yeni" }, { value: "amount:desc", label: "Değer: yüksek → düşük" }, { value: "amount:asc", label: "Değer: düşük → yüksek" }];
  const [sortKey, sortDirection] = sortValue.split(":");
  const getSortValue = (row) => {
    if (sortKey === "date") return row.date || "";
    if (sortKey === "amount") return activeView === "debts" ? debtAmounts(row).remaining : toNumber(row.total ?? row.amount ?? row.qty ?? row.salary ?? row.stock ?? 0);
    if (sortKey === "qty") return toNumber(row.qty);
    if (sortKey === "customer") return row.customer || "";
    if (sortKey === "product") return row.product || "";
    if (sortKey === "category") return row.category || "";
    if (sortKey === "description") return row.detail || "";
    return "";
  };
  const searchText = query.trim().toLocaleLowerCase("tr-TR");
  const visibleRows = records.filter((row) => {
    const date = row.date || "";
    const matchesSearch = !searchText || JSON.stringify(row).toLocaleLowerCase("tr-TR").includes(searchText);
    const matchesDate = (!filters.dateFrom || date >= filters.dateFrom) && (!filters.dateTo || date <= filters.dateTo);
    const matchesPayment = !filters.payment || row.payment === filters.payment;
    const matchesCategory = !filters.category || row.category === filters.category;
    const matchesStatus = !filters.status || row.status === filters.status;
    const matchesDirection = activeView !== "debts" || debtFilter === "all" || debtDirection(row) === debtFilter;
    return matchesSearch && matchesDate && matchesPayment && matchesCategory && matchesStatus && matchesDirection;
  });
  const sortedRows = [...visibleRows].sort((left, right) => {
    const leftValue = getSortValue(left);
    const rightValue = getSortValue(right);
    const comparison = typeof leftValue === "number" && typeof rightValue === "number"
      ? leftValue - rightValue
      : String(leftValue).localeCompare(String(rightValue), "tr-TR", { numeric: true, sensitivity: "base" });
    return sortDirection === "desc" ? -comparison : comparison;
  });
  const total = visibleRows.reduce((sum, row) => sum + (activeView === "debts" ? debtAmounts(row).remaining : toNumber(row.total ?? row.amount ?? row.qty ?? 0)), 0);
  const broken = visibleRows.reduce((sum, row) => sum + toNumber(row.broken ?? 0), 0);
  const cement = visibleRows.reduce((sum, row) => sum + toNumber(row.cement ?? 0), 0);
  const salary = visibleRows.reduce((sum, row) => sum + toNumber(row.salary ?? 0), 0);
  const balance = visibleRows.reduce((sum, row) => sum + toNumber(row.balance ?? 0), 0);
  const owedOpen = activeView === "debts" ? visibleRows.filter((row) => debtDirection(row) !== "lent").reduce((sum, row) => sum + debtAmounts(row).remaining, 0) : 0;
  const lentOpen = activeView === "debts" ? visibleRows.filter((row) => debtDirection(row) === "lent").reduce((sum, row) => sum + debtAmounts(row).remaining, 0) : 0;
  const owedCount = activeView === "debts" ? records.filter((row) => debtDirection(row) !== "lent").length : 0;
  const lentCount = activeView === "debts" ? records.filter((row) => debtDirection(row) === "lent").length : 0;
  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const stats = activeView === "sales" ? [{ label: "Toplam satış", value: amount(total) }, { label: "Kayıt sayısı", value: visibleRows.length }, { label: "Ortalama satış", value: visibleRows.length ? amount(total / visibleRows.length) : amount(0) }] : activeView === "expenses" ? [{ label: "Toplam gider", value: amount(total) }, { label: "Kayıt sayısı", value: visibleRows.length }, { label: "Bekleyen inceleme", value: visibleRows.filter((row) => row.status === "İnceleniyor").length }] : activeView === "production" ? [{ label: "Toplam adet", value: money(total) }, { label: "Fire adedi", value: money(broken) }, { label: "Hammadde kullanımı", value: money(cement) }] : activeView === "stock" ? [{ label: "Toplam kalem", value: visibleRows.length }, { label: "Düşük stok", value: visibleRows.filter((row) => row.state === "Düşük").length }, { label: "Son hareket", value: "Yok" }] : activeView === "matExpenses" ? [{ label: "Toplam tutar", value: amount(total) }, { label: "Kayıt sayısı", value: visibleRows.length }, { label: "Ürün çeşidi", value: new Set(visibleRows.map((row) => row.product).filter(Boolean)).size }] : activeView === "workers" ? [{ label: "Çalışan", value: visibleRows.length }, { label: "Maaş toplamı", value: amount(salary) }, { label: "Bakiye", value: amount(balance) }] : [{ label: "Alınan açık", value: amount(owedOpen) }, { label: "Verilen açık", value: amount(lentOpen) }, { label: "Kayıt sayısı", value: visibleRows.length }];
  return <div className="module-page">
    <div className="module-summary">{stats.map((stat) => <div className="module-stat" key={stat.label}><span>{stat.label}</span><strong>{stat.value}</strong></div>)}</div>
    <section className="panel module-panel">
      <div className="module-toolbar">
        <div className="toolbar-search"><Icon name="search" size={16}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Kayıtlarda ara..."/></div>
        <div className="toolbar-actions">
          {isFinanceView && <button className={`button secondary small ${filterOpen ? "active" : ""}`} onClick={() => setFilterOpen((open) => !open)}><Icon name="filter" size={15}/> Filtrele{activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}</button>}
          <label className="sort-control"><span>Sırala</span><select aria-label="Tablo sıralaması" value={sortValue} onChange={(event) => setSortValue(event.target.value)}>{sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
          <button className="button primary small" onClick={onAdd}><Icon name="plus" size={15}/> {copy.primary}</button>
        </div>
      </div>
      {filterOpen && isFinanceView && <div className="filter-panel">
        <label>Başlangıç tarihi<input type="date" value={filters.dateFrom} onChange={updateFilter("dateFrom")}/></label>
        <label>Bitiş tarihi<input type="date" value={filters.dateTo} onChange={updateFilter("dateTo")}/></label>
        <label>Ödeme tipi<select value={filters.payment} onChange={updateFilter("payment")}><option value="">Tümü</option>{paymentOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
        {activeView === "expenses" && <label>Kategori<select value={filters.category} onChange={updateFilter("category")}><option value="">Tümü</option>{categoryOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>}
        <label>Durum<select value={filters.status} onChange={updateFilter("status")}><option value="">Tümü</option>{statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
        <button type="button" className="text-button filter-clear" onClick={clearFilters}>Filtreleri temizle</button>
      </div>}
      <div className="module-result-meta"><span>{visibleRows.length} kayıt gösteriliyor</span>{(query || activeFilterCount) && <span>Toplam {records.length} kayıttan süzüldü</span>}</div>
      {activeView === "debts" && <div className="debt-tabs" role="tablist" aria-label="Borç türü filtresi"><button type="button" role="tab" aria-selected={debtFilter === "all"} className={`debt-tab ${debtFilter === "all" ? "active" : ""}`} onClick={() => setDebtFilter("all")}>Tümü <span className="count">({records.length})</span></button><button type="button" role="tab" aria-selected={debtFilter === "owed"} className={`debt-tab ${debtFilter === "owed" ? "active" : ""}`} onClick={() => setDebtFilter("owed")}>Alınan borç <span className="count">({owedCount})</span></button><button type="button" role="tab" aria-selected={debtFilter === "lent"} className={`debt-tab ${debtFilter === "lent" ? "active" : ""}`} onClick={() => setDebtFilter("lent")}>Verilen borç <span className="count">({lentCount})</span></button></div>}
      <ModuleTable kind={activeView} rows={sortedRows} onEdit={onEdit} onDelete={onDelete} onDetail={onDetail} onPay={onPay} onPrint={onPrint}/>
    </section>
  </div>;
}

function LegacyModuleTable({ kind, rows, onEdit, onDelete, onDetail }) {
  if (!rows.length) return <div className="empty-module-state"><span className="empty-icon"><Icon name={viewCopy[kind].icon} size={19}/></span><strong>{viewCopy[kind].title} için henüz kayıt yok</strong><span>İlk kaydı eklediğinizde bu bölümde görünecek.</span></div>;
  if (kind === "sales") return <div className="table-wrap module-table"><table><thead><tr><th>TARİH</th><th>MÜŞTERİ</th><th>MALZEME</th><th>ADET</th><th>ÖDEME</th><th className="align-right">TUTAR</th><th>FATURA</th><th></th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td>{dateLabel(row.date)}</td><td><div className="person-cell"><span className="row-avatar">{row.customer.slice(0, 1)}</span><strong>{row.customer}</strong></div></td><td>{row.product}</td><td>{money(row.qty)}</td><td><Badge tone={row.payment.includes("M-Pesa") ? "teal" : "neutral"}>{row.payment}</Badge></td><td className="align-right amount">{amount(row.total)}</td><td>{row.invoice}</td><RecordActions row={row} onEdit={onEdit} onDelete={onDelete}/></tr>)}</tbody></table></div>;
  if (kind === "expenses") return <div className="table-wrap module-table"><table><thead><tr><th>TARİH</th><th>KATEGORİ</th><th>AÇIKLAMA</th><th>ÖDEME</th><th className="align-right">TUTAR</th><th>DURUM</th><th></th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td>{dateLabel(row.date)}</td><td><div className="category-cell"><span className="category-icon"><Icon name={row.category === "Transport" ? "truck" : row.category === "Yakıt" ? "factory" : "receipt"} size={15}/></span>{row.category}</div></td><td>{row.detail}</td><td><Badge tone={row.payment.includes("M-Pesa") ? "teal" : "neutral"}>{row.payment}</Badge></td><td className="align-right amount">{amount(row.amount)}</td><td><Badge tone={row.status === "İnceleniyor" ? "warning" : "success"}>{row.status}</Badge></td><RecordActions row={row} onEdit={onEdit} onDelete={onDelete}/></tr>)}</tbody></table></div>;
  if (kind === "production") return <div className="table-wrap module-table"><table><thead><tr><th>TARİH</th><th>ÜRÜN</th><th>PALET</th><th>ADET</th><th>FİRE</th><th>HAMMADDE</th><th>KALAN</th><th></th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td>{dateLabel(row.date)}</td><td>{row.product}</td><td>{money(row.pallets)}</td><td className="amount">{money(row.qty)}</td><td>{money(row.broken)}</td><td>{money(row.cement)}</td><td>{row.remaining == null ? <Badge tone="warning">Eksik</Badge> : money(row.remaining)}</td><RecordActions row={row} onEdit={onEdit} onDelete={onDelete}/></tr>)}</tbody></table></div>;
  if (kind === "stock") return <div className="table-wrap module-table"><table><thead><tr><th>MALZEME</th><th>RENK</th><th>STOK</th><th>BİRİM</th><th>DURUM</th><th>SON HAREKET</th><th></th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td><div className="person-cell"><span className="row-avatar stock-avatar"><Icon name="box" size={15}/></span><strong>{row.item}</strong></div></td><td>{row.color || <span className="muted-text">—</span>}</td><td className="amount">{money(row.stock)}</td><td>{row.unit}</td><td><Badge tone={row.state === "Düşük" ? "danger" : row.state === "Takipte" ? "warning" : "success"}>{row.state}</Badge></td><td>31 Tem 2026</td><RecordActions row={row} onEdit={onEdit} onDelete={onDelete}/></tr>)}</tbody></table></div>;
  if (kind === "workers") return <div className="table-wrap module-table"><table><thead><tr><th>ÇALIŞAN</th><th className="align-right">MAAŞ</th><th className="align-right">AVANS</th><th>DEVAMSIZLIK</th><th className="align-right">BAKİYE</th><th></th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td><div className="person-cell"><span className="row-avatar worker-avatar">{row.name.slice(0, 1)}</span><strong>{row.name}</strong></div></td><td className="align-right">{amount(row.salary)}</td><td className="align-right">{amount(row.advance)}</td><td>{row.absence ? <Badge tone="warning">{row.absence} gün</Badge> : <span className="muted-text">Yok</span>}</td><td className="align-right amount">{amount(row.balance)}</td><RecordActions row={row} onEdit={onEdit} onDelete={onDelete} onDetail={onDetail}/></tr>)}</tbody></table></div>;
  return <div className="table-wrap module-table"><table><thead><tr><th>ALACAKLI</th><th>KAYNAK</th><th>VADE</th><th className="align-right">AÇIK BAKİYE</th><th>DURUM</th><th></th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td><div className="person-cell"><span className="row-avatar debt-avatar"><Icon name="receipt" size={15}/></span><strong>{row.creditor}</strong></div></td><td>{row.source}</td><td>{row.due}</td><td className="align-right amount">{amount(row.amount)}</td><td><Badge tone={row.status === "Yüksek" ? "danger" : "warning"}>{row.status}</Badge></td><RecordActions row={row} onEdit={onEdit} onDelete={onDelete}/></tr>)}</tbody></table></div>;
}

function DebtProgress({ row }) {
  const { total, paid } = debtAmounts(row);
  const percent = total > 0 ? Math.min(100, Math.round(paid / total * 100)) : 0;
  return <div className="progress-cell"><div className="progress-bar" role="progressbar" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100" aria-label={`%${percent} tamamlandı`}><span style={{ width: `${percent}%` }}/></div><small>%{percent}</small></div>;
}

function DebtTable({ rows, onEdit, onDelete, onDetail, onPay, onPrint }) {
  if (!rows.length) return <div className="empty-module-state"><span className="empty-icon"><Icon name="receipt" size={19}/></span><strong>Borçlar için henüz kayıt yok</strong><span>İlk kaydı eklediğinizde bu bölümde görünecek.</span></div>;
  return <div className="table-wrap module-table"><table><thead><tr><th>KİŞİ</th><th>TÜR</th><th>VADE</th><th className="align-right">TOPLAM</th><th className="align-right">ÖDENEN / TAHSİL</th><th className="align-right">KALAN</th><th>DURUM</th><th></th></tr></thead><tbody>{rows.map((row) => {
    const debt = normalizeDebtRow(row);
    const lent = debtDirection(debt) === "lent";
    const amounts = debtAmounts(debt);
    const status = debtStatusLabel(debt);
    const tone = amounts.remaining <= 0 && amounts.total > 0 ? "success" : amounts.paid > 0 ? "warning" : "danger";
    return <tr key={debt.id}><td><div className="person-cell"><span className="row-avatar debt-avatar"><Icon name="receipt" size={15}/></span><span className="debt-person"><strong>{debt.creditor}</strong><small>{debt.source}</small></span></div></td><td><Badge tone={lent ? "teal" : "warning"}>{lent ? "Verilen" : "Alınan"}</Badge></td><td>{debt.due}</td><td className="align-right amount">{amount(amounts.total)}</td><td className="align-right">{amount(amounts.paid)}</td><td className="align-right amount">{amount(amounts.remaining)}</td><td><div className="payment-cell"><Badge tone={tone}>{status}</Badge><DebtProgress row={debt}/></div></td><td className="record-actions">{amounts.remaining > 0 && onPay && <button className="button primary small" onClick={() => onPay(debt)}>{lent ? "Tahsilat" : "Öde"}</button>}{onDetail && <button className="row-action" onClick={() => onDetail(debt)} aria-label="İşlem detayı" title="İşlem detayı"><Icon name="receipt" size={15}/></button>}{onPrint && <button className="row-action" onClick={() => onPrint(debt)} aria-label="Fiş yazdır" title="Fiş yazdır (PDF)"><Icon name="download" size={15}/></button>}<button className="row-action" onClick={() => onEdit(debt)} aria-label="Düzenle"><Icon name="edit" size={15}/></button><button className="row-action danger-action" onClick={() => onDelete(debt)} aria-label="Sil"><Icon name="trash" size={15}/></button></td></tr>;
  })}</tbody></table></div>;
}

function ModuleTable({ kind, rows, onEdit, onDelete, onDetail, onPay, onPrint }) {
  if (kind === "sales") return <div className="table-wrap module-table"><table><thead><tr><th>TARİH</th><th>MÜŞTERİ</th><th>MALZEME</th><th>ADET</th><th>ÖDEME</th><th className="align-right">TUTAR</th><th>FATURA</th><th></th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td>{dateLabel(row.date)}</td><td><div className="person-cell"><span className="row-avatar">{row.customer.slice(0, 1)}</span><strong>{row.customer}</strong></div></td><td>{row.product}</td><td>{money(row.qty)}</td><td><PaymentCell row={row}/></td><td className="align-right amount">{amount(row.total)}</td><td>{row.invoice}</td><RecordActions row={row} onEdit={onEdit} onDelete={onDelete}/></tr>)}</tbody></table></div>;
  if (kind === "expenses") return <div className="table-wrap module-table"><table><thead><tr><th>TARİH</th><th>KATEGORİ</th><th>AÇIKLAMA</th><th>ÖDEME</th><th className="align-right">TUTAR</th><th>DURUM</th><th></th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td>{dateLabel(row.date)}</td><td><div className="category-cell"><span className="category-icon"><Icon name={row.category === "Transport" ? "truck" : row.category === "Yakıt" ? "factory" : "receipt"} size={15}/></span>{row.category}</div></td><td><div>{row.detail}</div>{row.worker ? <small className="cell-sub">Çalışan: {row.worker}</small> : null}{row.note ? <small className="cell-sub">{row.note}</small> : null}</td><td><PaymentCell row={row}/></td><td className="align-right amount">{amount(row.amount)}</td><td><Badge tone={row.status === "İnceleniyor" ? "warning" : "success"}>{row.status}</Badge></td><RecordActions row={row} onEdit={onEdit} onDelete={onDelete}/></tr>)}</tbody></table></div>;
  if (kind === "matExpenses") return <div className="table-wrap module-table"><table><thead><tr><th>TARİH</th><th>ÜRÜN CİNSİ</th><th>RENK</th><th>PAKET</th><th>BOY</th><th>BİRİM FİYAT</th><th className="align-right">TOPLAM TUTAR</th><th></th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td>{dateLabel(row.date)}</td><td><strong>{row.product}</strong></td><td>{row.color || <span className="muted-text">—</span>}</td><td>{row.package || <span className="muted-text">—</span>}</td><td>{row.length || <span className="muted-text">—</span>}</td><td>{row.unitPrice != null && row.unitPrice !== "" ? amount(row.unitPrice) : <span className="muted-text">—</span>}</td><td className="align-right amount">{amount(row.total)}</td><RecordActions row={row} onEdit={onEdit} onDelete={onDelete}/></tr>)}</tbody></table></div>;
  if (kind === "debts") return <DebtTable rows={rows} onEdit={onEdit} onDelete={onDelete} onDetail={onDetail} onPay={onPay} onPrint={onPrint}/>;
  return <LegacyModuleTable kind={kind} rows={rows} onEdit={onEdit} onDelete={onDelete} onDetail={onDetail}/>;
}

function RecordActions({ row, onEdit, onDelete, onDetail }) {
  return <td className="record-actions">{onDetail && <button className="row-action" onClick={() => onDetail(row)} aria-label="Ödeme detayı" title="Ödeme detayı"><Icon name="receipt" size={15}/></button>}<button className="row-action" onClick={() => onEdit(row)} aria-label="Düzenle"><Icon name="edit" size={15}/></button><button className="row-action danger-action" onClick={() => onDelete(row)} aria-label="Sil"><Icon name="trash" size={15}/></button></td>;
}

function MaterialField({ label, materials, form, update }) {
  const handleSelect = (event) => {
    const chosen = materials.find((material) => material.id === event.target.value);
    update("materialId")(event);
    update("materialMode")({ target: { value: chosen ? "existing" : "new" } });
    update("materialName")({ target: { value: chosen?.name || "" } });
    if (chosen) update("unit")({ target: { value: chosen.unit || form.unit || "adet" } });
  };
  const isNew = !form.materialId || form.materialId === "__new__";
  return <>
    <label>{label}<select aria-label={`${label} seçimi`} value={form.materialId || "__new__"} onChange={handleSelect}><option value="__new__">Yeni / kayıtlı olmayan malzeme</option>{materials.map((material) => <option key={material.id} value={material.id}>{material.name} · {material.unit}</option>)}</select></label>
    {isNew && <label>Malzeme adı<input required value={form.materialName || ""} onChange={update("materialName")} placeholder="Kayıtlı listede olmayan malzeme adı"/></label>}
    {isNew && <label className="checkbox-field"><input type="checkbox" checked={Boolean(form.saveMaterial)} onChange={(event) => setFormValue(update, "saveMaterial", event.target.checked)}/> Bu malzemeyi işletme listesine kaydet</label>}
  </>;
}

function setFormValue(update, key, value) {
  update(key)({ target: { value } });
}

function WorkerDetailModal({ worker, expenses, onClose }) {
  const [openMonth, setOpenMonth] = useState(null);
  const payments = useMemo(() => (expenses || []).filter((row) => row.category === "Çalışan Ödemesi" && (row.workerId ? row.workerId === worker?.id : row.worker === worker?.name)).sort((a, b) => String(b.date).localeCompare(String(a.date))), [expenses, worker]);
  const months = useMemo(() => {
    const map = new Map();
    payments.forEach((row) => {
      const key = String(row.date || "").slice(0, 7);
      if (!/^\d{4}-\d{2}$/.test(key)) return;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(row);
    });
    return [...map.entries()].map(([key, rows]) => ({ key, rows, total: rows.reduce((sum, item) => sum + toNumber(item.amount), 0) }));
  }, [payments]);
  const grand = payments.reduce((sum, row) => sum + toNumber(row.amount), 0);
  const monthLabel = (key) => new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }).format(new Date(`${key}-01T12:00:00`));
  return <Modal title={`${worker?.name || "Çalışan"} · ödeme detayı`} onClose={onClose} wide>
    <div className="worker-detail-body">
      <div className="worker-detail-total"><span>Toplam ödenen ({payments.length} ödeme)</span><strong>{amount(grand)}</strong></div>
      {months.length ? months.map((month) => <div className="worker-month" key={month.key}>
        <button type="button" className="worker-month-head" onClick={() => setOpenMonth(openMonth === month.key ? null : month.key)} aria-expanded={openMonth === month.key}><strong>{monthLabel(month.key)}</strong><span>{amount(month.total)} · {month.rows.length} ödeme <Icon name="chevron" size={14}/></span></button>
        {openMonth === month.key && <div>{month.rows.map((row) => <div className="worker-day" key={row.id}><div><span>{dateLabel(row.date)}</span>{row.note ? <small>{row.note}</small> : null}</div><strong>{amount(row.amount)}</strong></div>)}</div>}
      </div>) : <div className="empty-table-state"><span className="empty-icon"><Icon name="receipt" size={19}/></span><strong>Henüz ödeme kaydı yok</strong><span>Giderler bölümünden "Çalışan Ödemesi" kategorisiyle ödeme ekleyin.</span></div>}
    </div>
  </Modal>;
}

function DebtPaymentModal({ debt, onClose, onSave }) {
  const row = normalizeDebtRow(debt || {});
  const lent = debtDirection(row) === "lent";
  const { total, paid, remaining } = debtAmounts(row);
  const [date, setDate] = useState(today);
  const [payAmount, setPayAmount] = useState("");
  const [remainingAfter, setRemainingAfter] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  if (!debt) return null;
  const payLabel = lent ? "Tahsil edilen" : "Ödenen";
  const onPayChange = (value) => {
    setPayAmount(value);
    setRemainingAfter(hasValue(value) ? String(Math.max(0, remaining - toNumber(value))) : "");
    setError("");
  };
  const onRemainingChange = (value) => {
    setRemainingAfter(value);
    setPayAmount(hasValue(value) ? String(Math.max(0, remaining - toNumber(value))) : "");
    setError("");
  };
  const payAll = () => { setPayAmount(String(remaining)); setRemainingAfter("0"); setError(""); };
  const submit = (event) => {
    event.preventDefault();
    const value = toNumber(payAmount);
    if (!(value > 0)) { setError("Tutar sıfırdan büyük olmalıdır."); return; }
    if (value - remaining > 1e-9) { setError("Tutar kalan tutardan büyük olamaz."); return; }
    onSave(row.id, { amount: value, date: date || today, note });
  };
  return <Modal title={lent ? "Tahsilat yap" : "Borç öde"} onClose={onClose} wide>
    <form className="modal-form" onSubmit={submit}>
      <div className="pay-summary"><div><span>Kişi</span><strong>{row.creditor}</strong></div><div><span>Toplam</span><strong>{amount(total)}</strong></div><div><span>{lent ? "Tahsil edilen" : "Ödenen"}</span><strong>{amount(paid)}</strong></div><div><span>Kalan</span><strong className="negative">{amount(remaining)}</strong></div></div>
      <div className="form-grid two">
        <label>İşlem tarihi<input type="date" value={date} onChange={(event) => setDate(event.target.value)}/></label>
        <label>Açıklama (opsiyonel)<input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Ödeme açıklaması"/></label>
        <label>{payLabel}<input required type="number" min="0" step="any" value={payAmount} onChange={(event) => onPayChange(event.target.value)} placeholder="0,00"/><small className="field-hint">Bu işlemde işlenecek tutar.</small></label>
        <label>Kalan (işlem sonrası)<input type="number" min="0" step="any" value={remainingAfter} onChange={(event) => onRemainingChange(event.target.value)} placeholder="0,00"/><small className="field-hint">Kalanı yazarsanız tutar otomatik hesaplanır.</small></label>
      </div>
      {error && <div className="form-error" role="alert">{error}</div>}
      <div className="modal-actions"><button type="button" className="button secondary" onClick={payAll}>{lent ? "Tamamını tahsil et" : "Borcu kapat"}</button><button className="button primary" type="submit"><Icon name="check" size={16}/> {lent ? "Tahsilatı kaydet" : "Ödemeyi kaydet"}</button></div>
    </form>
  </Modal>;
}

function DebtDetailModal({ debt, onClose, onPay, onPrint }) {
  const row = debt ? normalizeDebtRow(debt) : null;
  if (!row) return null;
  const lent = debtDirection(row) === "lent";
  const { total, paid, remaining } = debtAmounts(row);
  const txns = [...row.transactions].sort((left, right) => String(right.date).localeCompare(String(left.date)));
  return <Modal title={`${row.creditor || "Borç"} · işlem detayı`} onClose={onClose} wide>
    <div className="worker-detail-body">
      <div className="debt-detail-head"><Badge tone={lent ? "teal" : "warning"}>{lent ? "Verilen borç" : "Alınan borç"}</Badge><Badge tone={remaining <= 0 && total > 0 ? "success" : paid > 0 ? "warning" : "danger"}>{debtStatusLabel(row)}</Badge></div>
      <div className="pay-summary"><div><span>Toplam</span><strong>{amount(total)}</strong></div><div><span>{lent ? "Tahsil edilen" : "Ödenen"}</span><strong>{amount(paid)}</strong></div><div><span>Kalan</span><strong className={remaining > 0 ? "negative" : "positive"}>{amount(remaining)}</strong></div><div><span>Vade</span><strong>{row.due || "Açık"}</strong></div></div>
      <DebtProgress row={row}/>
      {txns.length ? <div className="txn-list">{txns.map((txn) => <div className="txn-row" key={txn.id}><span className="txn-date">{fullDateLabel(txn.date)}</span><span className="txn-note">{txn.note || <span className="muted-text">Açıklama yok</span>}</span><strong className="txn-amount">{amount(txn.amount)}</strong></div>)}</div> : <div className="empty-table-state"><span className="empty-icon"><Icon name="receipt" size={19}/></span><strong>Henüz işlem yok</strong><span>Listesindeki {lent ? "Tahsilat" : "Öde"} tuşuyla ilk işlemi ekleyin.</span></div>}
      <div className="modal-actions">{onPrint && <button type="button" className="button secondary" onClick={() => onPrint(row)}><Icon name="download" size={16}/> Fiş yazdır</button>}<button type="button" className="button secondary" onClick={onClose}>Kapat</button>{remaining > 0 && <button type="button" className="button primary" onClick={() => onPay(row)}><Icon name="check" size={16}/> {lent ? "Tahsilat yap" : "Ödeme yap"}</button>}</div>
    </div>
  </Modal>;
}

function SettingsModal({ companyName, paymentMethods, colors, materials, stockAutomationEnabled, onToggleStockAutomation, onAddPayment, onRemovePayment, onAddColor, onRemoveColor, onAddMaterial, onRemoveMaterial, onExport, onImport, onSignOut, onClose }) {
  const [newPayment, setNewPayment] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newMaterial, setNewMaterial] = useState("");
  const [newUnit, setNewUnit] = useState("adet");
  return <Modal title="Muhasebe ayarları" onClose={onClose} wide><div className="settings-body">
    <section className="settings-section permission-section"><div className="settings-icon"><Icon name="shield" size={19}/></div><div><div className="panel-kicker">YETKİ PROFİLİ</div><h4>Muhasebe · tam yetki</h4><p>Günlük kayıtlar, ödeme yöntemleri, stoklar ve veri yedekleri üzerinde tüm işlemler açık.</p></div></section>
    <section className="settings-section"><div className="stock-automation-row"><div><div className="panel-kicker">SATIŞ → STOK</div><h4>Satışta otomatik stok düşümü</h4><p>Açıkken seçilen ürünün satış adedi, satış kaydı oluşturulunca ilgili stoktan düşer. Kapalıyken satış kaydı stok miktarını değiştirmez.</p></div><button type="button" className={`switch-control ${stockAutomationEnabled ? "on" : ""}`} role="switch" aria-checked={stockAutomationEnabled} aria-label="Satışta otomatik stok düşümünü aç veya kapat" onClick={() => onToggleStockAutomation(!stockAutomationEnabled)}><span/></button></div><div className="stock-automation-status"><Badge tone={stockAutomationEnabled ? "success" : "neutral"}>{stockAutomationEnabled ? "Açık" : "Kapalı"}</Badge><span>{stockAutomationEnabled ? "Yeni satışlar stoktan düşer." : "Stok hareketleri manuel kalır."}</span></div></section>
    <section className="settings-section"><div className="settings-section-head"><div><div className="panel-kicker">İŞLETME</div><h4>{companyName}</h4><p>Bu panel tek işletme için çalışır: AYES GROUP.</p></div></div></section>
    <section className="settings-section"><div className="settings-section-head"><div><div className="panel-kicker">ÖDEME YÖNTEMLERİ</div><h4>Ödeme seçenekleri</h4><p>Satış ve gider kayıtlarında kullanılacak yöntemleri yönetin.</p></div></div><form className="settings-inline-form" onSubmit={(event) => { event.preventDefault(); if (newPayment.trim()) { onAddPayment(newPayment); setNewPayment(""); } }}><input aria-label="Yeni ödeme yöntemi" value={newPayment} onChange={(event) => setNewPayment(event.target.value)} placeholder="Yeni ödeme yöntemi"/><button className="button primary small" type="submit"><Icon name="plus" size={14}/> Ekle</button></form><div className="settings-list">{paymentMethods.map((method) => <div className="settings-list-row" key={method}><span>{method}</span><button className="menu-icon-button danger" aria-label={`${method} ödeme yöntemini sil`} onClick={() => onRemovePayment(method)}><Icon name="trash" size={14}/></button></div>)}</div></section>
    <section className="settings-section"><div className="settings-section-head"><div><div className="panel-kicker">RENK SEÇENEKLERİ</div><h4>Renk listesi</h4><p>Renkler yalnızca buradan eklenir; stok ve malzeme gideri kayıtlarında bu liste kullanılır.</p></div></div><form className="settings-inline-form" onSubmit={(event) => { event.preventDefault(); if (newColor.trim()) { onAddColor(newColor); setNewColor(""); } }}><input aria-label="Yeni renk" value={newColor} onChange={(event) => setNewColor(event.target.value)} placeholder="Yeni renk adı"/><button className="button primary small" type="submit"><Icon name="plus" size={14}/> Ekle</button></form><div className="settings-list">{colors.map((color) => <div className="settings-list-row" key={color}><span>{color}</span><button className="menu-icon-button danger" aria-label={`${color} rengini sil`} onClick={() => onRemoveColor(color)}><Icon name="trash" size={14}/></button></div>)}</div></section>
    <section className="settings-section"><div className="settings-section-head"><div><div className="panel-kicker">MALZEME LİSTESİ</div><h4>{companyName} malzemeleri</h4><p>Kayıt ekranlarında bu listedeki malzemeler seçilebilir.</p></div></div><form className="settings-inline-form material-inline-form" onSubmit={(event) => { event.preventDefault(); if (newMaterial.trim()) { onAddMaterial(newMaterial, newUnit); setNewMaterial(""); } }}><input aria-label="Yeni malzeme" value={newMaterial} onChange={(event) => setNewMaterial(event.target.value)} placeholder="Yeni malzeme adı"/><input aria-label="Malzeme birimi" value={newUnit} onChange={(event) => setNewUnit(event.target.value)} placeholder="Birim"/><button className="button primary small" type="submit"><Icon name="plus" size={14}/> Ekle</button></form><div className="settings-list">{materials.length ? materials.map((material) => <div className="settings-list-row" key={material.id}><span>{material.name} <small>· {material.unit}</small></span><button className="menu-icon-button danger" aria-label={`${material.name} malzemesini sil`} onClick={() => onRemoveMaterial(material.id)}><Icon name="trash" size={14}/></button></div>) : <div className="settings-empty">Bu işletme için henüz kayıtlı malzeme yok.</div>}</div></section>
    <section className="settings-section"><div className="settings-section-head"><div><div className="panel-kicker">VERİ YÖNETİMİ</div><h4>İçe ve dışa aktarma</h4><p>Tüm kayıtları JSON yedeği olarak taşıyın.</p></div></div><div className="settings-actions data-actions"><button className="button secondary small" onClick={() => onExport("json")}><Icon name="download" size={14}/> Tam yedeği indir</button><button className="button primary small" onClick={onImport}><Icon name="upload" size={14}/> Yedek içe aktar</button><button className="button secondary small" onClick={onSignOut}><Icon name="shield" size={14}/> Oturumu kapat</button></div></section>
  </div></Modal>;
}

function LegacyEntryModal({ kind: initialKind, edit, date, onClose, onSave, paymentMethods, materials, colors = [] }) {
  const findMaterial = (name) => materials.find((material) => material.name.toLocaleLowerCase("tr-TR") === String(name || "").toLocaleLowerCase("tr-TR"));
  const materialState = (name) => { const match = findMaterial(name); return { materialId: match?.id || "__new__", materialMode: match ? "existing" : "new", materialName: match?.name || name || "", saveMaterial: false }; };
  const [form, setForm] = useState(() => {
    if (edit) {
      if (initialKind === "sales") return { kind: initialKind, id: edit.id, date: edit.date, name: edit.customer, qty: edit.qty, amount: edit.total, payment: edit.payment, invoice: edit.invoice, ...materialState(edit.product) };
      if (initialKind === "expenses") return { kind: initialKind, id: edit.id, date: edit.date, name: "", description: edit.detail, category: edit.category, amount: edit.amount, payment: edit.payment };
      if (initialKind === "production") return { kind: initialKind, id: edit.id, date: edit.date, pallets: edit.pallets, qty: edit.qty, broken: edit.broken, cement: edit.cement, remaining: edit.remaining, ...materialState(edit.product) };
      if (initialKind === "stock") return { kind: initialKind, id: edit.id, qty: edit.stock, unit: edit.unit, color: edit.color || "", ...materialState(edit.item) };
      if (initialKind === "matExpenses") return { kind: initialKind, id: edit.id, date: edit.date, color: edit.color || "", package: edit.package || "", length: edit.length || "", unitPrice: edit.unitPrice ?? "", amount: edit.total ?? "", ...materialState(edit.product) };
      if (initialKind === "workers") return { kind: initialKind, id: edit.id, name: edit.name, salary: edit.salary, advance: edit.advance, absence: edit.absence };
      if (initialKind === "debts") {
        const amounts = debtAmounts(edit);
        return { kind: initialKind, id: edit.id, date: edit.date, name: edit.creditor, description: edit.source, amount: amounts.total, paidAmount: amounts.paid, remainingAmount: amounts.remaining, debtAmountSource: hasValue(edit.remainingAmount) ? "remaining" : "paid", due: edit.due, status: edit.status };
      }
      return { kind: initialKind, id: edit.id, name: edit.creditor, description: edit.source, amount: edit.amount, due: edit.due, status: edit.status };
    }
    const firstPayment = paymentMethods[0] || "";
    return { kind: initialKind, date, name: "", description: "", category: "", amount: "", qty: "", payment: firstPayment, invoice: "", unit: "adet", pallets: "", broken: "", cement: "", remaining: "", salary: "", advance: "", absence: "", due: "Açık", status: "Yeni", ...materialState("") };
  });
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const labels = { sales: "Satış", expenses: "Gider", production: "Üretim", stock: "Stok", workers: "Çalışan", debts: "Borç" };
  const paymentOptions = paymentMethods.includes(form.payment) || !form.payment ? paymentMethods : [form.payment, ...paymentMethods];
  return <Modal title={edit ? `${labels[form.kind]} kaydını düzenle` : `Yeni ${labels[form.kind].toLowerCase()} kaydı`} onClose={onClose} wide><form className="modal-form" onSubmit={(event) => { event.preventDefault(); onSave(form); }}><div className="form-grid two"><label>Kayıt türü<select value={form.kind} disabled={Boolean(edit)} onChange={update("kind")}><option value="sales">Satış</option><option value="expenses">Gider</option><option value="matExpenses">Malzeme gideri</option><option value="production">Üretim</option><option value="stock">Stok hareketi</option><option value="workers">Çalışan</option><option value="debts">Borç</option></select></label><label>Tarih<input type="date" value={form.date || date} onChange={update("date")}/></label></div>{form.kind === "sales" && <div className="form-grid two"><label>Müşteri<input required value={form.name} onChange={update("name")} placeholder="Müşteri adı"/></label><MaterialField label="Malzeme / ürün" materials={materials} form={form} update={update}/><label>Adet<input type="number" step="any" value={form.qty} onChange={update("qty")} placeholder="0"/></label><label>Toplam tutar<input required type="number" step="0.01" value={form.amount} onChange={update("amount")} placeholder="0,00"/></label><label>Ödeme tipi<select value={form.payment} onChange={update("payment")}>{paymentOptions.map((method) => <option key={method} value={method}>{method}</option>)}</select></label><label>Fatura no<input value={form.invoice} onChange={update("invoice")} placeholder="O/000"/></label></div>}{form.kind === "expenses" && <div className="form-grid two"><label>Kategori<input required value={form.category} onChange={update("category")} placeholder="Örn. Hammadde alımı"/></label><label>Açıklama<input value={form.description} onChange={update("description")} placeholder="Gider açıklaması"/></label><label>Tutar<input required type="number" step="0.01" value={form.amount} onChange={update("amount")} placeholder="0,00"/></label><label>Ödeme tipi<select value={form.payment} onChange={update("payment")}>{paymentOptions.map((method) => <option key={method} value={method}>{method}</option>)}</select></label></div>}{form.kind === "production" && <div className="form-grid two"><MaterialField label="Üretim malzemesi / ürünü" materials={materials} form={form} update={update}/><label>Palet<input type="number" step="any" value={form.pallets} onChange={update("pallets")} placeholder="0"/></label><label>Adet<input type="number" step="any" value={form.qty} onChange={update("qty")} placeholder="0"/></label><label>Fire (adet)<input type="number" step="any" value={form.broken} onChange={update("broken")} placeholder="0"/></label><label>Kullanılan hammadde<input type="number" step="any" value={form.cement} onChange={update("cement")} placeholder="0"/></label><label>Kalan hammadde<input type="number" step="any" value={form.remaining} onChange={update("remaining")} placeholder="0"/></label></div>}{form.kind === "stock" && <div className="form-grid two"><MaterialField label="Malzeme" materials={materials} form={form} update={update}/><label>Renk<select value={form.color || ""} onChange={update("color")}>{!form.color && <option value="">Seçiniz</option>}{[...new Set([...(colors || []), form.color].filter(Boolean))].map((color) => <option key={color} value={color}>{color}</option>)}</select></label><label>Stok miktarı<input type="number" step="any" value={form.qty} onChange={update("qty")} placeholder="0"/></label><label>Birim<input value={form.unit} onChange={update("unit")} placeholder="adet"/></label></div>}{form.kind === "workers" && <div className="form-grid two"><label>Çalışan adı<input required value={form.name} onChange={update("name")} placeholder="Ad soyad"/></label><label>Maaş tutarı<input type="number" step="0.01" value={form.salary} onChange={update("salary")} placeholder="0,00"/></label><label>Avans<input type="number" step="0.01" value={form.advance} onChange={update("advance")} placeholder="0,00"/></label><label>Devamsızlık (gün)<input type="number" step="any" value={form.absence} onChange={update("absence")} placeholder="0"/></label></div>}{form.kind === "debts" && <div className="form-grid two"><label>Alacaklı<input required value={form.name} onChange={update("name")} placeholder="Alacaklı adı"/></label><label>Kaynak / açıklama<input value={form.description} onChange={update("description")} placeholder="Borç kaynağı"/></label><label>Açık bakiye<input required type="number" step="0.01" value={form.amount} onChange={update("amount")} placeholder="0,00"/></label><label>Vade<input value={form.due} onChange={update("due")} placeholder="Açık / 31 Ağu"/></label><label>Durum<select value={form.status} onChange={update("status")}><option>Yeni</option><option>Bekliyor</option><option>Yüksek</option></select></label></div>}<div className="modal-actions"><button type="button" className="button secondary" onClick={onClose}>Vazgeç</button><button className="button primary" type="submit"><Icon name="check" size={16}/> {edit ? "Değişiklikleri kaydet" : "Kaydı oluştur"}</button></div></form></Modal>;
}

function PaymentSplitFields({ isSplit, form, update }) {
  if (!isSplit) return null;
  const splitTotal = toNumber(form.cashAmount) + toNumber(form.mpesaAmount);
  const hasSplitInput = hasValue(form.cashAmount) || hasValue(form.mpesaAmount);
  const totalMatches = !hasSplitInput || !hasValue(form.amount) || Math.abs(splitTotal - toNumber(form.amount)) < 1e-9;
  return <div className="payment-split-fields">
    <div className="payment-split-heading"><strong>Ödeme dağılımı</strong><span>Nakit ve Havale / EFT tutarlarını ayrı girin.</span></div>
    <div className="form-grid two">
      <label>Nakit tutarı<input required type="number" min="0" step="any" value={form.cashAmount || ""} onChange={update("cashAmount")} placeholder="0,00"/></label>
      <label>Havale / EFT tutarı<input required type="number" min="0" step="any" value={form.mpesaAmount || ""} onChange={update("mpesaAmount")} placeholder="0,00"/></label>
    </div>
    <div className={`payment-split-total ${totalMatches ? "matched" : "unmatched"}`}>Dağılım toplamı: <strong>{amount(splitTotal)}</strong>{hasValue(form.amount) && <span> / Kayıt toplamı: {amount(form.amount)}</span>}</div>
  </div>;
}

function EntryModal({ kind: initialKind, edit, date, onClose, onSave, paymentMethods, materials, colors = [], workers = [] }) {
  const findMaterial = (name) => materials.find((material) => material.name.toLocaleLowerCase("tr-TR") === String(name || "").toLocaleLowerCase("tr-TR"));
  const materialState = (name) => { const match = findMaterial(name); return { materialId: match?.id || "__new__", materialMode: match ? "existing" : "new", materialName: match?.name || name || "", saveMaterial: false }; };
  const initialForm = () => {
    if (edit) {
      if (initialKind === "sales") {
        return { kind: initialKind, id: edit.id, date: edit.date, name: edit.customer, qty: edit.qty ?? "", amount: edit.total ?? "", amountSource: "existing", payment: edit.payment, cashAmount: edit.cashAmount ?? "", mpesaAmount: edit.mpesaAmount ?? "", invoice: edit.invoice, ...materialState(edit.product) };
      }
      if (initialKind === "expenses") return { kind: initialKind, id: edit.id, date: edit.date, name: "", description: edit.detail, category: edit.category, note: edit.note || "", workerId: edit.workerId || "", worker: edit.worker || "", amount: edit.amount ?? "", amountSource: "existing", payment: edit.payment, cashAmount: edit.cashAmount ?? "", mpesaAmount: edit.mpesaAmount ?? "" };
      if (initialKind === "production") return { kind: initialKind, id: edit.id, date: edit.date, pallets: edit.pallets, qty: edit.qty, broken: edit.broken, cement: edit.cement, remaining: edit.remaining, ...materialState(edit.product) };
      if (initialKind === "stock") return { kind: initialKind, id: edit.id, qty: edit.stock, unit: edit.unit, color: edit.color || "", ...materialState(edit.item) };
      if (initialKind === "matExpenses") return { kind: initialKind, id: edit.id, date: edit.date, color: edit.color || "", package: edit.package || "", length: edit.length || "", unitPrice: edit.unitPrice ?? "", amount: edit.total ?? "", ...materialState(edit.product) };
      if (initialKind === "workers") return { kind: initialKind, id: edit.id, name: edit.name, salary: edit.salary, advance: edit.advance, absence: edit.absence };
      if (initialKind === "debts") {
        return { kind: initialKind, id: edit.id, date: edit.date, direction: debtDirection(edit), name: edit.creditor, description: edit.source, amount: toNumber(edit.amount), due: edit.due, status: edit.status };
      }
      return { kind: initialKind, id: edit.id, name: edit.creditor, description: edit.source, amount: edit.amount, due: edit.due, status: edit.status };
    }
    const firstPayment = paymentMethods[0] || "";
    return { kind: initialKind, date, direction: "owed", name: "", description: "", category: "", note: "", color: "", package: "", length: "", unitPrice: "", amount: "", amountSource: "manual", qty: "", payment: firstPayment, cashAmount: "", mpesaAmount: "", invoice: "", unit: "adet", pallets: "", broken: "", cement: "", remaining: "", salary: "", advance: "", absence: "", due: "Açık", status: "Yeni", workerId: "", worker: "", ...materialState("") };
  };
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState("");
  const update = (key) => (event) => {
    const value = event.target.value;
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "workerId") { const picked = workers.find((item) => item.id === value); next.worker = picked ? picked.name : ""; }
      if (key === "amount") next.amountSource = "manual";
      if (isSplitPayment(next.payment) && (key === "cashAmount" || key === "mpesaAmount")) {
        const splitSum = toNumber(next.cashAmount) + toNumber(next.mpesaAmount);
        if (current.amountSource === "split" || (!hasValue(current.amount) && !hasValue(current.unitPrice))) {
          next.amount = String(splitSum);
          next.amountSource = "split";
        } else if (hasValue(next.amount)) {
          const total = toNumber(next.amount);
          if (key === "cashAmount" && hasValue(next.cashAmount)) next.mpesaAmount = String(Math.max(0, total - toNumber(next.cashAmount)));
          if (key === "mpesaAmount" && hasValue(next.mpesaAmount)) next.cashAmount = String(Math.max(0, total - toNumber(next.mpesaAmount)));
        }
      }
      if (isSplitPayment(next.payment) && key === "amount" && hasValue(next.amount)) {
        const total = toNumber(next.amount);
        if (hasValue(next.cashAmount)) next.mpesaAmount = String(Math.max(0, total - toNumber(next.cashAmount)));
        else if (hasValue(next.mpesaAmount)) next.cashAmount = String(Math.max(0, total - toNumber(next.mpesaAmount)));
      }
      return next;
    });
    setFormError("");
  };
  const labels = { sales: "Satış", expenses: "Gider", matExpenses: "Malzeme gideri", production: "Üretim", stock: "Stok", workers: "Çalışan", debts: "Borç" };
  const splitPayment = isSplitPayment(form.payment);
  const paymentOptions = paymentMethods.includes(form.payment) || !form.payment ? paymentMethods : [form.payment, ...paymentMethods];
  const submit = (event) => {
    event.preventDefault();
    if (splitPayment && Math.abs(toNumber(form.cashAmount) + toNumber(form.mpesaAmount) - toNumber(form.amount)) > 1e-9) {
      setFormError("Nakit ve Havale / EFT toplamı, kayıt toplamına eşit olmalıdır.");
      return;
    }
    onSave(form);
  };
  return <Modal title={edit ? `${labels[form.kind]} kaydını düzenle` : `Yeni ${labels[form.kind].toLowerCase()} kaydı`} onClose={onClose} wide>
    <form className="modal-form" onSubmit={submit}>
      <div className="form-grid two"><label>Kayıt türü<select value={form.kind} disabled={Boolean(edit)} onChange={update("kind")}><option value="sales">Satış</option><option value="expenses">Gider</option><option value="matExpenses">Malzeme gideri</option><option value="production">Üretim</option><option value="stock">Stok hareketi</option><option value="workers">Çalışan</option><option value="debts">Borç</option></select></label><label>Tarih<input type="date" value={form.date || date} onChange={update("date")}/></label></div>
      {form.kind === "sales" && <div className="form-grid two">
        <label>Müşteri<input required value={form.name} onChange={update("name")} placeholder="Müşteri adı"/></label>
        <MaterialField label="Malzeme / ürün" materials={materials} form={form} update={update}/>
        <label>Adet<input required type="number" min="0" step="any" value={form.qty} onChange={update("qty")} placeholder="0"/></label>
        <label>Toplam tutar<input required type="number" min="0" step="any" value={form.amount} onChange={update("amount")} placeholder="0,00"/></label>
        <label>Ödeme tipi<select value={form.payment} onChange={update("payment")}>{paymentOptions.map((method) => <option key={method} value={method}>{method}</option>)}</select></label>
        <label>Fatura no<input value={form.invoice} onChange={update("invoice")} placeholder="O/000"/></label>
        <PaymentSplitFields isSplit={splitPayment} form={form} update={update}/>
      </div>}
      {form.kind === "expenses" && <div className="form-grid two">
        <label>Kategori<input required value={form.category} onChange={update("category")} placeholder="Örn. Hammadde alımı" list="expense-category-list"/><datalist id="expense-category-list">{["Hammadde alımı", "Çalışan Ödemesi", "Taşıma", "Personel", "Enerji", "Yemek", "Bakım", "Vergi / ceza", "Genel gider"].map((item) => <option key={item} value={item}/>)}</datalist><small className="field-hint">Çalışan ödemesi için "Çalışan Ödemesi" seçin.</small></label>
        <label>Açıklama<input value={form.description} onChange={update("description")} placeholder="Gider açıklaması"/></label>
        <label>Tutar<input required type="number" min="0" step="any" value={form.amount} onChange={update("amount")} placeholder="0,00"/></label>
        {form.category === "Çalışan Ödemesi" && <label>Çalışan<select required value={form.workerId || ""} onChange={update("workerId")}>{!form.workerId && <option value="">Seçiniz</option>}{workers.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>}
        <label>Not<input value={form.note || ""} onChange={update("note")} placeholder="Ödeme notu (opsiyonel)"/></label>
        <label>Ödeme tipi<select value={form.payment} onChange={update("payment")}>{paymentOptions.map((method) => <option key={method} value={method}>{method}</option>)}</select></label>
        <PaymentSplitFields isSplit={splitPayment} form={form} update={update}/>
      </div>}
      {form.kind === "matExpenses" && <div className="form-grid two">
        <MaterialField label="Ürün cinsi" materials={materials} form={form} update={update}/>
        <label>Renk<select value={form.color || ""} onChange={update("color")}>{!form.color && <option value="">Seçiniz</option>}{[...new Set([...(colors || []), form.color].filter(Boolean))].map((color) => <option key={color} value={color}>{color}</option>)}</select></label>
        <label>Paket<input value={form.package || ""} onChange={update("package")} placeholder="Örn. 10"/></label>
        <label>Boy<input value={form.length || ""} onChange={update("length")} placeholder="Örn. 6m"/></label>
        <label>Birim fiyat<input type="number" min="0" step="any" value={form.unitPrice ?? ""} onChange={update("unitPrice")} placeholder="0,00"/></label>
        <label>Toplam tutar<input required type="number" min="0" step="any" value={form.amount} onChange={update("amount")} placeholder="0,00"/></label>
      </div>}
      {form.kind === "production" && <div className="form-grid two"><MaterialField label="Üretim malzemesi / ürünü" materials={materials} form={form} update={update}/><label>Palet<input type="number" step="any" value={form.pallets} onChange={update("pallets")} placeholder="0"/></label><label>Adet<input type="number" step="any" value={form.qty} onChange={update("qty")} placeholder="0"/></label><label>Fire (adet)<input type="number" step="any" value={form.broken} onChange={update("broken")} placeholder="0"/></label><label>Kullanılan hammadde<input type="number" step="any" value={form.cement} onChange={update("cement")} placeholder="0"/></label><label>Kalan hammadde<input type="number" step="any" value={form.remaining} onChange={update("remaining")} placeholder="0"/></label></div>}
      {form.kind === "stock" && <div className="form-grid two"><MaterialField label="Malzeme" materials={materials} form={form} update={update}/><label>Renk<select value={form.color || ""} onChange={update("color")}>{!form.color && <option value="">Seçiniz</option>}{[...new Set([...(colors || []), form.color].filter(Boolean))].map((color) => <option key={color} value={color}>{color}</option>)}</select></label><label>Stok miktarı<input type="number" step="any" value={form.qty} onChange={update("qty")} placeholder="0"/></label><label>Birim<input value={form.unit} onChange={update("unit")} placeholder="adet"/></label></div>}
      {form.kind === "workers" && <div className="form-grid two"><label>Çalışan adı<input required value={form.name} onChange={update("name")} placeholder="Ad soyad"/></label><label>Maaş tutarı<input type="number" step="any" value={form.salary} onChange={update("salary")} placeholder="0,00"/></label><label>Avans<input type="number" step="any" value={form.advance} onChange={update("advance")} placeholder="0,00"/></label><label>Devamsızlık (gün)<input type="number" step="any" value={form.absence} onChange={update("absence")} placeholder="0"/></label></div>}
      {form.kind === "debts" && <div className="form-grid two"><label>Borç türü<select value={form.direction || "owed"} onChange={update("direction")}><option value="owed">Alınan borç (biz ödeyeceğiz)</option><option value="lent">Verilen borç (tahsil edeceğiz)</option></select></label><label>{form.direction === "lent" ? "Borçlu" : "Alacaklı"}<input required value={form.name} onChange={update("name")} placeholder={form.direction === "lent" ? "Borçlu adı" : "Alacaklı adı"}/></label><label>Kaynak / açıklama<input value={form.description} onChange={update("description")} placeholder="Borç kaynağı"/></label><label>Toplam borç<input required type="number" min="0" step="any" value={form.amount} onChange={update("amount")} placeholder="0,00"/><small className="field-hint">Ödeme ve tahsilatlar, kayıt sonrası listedeki Öde / Tahsilat tuşuyla işlenir.</small></label><label>Vade<input value={form.due} onChange={update("due")} placeholder="Açık / 31 Ağu"/></label><label>Durum<select value={form.status} onChange={update("status")}><option>Yeni</option><option>Bekliyor</option><option>Yüksek</option></select></label></div>}
      {formError && <div className="form-error" role="alert">{formError}</div>}
      <div className="modal-actions"><button type="button" className="button secondary" onClick={onClose}>Vazgeç</button><button className="button primary" type="submit"><Icon name="check" size={16}/> {edit ? "Değişiklikleri kaydet" : "Kaydı oluştur"}</button></div>
    </form>
  </Modal>;
}

function SiteGate() {
  const [unlocked, setUnlocked] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const sitePassword = import.meta.env.VITE_SITE_PASSWORD || "0000";
  useEffect(() => {
    if (!supabase) { setCheckingSession(false); return undefined; }
    let active = true;
    supabase.auth.getSession().then(({ data }) => { if (active) { setUnlocked(Boolean(data.session)); setCheckingSession(false); } });
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => { if (active) setUnlocked(Boolean(session)); });
    return () => { active = false; authListener.subscription.unsubscribe(); };
  }, []);
  const unlock = async (event) => {
    event.preventDefault();
    setCheckingSession(true);
    if (supabase) {
      const { error: authError } = await supabase.auth.signInWithPassword({ email: "muhasebe@site.com", password });
      if (!authError) { setError(""); setCheckingSession(false); return; }
      setError("Parola hatalı. Tekrar deneyin.");
      setPassword("");
      setCheckingSession(false);
      return;
    }
    if (password === sitePassword) { setUnlocked(true); setError(""); } else { setPassword(""); setError("Parola hatalı. Tekrar deneyin."); }
    setCheckingSession(false);
  };
  const signOut = async () => { if (supabase) await supabase.auth.signOut(); else setUnlocked(false); };
  if (checkingSession) return <div className="app-loading"><div className="brand-mark"><img src="/ayes-logo.png" alt="AYES GROUP"/></div><strong>Erişim kontrol ediliyor</strong><span>Güvenli bağlantı hazırlanıyor...</span></div>;
  if (unlocked) return <App onSignOut={signOut} />;
  return <main className="site-gate"><section className="gate-card"><div className="brand"><div className="brand-mark"><img src="/ayes-logo.png" alt="AYES GROUP"/></div><div><strong>AYES GROUP</strong><small>muhasebe</small></div></div><div className="gate-kicker">KORUMALI ERİŞİM</div><h1>Muhasebe paneline giriş</h1><p>Devam etmek için site parolasını girin.</p><form onSubmit={unlock}><label>Site parolası<input autoFocus required type="password" autoComplete="current-password" minLength="8" value={password} onChange={(event) => { setPassword(event.target.value); setError(""); }} placeholder="Parolanızı girin" aria-label="Site parolası"/></label>{error && <div className="gate-error" role="alert">{error}</div>}<button className="button primary gate-button" type="submit"><Icon name="shield" size={16}/> Giriş yap</button></form><small className="gate-note">Yetkili muhasebe erişimi</small></section></main>;
}

createRoot(document.getElementById("root")).render(<SiteGate />);
