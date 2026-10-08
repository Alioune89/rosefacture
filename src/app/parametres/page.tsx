"use client";

import { User, Bell, Shield, Wallet, Building2, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { getSettings, saveSettings } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
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
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ParametresPage() {
  const [activeTab, setActiveTab] = useState("entreprise");
  const [settings, setSettings] = useState({
    legalName: "",
    ninea: "",
    rc: "",
    address: "",
    email: "",
    phone: ""
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    async function loadData() {
      setSettings(await getSettings());
    }
    loadData();
  }, []);

  const handleSave = async () => {
    await saveSettings(settings);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Paramètres</h1>
          <p className="text-sm sm:text-base text-gray-500 font-medium mt-1">Gérez vos préférences et paramètres de facturation.</p>
        </div>
        <Button 
          onClick={handleSave}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm transition-all active:scale-[0.98] h-11 px-6"
        >
          <Save className="w-5 h-5 mr-2" />
          Enregistrer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Navigation Mobile */}
        <div className="md:hidden col-span-1">
          <Select value={activeTab} onValueChange={(val) => val && setActiveTab(val)}>
            <SelectTrigger className="w-full h-12 rounded-xl bg-white border-gray-200 font-bold text-gray-900 shadow-sm">
              <SelectValue placeholder="Choisir une section" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="entreprise">Mon Entreprise</SelectItem>
              <SelectItem value="profil">Profil Utilisateur</SelectItem>
              <SelectItem value="banque">Coordonnées Bancaires</SelectItem>
              <SelectItem value="notifications">Notifications</SelectItem>
              <SelectItem value="securite">Sécurité</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Navigation Desktop */}
        <div className="hidden md:flex flex-col md:col-span-4 space-y-2">
          <button 
            onClick={() => setActiveTab("entreprise")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'entreprise' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <Building2 className={`w-5 h-5 ${activeTab === 'entreprise' ? '' : 'text-gray-400'}`} />
            Mon Entreprise
          </button>
          <button 
            onClick={() => setActiveTab("profil")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'profil' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <User className={`w-5 h-5 ${activeTab === 'profil' ? '' : 'text-gray-400'}`} />
            Profil Utilisateur
          </button>
          <button 
            onClick={() => setActiveTab("banque")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'banque' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <Wallet className={`w-5 h-5 ${activeTab === 'banque' ? '' : 'text-gray-400'}`} />
            Coordonnées Bancaires
          </button>
          <button 
            onClick={() => setActiveTab("notifications")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'notifications' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <Bell className={`w-5 h-5 ${activeTab === 'notifications' ? '' : 'text-gray-400'}`} />
            Notifications
          </button>
          <button 
            onClick={() => setActiveTab("securite")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'securite' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <Shield className={`w-5 h-5 ${activeTab === 'securite' ? '' : 'text-gray-400'}`} />
            Sécurité
          </button>
        </div>

        {/* Contenu des paramètres (Right Column) */}
        <div className="md:col-span-8 space-y-6">
          {activeTab === "entreprise" && (
            <>
              <Card className="rounded-2xl border-gray-200 shadow-sm bg-white animate-in fade-in slide-in-from-bottom-4 fill-mode-both delay-100">
                <CardHeader className="pt-6 px-6 pb-4 border-b border-gray-100">
                  <CardTitle className="text-lg text-gray-800 font-semibold">Informations de l'entreprise</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-gray-700">Nom de l'entreprise</label>
                      <Input 
                        value={settings.legalName} 
                        onChange={e => setSettings({...settings, legalName: e.target.value})}
                        className="h-11 rounded-xl border-gray-200 text-gray-900 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-gray-700">NINEA</label>
                      <Input 
                        value={settings.ninea} 
                        onChange={e => setSettings({...settings, ninea: e.target.value})}
                        className="h-11 rounded-xl border-gray-200 text-gray-900 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" 
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700">Adresse complète</label>
                    <Input 
                      value={settings.address} 
                      onChange={e => setSettings({...settings, address: e.target.value})}
                      className="h-11 rounded-xl border-gray-200 text-gray-900 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" 
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-gray-700">Email professionnel</label>
                      <Input 
                        value={settings.email} 
                        onChange={e => setSettings({...settings, email: e.target.value})}
                        className="h-11 rounded-xl border-gray-200 text-gray-900 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-gray-700">Téléphone</label>
                      <Input 
                        value={settings.phone} 
                        onChange={e => setSettings({...settings, phone: e.target.value})}
                        className="h-11 rounded-xl border-gray-200 text-gray-900 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-gray-200 shadow-sm bg-white animate-in fade-in slide-in-from-bottom-4 fill-mode-both delay-200">
                <CardHeader className="pt-6 px-6 pb-4 border-b border-gray-100">
                  <CardTitle className="text-lg text-gray-800 font-semibold">Identité visuelle</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="w-24 h-24 rounded-2xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
                      <span className="text-3xl font-extrabold text-white">AA</span>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-500 font-medium">Téléchargez votre logo pour l'afficher sur vos factures. Format PNG ou JPG recommandé (max 2Mo).</p>
                      <Button variant="outline" className="rounded-xl border-gray-200 h-10 px-5 text-gray-600 font-semibold hover:bg-gray-50">
                        Changer le logo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab !== "entreprise" && (
            <Card className="rounded-2xl border-gray-200 shadow-sm bg-white animate-in fade-in slide-in-from-bottom-4 fill-mode-both delay-100">
              <CardContent className="p-16 text-center text-gray-500">
                <p className="font-medium">Ce panneau sera bientôt disponible.</p>
              </CardContent>
            </Card>
          )}
        </div>

      </div>

      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent className="bg-white rounded-2xl p-6 border-0 shadow-2xl max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-900 text-center">
              Paramètres enregistrés avec succès !
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 sm:justify-center">
            <AlertDialogAction onClick={() => setIsModalOpen(false)} className="rounded-xl font-bold bg-[#4F46E5] text-white hover:bg-[#4338CA] border-0 px-8 w-full sm:w-auto">
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
