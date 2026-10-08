"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getSettings, saveInvoice, getInvoices, getClients, saveClient } from "@/lib/store";
import Link from "next/link";
import { 
  ChevronLeft, 
  Save,
  Download,
  Send,
  Plus,
  Trash2,
  Calendar as CalendarIcon
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const formatFCFA = (amount: number) => {
  return new Intl.NumberFormat('fr-SN', { 
    style: 'currency', 
    currency: 'XOF',
    maximumFractionDigits: 0
  }).format(amount).replace("XOF", "F CFA");
};

type InvoiceLine = {
  id: string;
  description: string;
  quantity: number | string;
  unitPrice: number | string;
};


const africanCountries = [
  { code: "+20", country: "Égypte" },
  { code: "+27", country: "Afrique du Sud" },
  { code: "+212", country: "Maroc" },
  { code: "+213", country: "Algérie" },
  { code: "+216", country: "Tunisie" },
  { code: "+220", country: "Gambie" },
  { code: "+221", country: "Sénégal" },
  { code: "+222", country: "Mauritanie" },
  { code: "+223", country: "Mali" },
  { code: "+224", country: "Guinée" },
  { code: "+225", country: "Côte d'Ivoire" },
  { code: "+226", country: "Burkina Faso" },
  { code: "+227", country: "Niger" },
  { code: "+228", country: "Togo" },
  { code: "+229", country: "Bénin" },
  { code: "+230", country: "Maurice" },
  { code: "+231", country: "Libéria" },
  { code: "+232", country: "Sierra Leone" },
  { code: "+233", country: "Ghana" },
  { code: "+234", country: "Nigeria" },
  { code: "+235", country: "Tchad" },
  { code: "+236", country: "RCA" },
  { code: "+237", country: "Cameroun" },
  { code: "+238", country: "Cap-Vert" },
  { code: "+241", country: "Gabon" },
  { code: "+242", country: "Congo" },
  { code: "+243", country: "RDC" },
  { code: "+244", country: "Angola" },
  { code: "+250", country: "Rwanda" },
  { code: "+253", country: "Djibouti" },
  { code: "+254", country: "Kenya" },
  { code: "+255", country: "Tanzanie" },
  { code: "+256", country: "Ouganda" },
  { code: "+257", country: "Burundi" },
  { code: "+261", country: "Madagascar" },
  { code: "+269", country: "Comores" },
].sort((a, b) => a.country.localeCompare(b.country));

const formatPhone = (value: string) => {
  let val = value.replace(/[^\d+]/g, '');
  if (val.indexOf('+') > 0) {
    val = '+' + val.replace(/\+/g, '');
  }
  const match = val.match(/^(\+\d{1,3})(.*)$/);
  if (match) {
    const code = match[1];
    let rest = match[2];
    
    if (code === '+221' || code === '+223' || code === '+224' || code === '+228') {
      if (rest.length > 0) rest = rest.substring(0, 2) + (rest.length > 2 ? ' ' + rest.substring(2, 5) : '') + (rest.length > 5 ? ' ' + rest.substring(5, 7) : '') + (rest.length > 7 ? ' ' + rest.substring(7, 9) : '') + (rest.length > 9 ? rest.substring(9) : '');
    } else if (code === '+225' || code === '+229') {
      rest = rest.replace(/(\d{2})(?=\d)/g, '$1 ');
    } else {
      rest = rest.replace(/(\d{3})(?=\d)/g, '$1 ');
    }
    return `${code} ${rest}`.trim();
  }
  return val.replace(/(\d{2})(?=\d)/g, '$1 ');
};

export default function NewInvoicePage() {
  // State
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [status, setStatus] = useState("brouillon");
  const [issueDate, setIssueDate] = useState<Date | undefined>(new Date());
  const [issueDateOpen, setIssueDateOpen] = useState(false);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [dueDateOpen, setDueDateOpen] = useState(false);
  const [currency, setCurrency] = useState("fcfa");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  
  const [clientName, setClientName] = useState("");
  const [newClientName, setNewClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+221");
  const [clientAddress, setClientAddress] = useState("");
  
  const [lines, setLines] = useState<InvoiceLine[]>([
    { id: "1", description: "", quantity: "", unitPrice: "" }
  ]);
  
  const [hasTva, setHasTva] = useState(true);
  const [paymentNote, setPaymentNote] = useState("Paiement par virement bancaire ou Mobile Money sous 14 jours.\nMerci pour votre confiance.");

  const [settings, setSettings] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState<any[]>([]);

  const searchParams = useSearchParams();

  useEffect(() => {
    async function loadData() {
      setSettings(await getSettings());
      const fetchedClients = await getClients();
      setClients(fetchedClients);

      const id = searchParams.get('id');
      if (id) {
        const invoices = await getInvoices();
        const existingInvoice = invoices.find((inv: any) => inv.id === id);
        if (existingInvoice) {
          setInvoiceNumber(existingInvoice.id);
          setClientName(existingInvoice.client);
          if (existingInvoice.status) setStatus(existingInvoice.status);
          if (existingInvoice.createdAt) {
            const createdDate = new Date(existingInvoice.createdAt);
            setLastSavedAt(format(createdDate, "'le' eeee dd/MM/yyyy 'à' HH:mm", { locale: fr }));
          }
        }
      }
    }
    loadData();
  }, [searchParams]);

  // When clientName changes, automatically update the client's address/contact if found in clients
  useEffect(() => {
    if (clientName && clientName !== "Nouveau client...") {
       const selectedClient = clients.find(c => c.name === clientName);
       if (selectedClient) {
         setClientEmail(selectedClient.email || "");
         setClientPhone(selectedClient.phone || "");
         setClientAddress(selectedClient.address || "");
       }
    }
  }, [clientName, clients]);

  // Logic
  const addLine = () => {
    setLines([...lines, { id: Date.now().toString(), description: "", quantity: "", unitPrice: "" }]);
  };

  const removeLine = (id: string) => {
    if (lines.length > 1) {
      setLines(lines.filter(line => line.id !== id));
    } else {
      setLines([{ id: Date.now().toString(), description: "", quantity: "", unitPrice: "" }]);
    }
  };

  const updateLine = (id: string, field: keyof InvoiceLine, value: string | number) => {
    setLines(lines.map(line => {
      if (line.id === id) return { ...line, [field]: value };
      return line;
    }));
  };

  const finalClientName = clientName === "Nouveau client..." ? newClientName : clientName;


  const downloadPDF = async () => {
    window.print();
  };

  const handleSaveInvoice = async () => {
    const now = new Date();
    const formattedTime = format(now, "'le' eeee dd/MM/yyyy 'à' HH:mm", { locale: fr });
    setLastSavedAt(formattedTime);

    if (clientName === "Nouveau client..." && newClientName.trim()) {
      await saveClient({
        id: "client-" + Date.now(),
        name: newClientName,
        email: clientEmail,
        phone: clientPhone,
        address: clientAddress,
        totalBilled: 0,
        createdAt: now.toISOString()
      });
    }

    await saveInvoice({
      id: invoiceNumber,
      client: finalClientName,
      date: issueDate ? format(issueDate, "dd/MM/yyyy") : "",
      dueDate: dueDate ? format(dueDate, "dd/MM/yyyy") : "",
      amount: total,
      status: status,
      items: lines,
      createdAt: now.toISOString()
    });
    setIsModalOpen(true);
  };

  const subtotal = lines.reduce((acc, line) => acc + (Number(line.quantity || 0) * Number(line.unitPrice || 0)), 0);
  const tvaAmount = hasTva ? subtotal * 0.18 : 0;
  const total = subtotal + tvaAmount;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white text-slate-900 font-sans">
      {/* HEADER */}
      <header className="flex h-auto min-h-[88px] shrink-0 flex-col md:flex-row items-center justify-between border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 gap-4 bg-white z-10 relative print:hidden">
         <div className="flex items-center gap-3 sm:gap-5 w-full md:w-auto">
            <Link href="/factures" className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl border border-gray-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-[22px] font-extrabold tracking-tight text-slate-900 truncate">Nouvelle facture</h1>
              {lastSavedAt && (
                <div className="flex items-center text-xs sm:text-[13px] font-semibold text-emerald-600 mt-0.5">
                  <span className="mr-1.5 sm:mr-2 flex h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></span>
                  <span className="truncate">Créée {lastSavedAt}</span>
                </div>
              )}
            </div>
         </div>
         <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
            <button onClick={handleSaveInvoice} className="flex h-10 sm:h-11 items-center justify-center rounded-xl border border-gray-200 px-3 sm:px-5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm whitespace-nowrap">
               <Save className="mr-1.5 sm:mr-2 h-4 w-4" /> <span className="hidden sm:inline">Enregistrer</span><span className="sm:hidden">Sauver</span>
            </button>
            <button onClick={downloadPDF} className="flex h-10 sm:h-11 items-center justify-center rounded-xl border border-gray-200 px-3 sm:px-5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm whitespace-nowrap">
               <Download className="mr-1.5 sm:mr-2 h-4 w-4" /> <span className="hidden sm:inline">Télécharger PDF</span><span className="sm:hidden">PDF</span>
            </button>
            <button 
              onClick={handleSaveInvoice}
              className="flex h-10 sm:h-11 items-center justify-center rounded-xl bg-[#4F46E5] px-4 sm:px-6 text-xs sm:text-sm font-bold text-white hover:bg-[#4338CA] transition-colors shadow-lg shadow-indigo-500/25 whitespace-nowrap"
            >
               <span className="hidden sm:inline">Créer la facture</span><span className="sm:hidden">Créer</span> <Send className="ml-1.5 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            </button>
         </div>
      </header>

      {/* BODY */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden overflow-y-auto md:overflow-hidden">
        
        {/* LEFT COLUMN: FORM */}
        <div className="w-full md:w-1/2 md:overflow-y-auto px-4 py-8 sm:px-8 sm:py-10 lg:px-16 lg:py-16 bg-white shrink-0 print:hidden">
          <div className="max-w-[600px] mx-auto">
             <h2 className="text-[40px] font-extrabold tracking-tight text-slate-900 leading-none">Créons ta facture.</h2>
             <p className="mt-4 text-[17px] text-slate-500 font-medium">Complète les informations ci-dessous. L&apos;aperçu se met à jour automatiquement.</p>
             
             {/* PROGRESS BAR */}
             <div className="mt-8 h-1.5 w-full overflow-hidden rounded-full bg-indigo-50">
               <div className="h-full w-1/4 bg-[#4F46E5] rounded-full transition-all duration-500"></div>
             </div>

             <div className="mt-16 space-y-16">
                
                {/* SECTION 1 */}
                <section>
                  <div className="flex items-start gap-4 mb-8">
                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#4F46E5] font-black text-sm">01</div>
                     <div className="pt-1">
                       <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Informations de la facture</h3>
                       <p className="text-sm font-medium text-slate-500 mt-1">Numéro et dates du document</p>
                     </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 sm:gap-y-8">
                    <div className="flex flex-col gap-2.5">
                      <label className="text-[13px] font-bold text-slate-700">Numéro de facture</label>
                      <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="h-11 rounded-2xl border-gray-200 text-sm font-medium text-slate-900 shadow-sm" />
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <label className="text-[13px] font-bold text-slate-700">Date d&apos;émission</label>
                      <Popover open={issueDateOpen} onOpenChange={setIssueDateOpen}>
                        <PopoverTrigger render={
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full h-11 rounded-2xl border-gray-200 text-sm font-medium shadow-sm justify-start text-left font-normal",
                              !issueDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {issueDate ? format(issueDate, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                          </Button>
                        } />
                        <PopoverContent className="w-auto p-0 z-50 bg-white rounded-xl border border-gray-200 shadow-xl">
                          <Calendar
                            mode="single"
                            selected={issueDate}
                            onSelect={(date) => { setIssueDate(date); setIssueDateOpen(false); }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <label className="text-[13px] font-bold text-slate-700">Date d&apos;échéance</label>
                      <Popover open={dueDateOpen} onOpenChange={setDueDateOpen}>
                        <PopoverTrigger render={
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full h-11 rounded-2xl border-gray-200 text-sm font-medium shadow-sm justify-start text-left font-normal",
                              !dueDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dueDate ? format(dueDate, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                          </Button>
                        } />
                        <PopoverContent className="w-auto p-0 z-50 bg-white rounded-xl border border-gray-200 shadow-xl">
                          <Calendar
                            mode="single"
                            selected={dueDate}
                            onSelect={(date) => { setDueDate(date); setDueDateOpen(false); }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <label className="text-[13px] font-bold text-slate-700">Devise</label>
                      <Select value={currency} onValueChange={(val) => setCurrency(val || 'fcfa')}>
                         <SelectTrigger className="h-11 rounded-2xl border-gray-200 text-sm font-medium text-slate-900 shadow-sm">
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="fcfa">FCFA — Franc CFA</SelectItem>
                           <SelectItem value="eur">EUR — Euro</SelectItem>
                         </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <label className="text-[13px] font-bold text-slate-700">Statut de la facture</label>
                      <Select value={status} onValueChange={(val) => setStatus(val || 'brouillon')}>
                        <SelectTrigger className="h-11 rounded-2xl border-gray-200 text-sm font-medium shadow-sm w-full">
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                          <SelectItem value="brouillon" className="font-medium">Brouillon</SelectItem>
                          <SelectItem value="envoyée" className="font-medium text-blue-600 focus:text-blue-600">Envoyée</SelectItem>
                          <SelectItem value="payée" className="font-medium text-green-600 focus:text-green-600">Payée</SelectItem>
                          <SelectItem value="en retard" className="font-medium text-red-600 focus:text-red-600">En retard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </section>

                <hr className="border-gray-100" />

                {/* SECTION 2 */}
                <section>
                  <div className="flex items-start gap-4 mb-8">
                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#4F46E5] font-black text-sm">02</div>
                     <div className="pt-1">
                       <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Ton client</h3>
                       <p className="text-sm font-medium text-slate-500 mt-1">À qui adresses-tu cette facture ?</p>
                     </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 sm:gap-y-8">
                    <div className="col-span-1 sm:col-span-2 flex flex-col gap-2.5">
                      <label className="text-[13px] font-bold text-slate-700">Sélectionner un client (ou nouveau)</label>
                      <Select value={clientName} onValueChange={(val) => val && setClientName(val)}>
                         <SelectTrigger className="h-11 rounded-2xl border-gray-200 text-sm font-medium text-slate-900 shadow-sm">
                           <SelectValue placeholder="Choisir un client..." />
                         </SelectTrigger>
                         <SelectContent>
                           {clients.map(c => (
                             <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                           ))}
                           <SelectItem value="Nouveau client...">+ Nouveau client...</SelectItem>
                         </SelectContent>
                      </Select>
                      
                      {clientName === "Nouveau client..." && (
                        <div className="pt-3 space-y-3 animate-in slide-in-from-top-2 fade-in duration-300">
                          <label className="text-[13px] font-bold text-slate-700">Nom du nouveau client</label>
                          <Input 
                            placeholder="Saisir le nom du client..."
                            value={newClientName} 
                            onChange={(e) => setNewClientName(e.target.value)} 
                            className="h-11 rounded-2xl border-gray-200 text-sm font-medium text-slate-900 shadow-sm" 
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <label className="text-[13px] font-bold text-slate-700">Adresse e-mail</label>
                      <Input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} className="h-11 rounded-2xl border-gray-200 text-sm font-medium text-slate-900 shadow-sm" />
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <label className="text-[13px] font-bold text-slate-700">Téléphone</label>
                      <div className="flex">
                        <Select value={countryCode} onValueChange={(val) => {
                          const newCode = val || '';
                          setCountryCode(newCode);
                          const stripped = clientPhone.replace(/^\+\d+\s*/, '');
                          setClientPhone(formatPhone(newCode + stripped));
                        }}>
                          <SelectTrigger className="w-[110px] h-11 rounded-l-xl rounded-r-none border-r-0 focus:ring-0 shadow-sm bg-gray-50 border-gray-200 truncate pr-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px] rounded-xl border-gray-100 shadow-xl">
                            {africanCountries.map(c => (
                              <SelectItem key={c.code} value={c.code} className="font-medium cursor-pointer">
                                {c.code} <span className="text-gray-500 text-xs ml-1">{c.country}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input 
                          value={clientPhone.replace(countryCode, '').trim()} 
                          onChange={e => {
                            const rawInput = e.target.value.replace(/[^\d]/g, '');
                            setClientPhone(formatPhone(countryCode + rawInput));
                          }}
                          className="h-11 rounded-l-none rounded-r-xl border-gray-200 text-sm font-medium text-slate-900 shadow-sm flex-1" 
                        />
                      </div>
                    </div>
                    <div className="col-span-1 sm:col-span-2 flex flex-col gap-2.5">
                      <label className="text-[13px] font-bold text-slate-700">Adresse</label>
                      <textarea 
                        className="w-full rounded-2xl border border-gray-200 p-4 text-sm font-medium text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none" 
                        rows={3} 
                        value={clientAddress}
                        onChange={(e) => setClientAddress(e.target.value)}
                      />
                    </div>
                  </div>
                </section>

                <hr className="border-gray-100" />

                {/* SECTION 3 */}
                <section>
                  <div className="flex items-start gap-4 mb-8">
                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#4F46E5] font-black text-sm">03</div>
                     <div className="pt-1">
                       <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Prestations facturées</h3>
                       <p className="text-sm font-medium text-slate-500 mt-1">Ajoute les produits ou services vendus</p>
                     </div>
                  </div>
                  
                  <div className="rounded-3xl border border-gray-100 bg-slate-50/50 p-4 sm:p-6 space-y-4">
                    {lines.map((line, index) => (
                      <div key={line.id} className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                        <div className="w-full sm:flex-1 space-y-2">
                          <label className={`text-[11px] font-extrabold uppercase tracking-widest text-slate-600 ${index !== 0 ? 'sm:hidden' : ''}`}>Description</label>
                          <Input value={line.description} onChange={(e) => updateLine(line.id, 'description', e.target.value)} className="h-11 rounded-xl border-gray-200 text-sm font-medium text-slate-900 bg-white shadow-sm" />
                        </div>
                        <div className="flex gap-4 w-full sm:w-auto">
                          <div className="flex-1 sm:w-24 space-y-2 shrink-0">
                            <label className={`text-[11px] font-extrabold uppercase tracking-widest text-slate-600 ${index !== 0 ? 'sm:hidden' : ''}`}>Qté</label>
                            <Input type="number" min="1" value={line.quantity} onChange={(e) => updateLine(line.id, 'quantity', e.target.value === '' ? '' : (parseFloat(e.target.value) || 0))} className="h-11 rounded-xl border-gray-200 text-sm font-medium text-slate-900 text-center bg-white shadow-sm" />
                          </div>
                          <div className="flex-1 sm:w-[140px] lg:w-[180px] space-y-2 shrink-0">
                            <label className={`text-[11px] font-extrabold uppercase tracking-widest text-slate-600 ${index !== 0 ? 'sm:hidden' : ''}`}>Prix unitaire</label>
                            <Input type="number" min="0" value={line.unitPrice} onChange={(e) => updateLine(line.id, 'unitPrice', e.target.value === '' ? '' : (parseFloat(e.target.value) || 0))} className="h-11 rounded-xl border-gray-200 text-sm font-medium text-slate-900 bg-white shadow-sm" />
                          </div>
                          <button onClick={() => removeLine(line.id)} className={`h-11 w-[52px] shrink-0 rounded-xl bg-white border border-gray-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center shadow-sm disabled:opacity-50 ${index === 0 ? 'mt-6 sm:mt-0' : ''}`}>
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button onClick={addLine} className="mt-6 flex items-center text-sm font-bold text-[#4F46E5] hover:text-[#4338CA] transition-colors">
                    <span className="mr-3 flex h-7 w-7 items-center justify-center rounded-[8px] border border-indigo-200 bg-indigo-50">
                      <Plus className="h-4 w-4" />
                    </span>
                    Ajouter une ligne
                  </button>
                </section>

                <hr className="border-gray-100" />

                {/* SECTION 4 */}
                <section className="pb-24">
                  <div className="flex items-start gap-4 mb-8">
                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#4F46E5] font-black text-sm">04</div>
                     <div className="pt-1">
                       <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Taxes et conditions</h3>
                       <p className="text-sm font-medium text-slate-500 mt-1">Les derniers détails avant l'envoi</p>
                     </div>
                  </div>
                  
                  <div className="space-y-8">
                    <div 
                      className="flex items-center justify-between rounded-3xl border border-gray-100 bg-white p-6 shadow-sm cursor-pointer"
                      onClick={() => setHasTva(!hasTva)}
                    >
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">TVA à 18 %</h4>
                        <p className="text-[14px] font-medium text-slate-500 mt-1">Calculée automatiquement sur le sous-total</p>
                      </div>
                      <div className={`h-[34px] w-[60px] rounded-full p-1 flex transition-colors duration-300 ${hasTva ? 'bg-[#4F46E5] justify-end' : 'bg-gray-200 justify-start'}`}>
                        <div className="h-[26px] w-[26px] rounded-full bg-white shadow-sm"></div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      <label className="text-[13px] font-bold text-slate-700">Note de paiement</label>
                      <textarea 
                        className="w-full rounded-2xl border border-gray-200 p-4 text-sm font-medium text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none" 
                        rows={3} 
                        value={paymentNote}
                        onChange={(e) => setPaymentNote(e.target.value)}
                      />
                    </div>
                  </div>
                </section>

             </div>
          </div>
        </div>
        
        {/* RIGHT COLUMN: PREVIEW */}
        <div className="w-full md:w-1/2 bg-slate-50 border-t md:border-t-0 md:border-l border-gray-200 p-4 py-12 sm:p-8 lg:p-12 md:overflow-y-auto shrink-0 print:w-full print:border-none print:p-0 print:bg-white print:overflow-visible">
           {/* INVOICE PAPER */}
           <div id="invoice-preview" className="mx-auto w-full max-w-[700px] bg-white shadow-xl shadow-slate-200/50 min-h-[900px] p-6 sm:p-12 lg:p-16 flex flex-col relative rounded-sm print:shadow-none print:max-w-none print:min-h-0 print:m-0 print:p-0">
              
              <div className="flex flex-col sm:flex-row print:flex-row justify-between items-start mb-12 sm:mb-20 print:mb-12 gap-6">
                 <div className="flex items-center gap-4 sm:gap-5 print:gap-4">
                    <div className="h-12 w-12 sm:h-16 sm:w-16 shrink-0 rounded-xl sm:rounded-[18px] overflow-hidden border border-slate-100 shadow-sm print:h-14 print:w-14">
                      <img src="/logo.jpg" alt="Rose Facture" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight whitespace-nowrap">Rose Facture</h2>
                      <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5 whitespace-nowrap">Facturation Professionnelle</p>
                    </div>
                 </div>
                 <div className="text-left sm:text-right">
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#4F46E5]">FACTURE</h1>
                    <p className="text-xs sm:text-sm font-bold text-slate-400 font-mono mt-1 sm:mt-2">#{invoiceNumber}</p>
                 </div>
              </div>

              <div className="h-1 w-full bg-slate-100 rounded-full mb-12 sm:mb-16 overflow-hidden">
                <div className="h-full bg-[#4F46E5] w-1/4 rounded-full"></div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between mb-12 sm:mb-16 gap-8">
                 <div>
                   <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-3 sm:mb-4">Émetteur</p>
                   <h3 className="text-[14px] sm:text-sm font-bold text-slate-900">{settings?.legalName || "—"}</h3>
                   <div className="text-[13px] text-slate-500 mt-2 leading-relaxed whitespace-pre-wrap">
                     {settings?.address}<br/>
                     NINEA : {settings?.ninea}
                   </div>
                 </div>
                 <div className="w-full sm:w-1/2 sm:max-w-[250px]">
                   <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-3 sm:mb-4">Facturé à</p>
                   <h3 className="text-[14px] sm:text-sm font-bold text-slate-900">{finalClientName || "—"}</h3>
                   <div className="text-[13px] text-slate-500 mt-2 leading-relaxed whitespace-pre-wrap">
                     {clientAddress || "—"}
                   </div>
                 </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row justify-between mb-12 sm:mb-16 gap-4">
                 <div>
                   <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Date d&apos;émission</p>
                   <p className="text-[13px] font-bold text-slate-900 font-mono">
                     {issueDate ? format(issueDate, "dd MMM yyyy", { locale: fr }).toUpperCase() : "—"}
                   </p>
                 </div>
                 <div className="text-left sm:text-center">
                   <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Heure de création</p>
                   <p className="text-[13px] font-bold text-slate-900 font-mono">
                     {lastSavedAt ? (lastSavedAt.includes('à') ? lastSavedAt.split('à')[1].trim() : "—") : "—"}
                   </p>
                 </div>
                 <div className="text-left sm:text-right">
                   <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Date d&apos;échéance</p>
                   <p className="text-[13px] font-bold text-slate-900 font-mono">
                     {dueDate ? format(dueDate, "dd MMM yyyy", { locale: fr }).toUpperCase() : "—"}
                   </p>
                 </div>
              </div>

              <div className="flex-1 overflow-x-auto pb-4">
                 <table className="w-full text-left border-collapse min-w-[400px]">
                    <thead>
                      <tr className="border-b-2 border-slate-100">
                        <th className="py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Description</th>
                        <th className="py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center">Qté</th>
                        <th className="py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-right">Prix Unit.</th>
                        <th className="py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lines.map((line, i) => (
                        <tr key={i} className="border-b border-slate-50">
                          <td className="py-5 text-[14px] font-bold text-slate-900">{line.description || "—"}</td>
                          <td className="py-5 text-[14px] font-medium text-slate-500 text-center">{line.quantity}</td>
                          <td className="py-5 text-[14px] font-medium text-slate-500 text-right">{formatFCFA(Number(line.unitPrice))}</td>
                          <td className="py-5 text-[14px] font-bold text-slate-900 text-right">{formatFCFA(Number(line.quantity) * Number(line.unitPrice))}</td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
              </div>

              <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row justify-end items-end sm:items-start gap-4">
                 <div className="w-full sm:w-1/2 sm:max-w-[280px] self-end shrink-0">
                    <div className="flex justify-between py-3 border-b border-slate-100 text-[14px]">
                       <span className="font-bold text-slate-500">Sous-total</span>
                       <span className="font-bold text-slate-900 whitespace-nowrap">{formatFCFA(subtotal)}</span>
                    </div>
                    {hasTva && (
                      <div className="flex justify-between py-3 border-b border-slate-100 text-[14px]">
                         <span className="font-bold text-slate-500">TVA (18%)</span>
                         <span className="font-bold text-slate-900 whitespace-nowrap">{formatFCFA(tvaAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-4 text-[18px]">
                       <span className="font-black text-slate-900">Total TTC</span>
                       <span className="font-black text-[#4F46E5] whitespace-nowrap">{formatFCFA(total)}</span>
                    </div>
                 </div>
              </div>

              {paymentNote && (
                <div className="mt-8 pt-8 border-t border-slate-100 break-words">
                   <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-3">Note de paiement</p>
                   <p className="text-[13px] font-medium text-slate-500 leading-relaxed whitespace-pre-wrap">{paymentNote}</p>
                </div>
              )}

           </div>
        </div>

      </div>

      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent className="bg-white rounded-2xl p-6 border-0 shadow-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-900">Facture créée avec succès !</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 text-sm leading-relaxed mt-2">
              Votre facture a bien été enregistrée {lastSavedAt ? lastSavedAt : ""}. Souhaitez-vous la télécharger maintenant ou retourner à la liste ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3 sm:gap-0">
            <Link href="/factures" className="w-full sm:w-auto">
              <AlertDialogCancel className="w-full rounded-xl font-bold border-gray-200 text-gray-700 hover:bg-gray-50 sm:mr-3">
                Retour aux factures
              </AlertDialogCancel>
            </Link>
            <AlertDialogAction onClick={() => { downloadPDF(); setIsModalOpen(false); }} className="rounded-xl font-bold bg-[#4F46E5] text-white hover:bg-[#4338CA] border-0">
              <Download className="w-4 h-4 mr-2" />
              Télécharger PDF
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
