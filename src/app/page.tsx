import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, TrendingUp, PieChart, FileText, Check } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#15162b] font-sans selection:bg-[#4F46E5] selection:text-white">
      {/* Navbar */}
      <nav className="fixed w-full z-50 top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight">
             <div className="w-8 h-8 rounded-xl bg-[#4F46E5] flex items-center justify-center text-white -rotate-6">
               R
             </div>
             <span><span className="text-[#4F46E5]">Rose</span>Facture</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 font-semibold text-slate-600 text-sm">
            <a href="#features" className="hover:text-[#4F46E5] transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-[#4F46E5] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left">Fonctionnalités</a>
            <a href="#how-it-works" className="hover:text-[#4F46E5] transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-[#4F46E5] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left">Comment ça marche</a>
            <a href="#pricing" className="hover:text-[#4F46E5] transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-[#4F46E5] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left">Tarifs</a>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hidden md:block font-bold text-sm hover:text-[#4F46E5] transition-colors">
              Se connecter
            </Link>
            <Link href="/factures/nouvelle" className="px-6 py-3 rounded-[14px] bg-[#4F46E5] text-white font-bold text-sm shadow-[0_13px_30px_rgba(64,54,233,0.22)] hover:shadow-[0_17px_36px_rgba(64,54,233,0.3)] transition-all active:scale-95">
              Commencer
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="pt-48 pb-20 px-6 relative overflow-hidden min-h-[980px]">
          {/* Subtle background decoration */}
          <div className="absolute top-[-290px] left-1/2 -translate-x-1/2 w-[1050px] h-[760px] bg-gradient-to-r from-[#4E44EE]/10 to-transparent rounded-full blur-[40px] -z-10 pointer-events-none" />
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold text-[#4F46E5] tracking-[0.11em] uppercase mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f47b45] shadow-[0_0_0_5px_#fff0e8]" />
              La facturation, enfin simple
            </div>
            
            <h1 className="text-5xl md:text-[82px] font-extrabold tracking-tight mb-8 leading-[1.08]">
              Fini les factures bricolées sur <span className="text-[#4F46E5] relative inline-block">Word et Excel.
                <div className="absolute w-[94%] h-1.5 bottom-1 left-[3%] bg-[#f47b45] opacity-80 -rotate-1 rounded-full -z-10" />
              </span>
            </h1>
            
            <p className="text-xl text-[#666a82] max-w-[650px] mx-auto mb-8 leading-relaxed">
              Crée des factures professionnelles en FCFA, calcule ta TVA et suis chaque paiement depuis un seul espace clair.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
              <Link href="/factures/nouvelle" className="px-6 py-4 rounded-[14px] bg-[#4F46E5] text-white font-bold shadow-[0_13px_30px_rgba(64,54,233,0.22)] hover:shadow-[0_17px_36px_rgba(64,54,233,0.3)] transition-all active:scale-95 w-full sm:w-auto flex items-center justify-center gap-2">
                Commencer gratuitement
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#demo" className="px-6 py-4 rounded-[14px] bg-white border border-[#e9e8f1] shadow-[0_10px_26px_rgba(28,25,71,0.06)] text-[#15162b] font-bold hover:border-[#cfccff] hover:text-[#4F46E5] transition-all active:scale-95 w-full sm:w-auto flex items-center justify-center gap-2">
                Voir la démo
              </a>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-xs text-[#666a82] mt-4">
              <div className="w-4 h-4 rounded-full bg-[#e4f7ed] text-[#1e9e6a] flex items-center justify-center">
                <Check className="w-3 h-3" />
              </div>
              <span>Aucune carte bancaire requise</span>
            </div>
          </div>

          {/* Floating UI Elements / Dashboard Mockup */}
          <div className="mt-20 max-w-[1020px] mx-auto relative [perspective:1400px] w-full overflow-hidden md:overflow-visible px-4 md:px-0">
             <div className="relative w-[800px] md:w-full max-w-full mx-auto left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0">
               {/* Floating cards */}
               <div className="absolute -left-4 md:-left-16 top-28 bg-white/95 backdrop-blur rounded-[14px] p-3.5 shadow-[0_18px_45px_rgba(30,25,88,0.14)] border border-[#e2e0ef]/80 z-20 flex gap-3 items-center animate-[float_5s_ease-in-out_infinite]">
                  <div className="w-9 h-9 rounded-lg bg-[#e5f8ef] text-[#1e9e6a] flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[9px] text-[#666a82]">Paiement reçu</div>
                    <div className="font-mono font-bold text-xs text-[#15162b]">350 000 FCFA</div>
                  </div>
               </div>
               
               <div className="absolute -right-4 md:-right-16 top-14 bg-white/95 backdrop-blur rounded-[14px] p-3.5 shadow-[0_18px_45px_rgba(30,25,88,0.14)] border border-[#e2e0ef]/80 z-20 flex gap-3 items-center animate-[float_5s_ease-in-out_infinite] [animation-delay:-2s]">
                  <div className="w-9 h-9 rounded-lg bg-[#fff0e8] text-[#f47b45] flex items-center justify-center">
                    <PieChart className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[9px] text-[#666a82]">TVA calculée</div>
                    <div className="font-mono font-bold text-xs text-[#15162b]">18% automatique</div>
                  </div>
               </div>

               {/* Main Dashboard Mockup */}
               <div className="rounded-[24px] border border-[#e2e0ef]/80 bg-white shadow-[0_45px_90px_rgba(29,24,87,0.15)] overflow-hidden relative z-10 grid grid-cols-[190px_1fr] min-h-[440px] [transform:rotateX(3deg)]">
                  {/* Sidebar */}
                  <div className="bg-[#17172d] text-white p-6 pb-8">
                    <div className="font-extrabold flex items-center gap-2 mb-10 text-sm tracking-tight">
                      <div className="w-6 h-6 rounded-lg rounded-br-sm bg-[#4F46E5] -rotate-6" />
                      RoseFacture
                    </div>
                    <div className="space-y-2.5 flex-1">
                      <div className="px-2.5 py-2.5 rounded-lg bg-white/10 text-white text-[10px] flex items-center gap-2.5">
                         <div className="w-3.5 h-3.5 rounded bg-white/20" /> Tableau de bord
                      </div>
                      <div className="px-2.5 py-2.5 rounded-lg text-[#9999ad] text-[10px] flex items-center gap-2.5">
                         <div className="w-3.5 h-3.5 rounded border border-slate-500" /> Factures
                      </div>
                      <div className="px-2.5 py-2.5 rounded-lg text-[#9999ad] text-[10px] flex items-center gap-2.5">
                         <div className="w-3.5 h-3.5 rounded border border-slate-500" /> Clients
                      </div>
                    </div>
                  </div>
                  {/* Main content area */}
                  <div className="bg-[#fafafe] p-8">
                     <div className="flex justify-between items-center mb-6">
                       <div>
                         <h3 className="text-lg font-bold text-slate-900">Bonjour, Awa</h3>
                         <p className="text-[9px] text-[#8b8c9d] mt-1">Voici la santé de ton activité aujourd'hui.</p>
                       </div>
                       <div className="w-8 h-8 rounded-full bg-[#fff0e8] text-[#f47b45] font-extrabold flex items-center justify-center text-[9px]">AN</div>
                     </div>
                     <div className="grid grid-cols-3 gap-3.5 mb-3.5">
                        <div className="bg-white p-4 rounded-[14px] border border-[#efedf5]">
                          <div className="text-[9px] text-[#8b8c9d] mb-1">Chiffre d'affaires</div>
                          <div className="font-mono text-base font-bold text-slate-900">2,45M</div>
                          <div className="text-[8px] text-[#1e9e6a] mt-1">+12,4% ce mois</div>
                        </div>
                        <div className="bg-white p-4 rounded-[14px] border border-[#efedf5]">
                          <div className="text-[9px] text-[#8b8c9d] mb-1">Factures payées</div>
                          <div className="font-mono text-base font-bold text-slate-900">18</div>
                          <div className="text-[8px] text-[#1e9e6a] mt-1">+3 cette semaine</div>
                        </div>
                        <div className="bg-white p-4 rounded-[14px] border border-[#efedf5]">
                          <div className="text-[9px] text-[#8b8c9d] mb-1">En attente</div>
                          <div className="font-mono text-base font-bold text-slate-900">475K</div>
                          <div className="text-[8px] text-[#f47b45] mt-1">3 à relancer</div>
                        </div>
                     </div>
                     <div className="grid grid-cols-[1.4fr_1fr] gap-3.5 h-[185px]">
                        <div className="bg-white p-4 rounded-[14px] border border-[#efedf5] flex flex-col">
                           <div className="text-[11px] font-bold text-slate-900">Encaissements</div>
                           <div className="flex-1 flex items-end gap-2 mt-5">
                             {[38, 55, 43, 86, 67, 76].map((h, i) => (
                               <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, backgroundColor: i === 3 ? '#4F46E5' : i === 1 || i === 4 ? '#c8c4ff' : '#eeedff' }} />
                             ))}
                           </div>
                        </div>
                        <div className="bg-white p-4 rounded-[14px] border border-[#efedf5] flex flex-col">
                           <div className="text-[11px] font-bold text-slate-900">Dernières factures</div>
                           <div className="space-y-3 flex-1 mt-5">
                             {[
                               { n: 'Baobab Studio', id: '#FAC-024' },
                               { n: 'Teranga Shop', id: '#FAC-023' },
                               { n: 'Naya Conseil', id: '#FAC-022' },
                             ].map((f, i) => (
                               <div key={i} className="flex items-center justify-between text-[8px]">
                                  <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded bg-[#eeedff] text-[#4F46E5] font-bold flex items-center justify-center">F</div>
                                    <div className="leading-tight">
                                      <div className="font-bold text-slate-900">{f.n}</div>
                                      <div className="text-[#9b9cab] text-[7px]">{f.id}</div>
                                    </div>
                                  </div>
                                  <div className="px-1.5 py-0.5 bg-[#e4f7ed] text-[#1e9e6a] rounded-full text-[7px]">Payée</div>
                               </div>
                             ))}
                           </div>
                        </div>
                     </div>
                  </div>
             </div>
             </div>
          </div>
        </section>

        {/* Pain points */}
        <section className="py-[120px] bg-[#15162b] text-white overflow-hidden relative">
          <div className="absolute -right-[220px] -top-[320px] w-[640px] h-[640px] border border-white/5 rounded-full" />
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="max-w-[730px] mx-auto text-center mb-16">
              <div className="text-[#aaa5ff] font-extrabold uppercase tracking-[0.11em] text-xs mb-6 flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f47b45] shadow-[0_0_0_5px_#fff0e8]" />
                Ce qui te ralentit
              </div>
              <h2 className="text-4xl md:text-[58px] font-extrabold mb-5 leading-tight tracking-tight">Ton énergie mérite mieux que la paperasse.</h2>
              <p className="text-[#a7a8ba] text-[17px] mt-5">Tu développes ton activité. Tu ne devrais pas perdre des heures à réparer des tableaux et chercher qui a payé.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-[24px] p-8 hover:-translate-y-1 hover:bg-white/10 hover:shadow-[0_24px_55px_rgba(0,0,0,0.15)] transition-all min-h-[310px]">
                <div className="text-[#74758d] font-mono text-xs">01 / 03</div>
                <div className="w-[72px] h-[72px] rounded-2xl bg-white/5 text-[#8f88ff] flex items-center justify-center my-8">
                   <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-[21px] font-bold mb-3 tracking-tight leading-tight">Une image qui ne te ressemble pas</h3>
                <p className="text-[#aaaabb] text-sm">Les modèles bricolés donnent une impression amateur, même quand ton travail est excellent.</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-[24px] p-8 hover:-translate-y-1 hover:bg-white/10 hover:shadow-[0_24px_55px_rgba(0,0,0,0.15)] transition-all min-h-[310px]">
                <div className="text-[#74758d] font-mono text-xs">02 / 03</div>
                <div className="w-[72px] h-[72px] rounded-2xl bg-white/5 text-[#ff9b6d] flex items-center justify-center my-8">
                   <PieChart className="w-8 h-8" />
                </div>
                <h3 className="text-[21px] font-bold mb-3 tracking-tight leading-tight">Des calculs de TVA à répétition</h3>
                <p className="text-[#aaaabb] text-sm">Une formule oubliée et toute la facture est fausse. Les 18% ne devraient jamais être une source de stress.</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-[24px] p-8 hover:-translate-y-1 hover:bg-white/10 hover:shadow-[0_24px_55px_rgba(0,0,0,0.15)] transition-all min-h-[310px]">
                <div className="text-[#74758d] font-mono text-xs">03 / 03</div>
                <div className="w-[72px] h-[72px] rounded-2xl bg-white/5 text-[#5cd8d5] flex items-center justify-center my-8">
                   <TrendingUp className="w-8 h-8" />
                </div>
                <h3 className="text-[21px] font-bold mb-3 tracking-tight leading-tight">Des paiements difficiles à suivre</h3>
                <p className="text-[#aaaabb] text-sm">Entre les messages et les fichiers, impossible de savoir en un coup d'œil qui doit encore payer.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-[120px] px-6">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-[730px] mx-auto text-center mb-16">
              <div className="text-[#4F46E5] font-extrabold uppercase tracking-[0.11em] text-xs mb-6 flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f47b45] shadow-[0_0_0_5px_#fff0e8]" />
                Tout devient izi
              </div>
              <h2 className="text-4xl md:text-[58px] font-extrabold mb-5 leading-tight tracking-tight">Conçu pour facturer. Pensé pour avancer.</h2>
              <p className="text-[#666a82] text-[17px] mt-5">Quatre outils essentiels, réunis dans une expérience légère qui ne demande aucune formation.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Feature 1 */}
              <div className="bg-white border border-[#e9e8f1] rounded-[24px] p-8 hover:shadow-[0_24px_70px_rgba(28,25,71,0.1)] hover:-translate-y-1 transition-all flex flex-col justify-between group overflow-hidden relative min-h-[330px]">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-[52px] h-[52px] rounded-[14px] bg-[#eeedff] text-[#4F46E5] flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-transform">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="font-mono text-[10px] text-[#9a9baa]">01 — CRÉER</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2.5">Factures pro en 2 clics</h3>
                  <p className="text-[#666a82] text-sm max-w-[430px]">Ton logo, tes couleurs et toutes les mentions utiles dans un document prêt à envoyer.</p>
                </div>
                <div className="bg-[#fafafe] border border-[#efedf5] rounded-[14px] p-4 absolute bottom-[-18px] left-8 right-8 text-[10px]">
                   <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-[#15162b] mb-0.5">FACTURE #IZI-0042</div>
                        <div className="text-[#666a82]">Studio Kër — Dakar</div>
                      </div>
                      <div className="font-mono font-bold text-[#4F46E5]">325 000 F</div>
                   </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-white border border-[#e9e8f1] rounded-[24px] p-8 hover:shadow-[0_24px_70px_rgba(28,25,71,0.1)] hover:-translate-y-1 transition-all flex flex-col justify-between group overflow-hidden relative min-h-[330px]">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-[52px] h-[52px] rounded-[14px] bg-[#fff0e8] text-[#f47b45] flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-transform">
                      <PieChart className="w-6 h-6" />
                    </div>
                    <div className="font-mono text-[10px] text-[#9a9baa]">02 — CALCULER</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2.5">TVA 18% automatique</h3>
                  <p className="text-[#666a82] text-sm max-w-[430px]">Tu saisis le montant. RoseFacture fait le reste, sans formule à mémoriser ni risque d'erreur.</p>
                </div>
                <div className="bg-[#fafafe] border border-[#efedf5] rounded-[14px] p-4 absolute bottom-[-18px] left-8 right-8 text-[10px]">
                   <div className="flex justify-between items-center py-1.5"><span className="text-[#666a82]">Sous-total</span><span className="font-mono font-bold text-[#15162b]">250 000 F</span></div>
                   <div className="flex justify-between items-center py-1.5"><span className="text-[#666a82]">TVA (18%)</span><span className="font-mono font-bold text-[#15162b]">45 000 F</span></div>
                   <div className="flex justify-between items-center py-2.5 mt-1 border-t border-dashed border-[#d8d6e5] text-[#4F46E5]"><span className="font-bold">Total TTC</span><span className="font-mono font-bold">295 000 F</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-[120px] px-6">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-[730px] mx-auto text-center mb-16">
              <div className="text-[#4F46E5] font-extrabold uppercase tracking-[0.11em] text-xs mb-6 flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f47b45] shadow-[0_0_0_5px_#fff0e8]" />
                Des tarifs sans surprise
              </div>
              <h2 className="text-4xl md:text-[58px] font-extrabold mb-5 leading-tight tracking-tight">Commence petit. Grandis sans limite.</h2>
              <p className="text-[#666a82] text-[17px] mt-5">Tous les plans incluent la TVA automatique, l'export PDF et le suivi des paiements.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 items-stretch">
              {/* Gratuit */}
              <div className="bg-white rounded-[24px] p-8 border border-[#e9e8f1] flex flex-col hover:shadow-[0_24px_70px_rgba(28,25,71,0.1)] hover:-translate-y-1 transition-all">
                <h3 className="text-lg font-bold">Gratuit</h3>
                <p className="text-[#666a82] text-[13px] mt-2 mb-6">Pour se lancer sans pression.</p>
                <div className="mb-7 flex items-baseline gap-1">
                  <span className="text-[36px] font-bold tracking-tight">0</span>
                  <span className="text-[#666a82] text-[11px]">FCFA / mois</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1 text-[13px]">
                  <li className="flex gap-2.5 items-center"><Check className="w-4 h-4 text-[#1e9e6a] flex-none" /> 5 factures par mois</li>
                  <li className="flex gap-2.5 items-center"><Check className="w-4 h-4 text-[#1e9e6a] flex-none" /> 1 utilisateur</li>
                  <li className="flex gap-2.5 items-center"><Check className="w-4 h-4 text-[#1e9e6a] flex-none" /> Export PDF</li>
                </ul>
                <Link href="/login" className="w-full text-center py-[11px] rounded-[14px] bg-white border border-[#e9e8f1] shadow-[0_10px_26px_rgba(28,25,71,0.06)] text-[#15162b] font-bold hover:border-[#cfccff] hover:text-[#4F46E5] transition-all">
                  Essayer gratuitement
                </Link>
              </div>
              
              {/* Pro */}
              <div className="bg-[#4F46E5] text-white rounded-[24px] p-8 border border-[#4F46E5] flex flex-col shadow-[0_25px_70px_rgba(64,54,233,0.27)] transform md:-translate-y-4 hover:-translate-y-5 transition-all relative">
                <div className="absolute top-5 right-5 bg-[#f47b45] text-white text-[9px] font-extrabold uppercase tracking-wider py-1.5 px-3 rounded-full">Le plus choisi</div>
                <h3 className="text-lg font-bold">Pro</h3>
                <p className="text-[#c5c2ff] text-[13px] mt-2 mb-6">Pour les indépendants ambitieux.</p>
                <div className="mb-7 flex items-baseline gap-1">
                  <span className="text-[36px] font-bold tracking-tight">5 000</span>
                  <span className="text-[#c5c2ff] text-[11px]">FCFA / mois</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1 text-[13px]">
                  <li className="flex gap-2.5 items-center"><Check className="w-4 h-4 text-[#8cf0be] flex-none" /> Factures illimitées</li>
                  <li className="flex gap-2.5 items-center"><Check className="w-4 h-4 text-[#8cf0be] flex-none" /> Relances automatiques</li>
                  <li className="flex gap-2.5 items-center"><Check className="w-4 h-4 text-[#8cf0be] flex-none" /> Rapports avancés</li>
                </ul>
                <Link href="/factures/nouvelle" className="w-full text-center py-[11px] rounded-[14px] bg-white text-[#4F46E5] font-bold transition-all hover:bg-slate-50">
                  Choisir Pro
                </Link>
              </div>

              {/* Business */}
              <div className="bg-white rounded-[24px] p-8 border border-[#e9e8f1] flex flex-col hover:shadow-[0_24px_70px_rgba(28,25,71,0.1)] hover:-translate-y-1 transition-all">
                <h3 className="text-lg font-bold">Business</h3>
                <p className="text-[#666a82] text-[13px] mt-2 mb-6">Pour les équipes qui accélèrent.</p>
                <div className="mb-7 flex items-baseline gap-1">
                  <span className="text-[36px] font-bold tracking-tight">15 000</span>
                  <span className="text-[#666a82] text-[11px]">FCFA / mois</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1 text-[13px]">
                  <li className="flex gap-2.5 items-center"><Check className="w-4 h-4 text-[#1e9e6a] flex-none" /> Tout le plan Pro</li>
                  <li className="flex gap-2.5 items-center"><Check className="w-4 h-4 text-[#1e9e6a] flex-none" /> Multi-utilisateurs</li>
                  <li className="flex gap-2.5 items-center"><Check className="w-4 h-4 text-[#1e9e6a] flex-none" /> Support prioritaire</li>
                </ul>
                <Link href="/login" className="w-full text-center py-[11px] rounded-[14px] bg-white border border-[#e9e8f1] shadow-[0_10px_26px_rgba(28,25,71,0.06)] text-[#15162b] font-bold hover:border-[#cfccff] hover:text-[#4F46E5] transition-all">
                  Choisir Business
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pt-10 pb-[120px] px-6">
           <div className="max-w-[1200px] mx-auto bg-[#15162b] rounded-[36px] text-center px-10 py-[88px] relative overflow-hidden">
             <div className="absolute -left-[150px] -top-[180px] w-[360px] h-[360px] border border-white/10 rounded-full" />
             <div className="absolute -right-[150px] -top-[180px] w-[360px] h-[360px] border border-white/10 rounded-full" />
             <div className="relative z-10 max-w-[780px] mx-auto">
               <div className="text-[#aaa5ff] font-extrabold uppercase tracking-[0.11em] text-xs mb-6">Prêt à passer au niveau supérieur ?</div>
               <h2 className="text-4xl md:text-[58px] font-extrabold text-white mb-5 leading-tight tracking-tight">Rejoins les entrepreneurs qui facturent comme des pros.</h2>
               <p className="text-[#b1b2c0] text-[17px] mt-5 mb-[30px] max-w-[550px] mx-auto">Ta première facture professionnelle est à quelques clics. Commence gratuitement, sans engagement.</p>
               <Link href="/factures/nouvelle" className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-[14px] bg-[#4F46E5] text-white font-bold shadow-[0_13px_30px_rgba(64,54,233,0.22)] hover:shadow-[0_17px_36px_rgba(64,54,233,0.3)] transition-all active:scale-95">
                 Commencer gratuitement
                 <ArrowRight className="w-4 h-4" />
               </Link>
             </div>
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="pt-[80px] pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-10 pb-14">
            <div>
              <Link href="/" className="flex items-center gap-2 font-bold text-[21px] tracking-tight mb-4">
                 <div className="w-[34px] h-[34px] rounded-[10px] rounded-br-[3px] bg-[#4F46E5] flex items-center justify-center text-white text-[17px] -rotate-4">
                   R
                 </div>
                 <span><span className="text-[#4F46E5] font-normal">Rose</span>Facture</span>
              </Link>
              <p className="text-[#666a82] text-[13px] max-w-[280px] mt-[18px]">
                La facturation simple, moderne et pensée pour les entrepreneurs africains.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-[13px] mb-[18px]">Produit</h4>
              <ul className="space-y-2.5 text-[13px] text-[#666a82]">
                <li><a href="#features" className="hover:text-[#4F46E5] transition-colors">Fonctionnalités</a></li>
                <li><a href="#pricing" className="hover:text-[#4F46E5] transition-colors">Tarifs</a></li>
                <li><a href="#demo" className="hover:text-[#4F46E5] transition-colors">Démo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[13px] mb-[18px]">Ressources</h4>
              <ul className="space-y-2.5 text-[13px] text-[#666a82]">
                <li><a href="#" className="hover:text-[#4F46E5] transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-[#4F46E5] transition-colors">Guide de facturation</a></li>
                <li><a href="#" className="hover:text-[#4F46E5] transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[13px] mb-[18px]">Légal</h4>
              <ul className="space-y-2.5 text-[13px] text-[#666a82]">
                <li><a href="#" className="hover:text-[#4F46E5] transition-colors">Confidentialité</a></li>
                <li><a href="#" className="hover:text-[#4F46E5] transition-colors">Conditions</a></li>
                <li><a href="#" className="hover:text-[#4F46E5] transition-colors">Mentions légales</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-[#e9e8f1] flex flex-col md:flex-row justify-between items-center gap-6 text-[12px] text-[#666a82]">
            <p>© 2026 RoseFacture. Fait avec fierté en Afrique.</p>
            <div className="flex gap-2.5">
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-white border border-[#e9e8f1] hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all hover:-translate-y-0.5" aria-label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6.5 8.5H3V21h3.5V8.5ZM4.75 3A2.05 2.05 0 1 0 4.75 7.1 2.05 2.05 0 0 0 4.75 3ZM21 14c0-3.77-2.01-5.52-4.7-5.52a4.07 4.07 0 0 0-3.68 2.02h-.05v-2h-3.4V21h3.55v-6.19c0-1.63.31-3.21 2.33-3.21 2 0 2.02 1.87 2.02 3.32V21H21v-7Z" /></svg>
              </a>
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-white border border-[#e9e8f1] hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all hover:-translate-y-0.5" aria-label="Instagram">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
