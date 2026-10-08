"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Save, Building2, Mail, Phone, MapPin } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { getClients, saveClient } from "@/lib/store";


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

export default function NewClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  
  const [clientId, setClientId] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState("+221");

  const [clientData, setClientData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "actif"
  });

  useEffect(() => {
    async function loadClient() {
    const id = searchParams.get('id');
    if (id) {
      setClientId(id);
      const clients = await getClients();
      const existingClient = clients.find((c: any) => c.id === id);
      if (existingClient) {
        setClientData({
          name: existingClient.name,
          email: existingClient.email,
          phone: existingClient.phone,
          address: existingClient.address,
          status: existingClient.status
        });
        
        if (existingClient.phone) {
          const match = existingClient.phone.match(/^(\+\d{1,3})/);
          if (match) setCountryCode(match[1]);
        }

        if (existingClient.createdAt) {
          const createdDate = new Date(existingClient.createdAt);
          setLastSavedAt(format(createdDate, "'le' eeee dd/MM/yyyy 'à' HH:mm", { locale: fr }));
        }
      }
    }
    }
    loadClient();
  }, [searchParams]);

  const handleSave = async () => {
    const now = new Date();
    const formattedTime = format(now, "'le' eeee dd/MM/yyyy 'à' HH:mm", { locale: fr });
    setLastSavedAt(formattedTime);
    
    await saveClient({
      id: clientId,
      ...clientData,
      totalBilled: 0,
      createdAt: now.toISOString()
    });
    
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-slate-50 flex-col font-sans">
      
      {/* HEADER */}
      <header className="flex h-16 sm:h-20 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-8">
         <div className="flex items-center gap-4">
            <Link href="/clients">
              <div className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
                 <ChevronLeft className="h-5 w-5 text-slate-600" />
              </div>
            </Link>
            <div>
              <h2 className="text-[17px] sm:text-lg font-extrabold text-slate-900 leading-tight">Nouveau Client</h2>
              {lastSavedAt ? (
                <div className="flex items-center mt-0.5 sm:mt-1 text-xs font-medium text-emerald-600">
                  <span className="mr-1.5 sm:mr-2 flex h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></span>
                  <span className="truncate">Créé {lastSavedAt}</span>
                </div>
              ) : (
                <div className="flex items-center mt-0.5 sm:mt-1 text-xs font-medium text-slate-500">
                  <span className="mr-1.5 sm:mr-2 flex h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></span>
                  <span className="truncate">Client actif</span>
                </div>
              )}
            </div>
         </div>
         <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto pb-1 md:pb-0">
            <button 
              onClick={handleSave}
              className="flex h-10 sm:h-11 items-center justify-center rounded-xl bg-[#4F46E5] px-4 sm:px-6 text-xs sm:text-sm font-bold text-white hover:bg-[#4338CA] transition-colors shadow-lg shadow-indigo-500/25 whitespace-nowrap"
            >
               <span className="hidden sm:inline">Enregistrer</span><span className="sm:hidden">Sauver</span> <Save className="ml-1.5 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            </button>
         </div>
      </header>

      {/* BODY */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden overflow-y-auto md:overflow-hidden">
        
        {/* LEFT COLUMN: FORM */}
        <div className="w-full md:w-1/2 md:overflow-y-auto px-4 py-8 sm:px-8 sm:py-10 lg:px-16 lg:py-16 bg-white shrink-0">
          <div className="max-w-[600px] mx-auto space-y-10">
             
             <div>
               <h2 className="text-[32px] sm:text-[40px] font-extrabold tracking-tight text-slate-900 leading-none">Profil du client.</h2>
               <p className="mt-4 text-[17px] text-slate-500 font-medium">Complète ou mets à jour les informations du client.</p>
             </div>

             <div className="space-y-6">
                <div className="flex flex-col gap-2.5">
                  <label className="text-[13px] font-bold text-slate-700">Nom de l'entreprise ou du client</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input 
                      value={clientData.name} 
                      onChange={e => setClientData({...clientData, name: e.target.value})}
                      className="h-11 pl-11 rounded-xl border-gray-200 text-sm font-medium text-slate-900 shadow-sm" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[13px] font-bold text-slate-700">Email de contact</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input 
                        value={clientData.email} 
                        onChange={e => setClientData({...clientData, email: e.target.value})}
                        className="h-11 pl-11 rounded-xl border-gray-200 text-sm font-medium text-slate-900 shadow-sm" 
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[13px] font-bold text-slate-700">Téléphone</label>
                    <div className="flex">
                      <Select value={countryCode} onValueChange={(val) => {
                        const safeVal = val || "";
                        setCountryCode(safeVal);
                        const stripped = clientData.phone.replace(/^\+\d+\s*/, '');
                        setClientData({...clientData, phone: formatPhone(safeVal + stripped)});
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
                        value={clientData.phone.replace(countryCode, '').trim()} 
                        onChange={e => {
                          const rawInput = e.target.value.replace(/[^\d]/g, '');
                          setClientData({...clientData, phone: formatPhone(countryCode + rawInput)});
                        }}
                        className="h-11 rounded-l-none rounded-r-xl border-gray-200 text-sm font-medium text-slate-900 shadow-sm flex-1" 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <label className="text-[13px] font-bold text-slate-700">Statut</label>
                  <Select value={clientData.status} onValueChange={(val) => setClientData({...clientData, status: val || 'actif'})}>
                    <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-white font-medium text-slate-900 shadow-sm hover:bg-slate-50 focus:bg-slate-900 focus:text-white transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                      <SelectItem value="actif" className="font-medium cursor-pointer">Actif</SelectItem>
                      <SelectItem value="inactif" className="font-medium cursor-pointer text-gray-500">Inactif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2.5">
                  <label className="text-[13px] font-bold text-slate-700">Adresse de facturation</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                    <textarea 
                      value={clientData.address}
                      onChange={e => setClientData({...clientData, address: e.target.value})}
                      rows={3}
                      className="w-full resize-none rounded-xl border border-gray-200 p-4 pl-11 text-sm font-medium text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

             </div>

          </div>
        </div>

        {/* RIGHT COLUMN: PREVIEW (Optional or Summary) */}
        <div className="hidden md:flex w-1/2 bg-slate-50 items-center justify-center p-8 lg:p-16 relative">
           <div className="absolute inset-0 opacity-40 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
           
           <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 sm:p-10 relative z-10 border border-slate-100 flex flex-col items-center text-center">
             <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center mb-6">
                <Building2 className="w-10 h-10 text-indigo-600" />
             </div>
             <h3 className="text-2xl font-black text-slate-900 mb-2">{clientData.name || "Nouveau Client"}</h3>
             <div className={`px-3 py-1 rounded-full text-xs font-bold mb-3 ${clientData.status === 'actif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
               {clientData.status === 'actif' ? 'Actif' : 'Inactif'}
             </div>
             {lastSavedAt && (
               <div className="text-xs font-medium text-slate-400 mb-6 font-mono">
                 Créé {lastSavedAt}
               </div>
             )}
             <div className="w-full space-y-4 text-left border-t border-slate-100 pt-6">
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-medium">{clientData.email || "—"}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-medium">{clientData.phone || "—"}</span>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium whitespace-pre-wrap">{clientData.address || "—"}</span>
                </div>
             </div>
           </div>
        </div>

      </div>

      {/* SUCCESS MODAL */}
      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent className="bg-white rounded-2xl p-6 border-0 shadow-2xl max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-900 text-center">
              Client enregistré avec succès !
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 text-center mt-2">
              Les informations du client ont été mises à jour.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 sm:justify-center flex-col sm:flex-row gap-3">
            <AlertDialogAction onClick={() => router.push('/clients')} className="rounded-xl font-bold bg-[#4F46E5] text-white hover:bg-[#4338CA] border-0 w-full sm:w-auto px-8">
              Retour aux clients
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
