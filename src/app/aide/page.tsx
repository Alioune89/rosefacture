"use client";

import { MessageSquare, PhoneCall, BookOpen, Mail, ChevronRight, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FAQS = [
  { question: "Comment créer ma première facture ?", answer: "Rendez-vous dans la section Factures et cliquez sur 'Nouvelle Facture'. Remplissez les informations de votre client et ajoutez vos lignes de services/produits." },
  { question: "Puis-je modifier une facture déjà envoyée ?", answer: "Non, une facture envoyée ou payée ne peut plus être modifiée pour des raisons légales. Vous pouvez la dupliquer ou créer un avoir." },
  { question: "Comment configurer mes coordonnées bancaires ?", answer: "Allez dans Paramètres > Coordonnées Bancaires. Vos informations apparaîtront automatiquement en bas de vos prochaines factures." },
  { question: "L'application gère-t-elle la TVA ?", answer: "Oui, vous pouvez activer ou désactiver la TVA (18% par défaut) lors de la création d'une nouvelle facture." },
];

export default function AidePage() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="text-center py-8 sm:py-12">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Comment pouvons-nous vous aider ?</h1>
        <p className="text-base sm:text-lg text-gray-500 font-medium mt-4 max-w-2xl mx-auto">Consultez notre base de connaissances ou contactez notre équipe de support disponible 7j/7.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl border-gray-200 shadow-sm bg-white hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 fill-mode-both delay-100 cursor-pointer">
          <CardContent className="p-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Guides pratiques</h3>
            <p className="text-sm text-gray-500 font-medium mb-6">Apprenez à utiliser l&apos;application étape par étape.</p>
            <Button variant="outline" className="w-full rounded-xl border-gray-200 font-semibold text-blue-600 hover:bg-blue-50 hover:text-blue-700">
              Lire les guides
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-sm bg-white hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 fill-mode-both delay-200 cursor-pointer">
          <CardContent className="p-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Chat en direct</h3>
            <p className="text-sm text-gray-500 font-medium mb-6">Discutez avec notre équipe de support technique.</p>
            <Button className="w-full rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-sm">
              Démarrer le chat
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-sm bg-white hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 fill-mode-both delay-300 cursor-pointer">
          <CardContent className="p-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Email support</h3>
            <p className="text-sm text-gray-500 font-medium mb-6">Envoyez-nous un message détaillé.</p>
            <Button variant="outline" className="w-full rounded-xl border-gray-200 font-semibold text-purple-600 hover:bg-purple-50 hover:text-purple-700">
              support@facturaapp.sn
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 sm:mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 px-2">Questions fréquentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FAQS.map((faq, index) => {
            const delay = ["delay-300", "delay-400", "delay-500", "delay-700"][index] || "";
            return (
              <Card key={index} className={`rounded-2xl border-gray-200 shadow-sm bg-white hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 fill-mode-both ${delay} group cursor-pointer`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="text-base font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{faq.question}</h4>
                      <p className="text-sm text-gray-500 font-medium leading-relaxed">{faq.answer}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition-colors mt-1">
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

    </div>
  );
}
