import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fermer le menu si on change de page
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);
  
  let title = "Tableau de bord";
  if (pathname === "/factures") title = "Factures";
  if (pathname === "/factures/nouvelle") title = ""; // Let the page display its own title
  if (pathname === "/clients") title = "Clients";
  if (pathname === "/produits") title = "Produits";
  if (pathname === "/parametres") title = "Paramètres";

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Trigger */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger render={
              <Button variant="ghost" size="icon" className="text-gray-600">
                <Menu className="h-6 w-6" />
              </Button>
            } />
            <SheetContent side="left" className="p-0 !w-fit bg-[#191E2B] border-none transition-all duration-300">
              <Sidebar isMobile />
            </SheetContent>
          </Sheet>
        </div>
        
        <h2 className="text-xl font-bold text-gray-800 hidden sm:block">{title}</h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Link href="/factures/nouvelle">
          <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-9 px-3 sm:h-11 sm:px-5 shadow-lg shadow-blue-600/25 flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
            <span className="text-xl leading-none mb-0.5">+</span>
            <span className="hidden sm:inline">Nouvelle Facture</span>
            <span className="sm:hidden">Facture</span>
          </Button>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4 ml-2 sm:ml-4 pl-2 sm:pl-4 border-l border-gray-200">
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-gray-900">Alioune</div>
              <div className="text-xs text-gray-500">Administrateur</div>
            </div>
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-sm text-sm sm:text-base">
              AL
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
