import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Package, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield,
  Plus,
  HelpCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navigation = [
  { name: "Tableau de bord", href: "/", icon: LayoutDashboard },
  { name: "Factures", href: "/factures", icon: FileText },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Produits", href: "/produits", icon: Package },
  { name: "Paramètres", href: "/parametres", icon: Settings },
  { name: "Aide & Support", href: "/aide", icon: HelpCircle },
];

export function Sidebar({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("Utilisateur");

  useEffect(() => {
    async function loadUser() {
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Auth error:", error);
          setUserEmail("Connecté");
        } else if (data?.user?.email) {
          setUserEmail(data.user.email);
        }
      } catch (err) {
        console.error("Error loading user:", err);
        setUserEmail("Connecté");
      }
    }
    loadUser();
  }, []);

  const isCollapsed = collapsed;

  return (
    <div
      className={cn(
        "flex flex-col bg-[#191E2B] transition-all duration-300 h-screen sticky top-0 text-[#D0D4DA]",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-white/10">
        {!isCollapsed && (
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            FacturaApp
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "p-1.5 hover:bg-[#252D3A] rounded-lg text-gray-400 hover:text-white transition-colors",
            isCollapsed && "mx-auto"
          )}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-medium"
                  : "hover:bg-[#252D3A] hover:text-white"
              )}
            >
              <item.icon
                size={22}
                className={cn("shrink-0", isActive ? "text-white" : "text-[#99A0AC]")}
              />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </div>
      
      {!isCollapsed && (
        <div className="p-4 mt-auto border-t border-white/10">
          <button 
            onClick={async () => {
              const { supabase } = await import('@/lib/supabase');
              await supabase.auth.signOut();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#99A0AC] hover:text-white hover:bg-[#252D3A] rounded-xl transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-[#252D3A] flex items-center justify-center shrink-0">
               <LogOut size={16} />
            </div>
            <div className="flex flex-col overflow-hidden text-left">
               <span className="truncate text-white font-medium">{userEmail}</span>
               <span className="truncate text-xs">Déconnexion</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
