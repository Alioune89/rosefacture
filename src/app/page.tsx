import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-slate-950/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/20">
              A
            </div>
            <span className="font-semibold text-lg tracking-tight">Appify</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Témoignages</a>
            <a href="#pricing" className="hover:text-white transition-colors">Tarifs</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden md:block text-sm font-medium hover:text-white transition-colors">
              Se connecter
            </button>
            <button className="px-5 py-2.5 rounded-full bg-white text-slate-950 text-sm font-semibold hover:bg-slate-200 transition-colors">
              Commencer
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-6 relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center mt-12 md:mt-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-indigo-300 mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Nouveau : Découvrez notre version 2.0
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
            Créez l'avenir avec <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              élégance et simplicité
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Une plateforme tout-en-un pour concevoir, développer et déployer vos idées
            plus rapidement que jamais. Laissez la technique de côté et concentrez-vous sur l'essentiel.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-4 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 w-full sm:w-auto">
              Démarrer gratuitement
            </button>
            <button className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 font-semibold transition-all w-full sm:w-auto">
              Voir la démo
            </button>
          </div>

          {/* Dashboard Preview mockup */}
          <div className="mt-20 relative mx-auto max-w-5xl">
            <div className="rounded-xl overflow-hidden border border-white/10 bg-slate-900/50 backdrop-blur-sm shadow-2xl shadow-black/50 aspect-video relative flex flex-col">
              {/* Mockup header */}
              <div className="h-12 border-b border-white/10 bg-slate-900/80 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              {/* Mockup body */}
              <div className="flex-1 p-8 grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                  <div className="h-40 rounded-lg border border-white/5 bg-white/5"></div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="h-32 rounded-lg border border-white/5 bg-white/5"></div>
                    <div className="h-32 rounded-lg border border-white/5 bg-white/5"></div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="h-20 rounded-lg border border-white/5 bg-white/5"></div>
                  <div className="h-56 rounded-lg border border-white/5 bg-white/5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 border-t border-white/5 bg-slate-950 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pourquoi nous choisir ?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Tout ce dont vous avez besoin pour propulser votre activité vers de nouveaux sommets.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Performances extrêmes',
                desc: 'Une architecture optimisée pour des temps de chargement ultra-rapides.',
                icon: (
                  <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )
              },
              {
                title: 'Design intuitif',
                desc: 'Une interface pensée pour la productivité et le confort visuel.',
                icon: (
                  <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                )
              },
              {
                title: 'Sécurité maximale',
                desc: 'Vos données sont chiffrées et protégées par les meilleurs standards.',
                icon: (
                  <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )
              }
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer simple */}
      <footer className="py-8 text-center text-slate-500 text-sm border-t border-white/5">
        <p>© 2026 Appify. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
