"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getInvoices, deleteInvoice, updateInvoiceStatus } from "@/lib/store";
import {
  FileText, Calendar as CalendarIcon,
  Wallet,
  Clock,
  TrendingUp,
  MoreVertical,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Users
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";


const formatFCFA = (amount: number) => {
  return new Intl.NumberFormat('fr-SN', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0
  }).format(amount).replace("XOF", "FCFA");
};



const INVOICE_STATUS_DATA = [
  { name: 'Payées', value: 45, color: '#10B981' }, // green-500
  { name: 'Envoyées', value: 30, color: '#3B82F6' }, // blue-500
  { name: 'En retard', value: 15, color: '#EF4444' }, // red-500
  { name: 'Brouillons', value: 10, color: '#9CA3AF' }, // gray-400
];

// Removed RECENT_INVOICES

const getStatusBadge = (status: string) => {
  switch (status) {
    case "payée":
      return <Badge className="bg-green-50 text-green-700 hover:bg-green-50 rounded-full border-0 px-3"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" /> Payée</Badge>;
    case "envoyée":
      return <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 rounded-full border-0 px-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" /> Envoyée</Badge>;
    case "en retard":
      return <Badge className="bg-red-50 text-red-700 hover:bg-red-50 rounded-full border-0 px-3"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2" /> En retard</Badge>;
    case "brouillon":
      return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 rounded-full border-0 px-3"><div className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-2" /> Brouillon</Badge>;
    default:
      return null;
  }
};

export default function DashboardPage() {
  const router = useRouter();

  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0));
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const invoices = await getInvoices();

      let filteredInvoices = invoices;
      if (startDate || endDate) {
        filteredInvoices = invoices.filter((i: any) => {
          // Parse date properly if it's stored as dd/mm/yyyy
          let d;
          if (i.createdAt) {
            d = new Date(i.createdAt);
          } else if (i.date && i.date.includes('/')) {
            const [day, month, year] = i.date.split('/');
            d = new Date(year, month - 1, day);
          } else {
            d = new Date();
          }

          let isValid = true;
          if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            if (d < start) isValid = false;
          }
          if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            if (d > end) isValid = false;
          }
          return isValid;
        });
      }

      setRecentInvoices(filteredInvoices.slice(0, 5));

      const totalEnCaisse = filteredInvoices.filter((i: any) => i.status === 'payée').reduce((acc: number, i: any) => acc + Number(i.amount || 0), 0);
      const facturesEnAttente = filteredInvoices.filter((i: any) => i.status === 'envoyée').reduce((acc: number, i: any) => acc + Number(i.amount || 0), 0);
      const enRetard = filteredInvoices.filter((i: any) => i.status === 'en retard').reduce((acc: number, i: any) => acc + Number(i.amount || 0), 0);


      const { supabase } = await import('@/lib/supabase');
      const { count } = await supabase.from('clients').select('*', { count: 'exact', head: true });

      setStats([
        { title: "Total encaissé", value: `${formatFCFA(totalEnCaisse)}`, trend: "+0%", trendUp: true, icon: Wallet, iconColor: "text-emerald-600", iconBg: "bg-emerald-100" },
        { title: "Factures en attente", value: `${formatFCFA(facturesEnAttente)}`, trend: "+0%", trendUp: true, icon: Clock, iconColor: "text-blue-600", iconBg: "bg-blue-100" },
        { title: "En retard", value: `${formatFCFA(enRetard)}`, trend: "+0%", trendUp: true, icon: AlertCircle, iconColor: "text-red-600", iconBg: "bg-red-100" },
        { title: "Total clients", value: `${count || 0}`, subtitle: "Mise à jour en temps réel", icon: Users, iconColor: "text-purple-600", iconBg: "bg-purple-100" },
      ]);
      setIsLoading(false);
    }
    loadData();
  }, [startDate, endDate, refreshKey]);


  return (
    <div className="space-y-8 animate-in fade-in duration-500">


      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Bonjour 👋</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Voici le résumé de vos activités.</p>
        </div>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2 z-50">
          <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
            <PopoverTrigger render={
              <Button variant="outline" className="w-full sm:w-auto h-10 rounded-xl border-gray-200 hover:bg-gray-50 text-slate-700 font-medium shadow-sm flex items-center justify-start sm:justify-center px-4">
                <CalendarIcon className="w-4 h-4 mr-2 text-slate-500" />
                <span className="truncate">{startDate ? format(startDate, "dd MMM yyyy", { locale: fr }) : "Date de début"}</span>
              </Button>
            } />
            <PopoverContent className="w-auto p-0 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[100]" align="end" sideOffset={8}>
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => { setStartDate(date); setStartDateOpen(false); }}
                initialFocus
                className="p-3"
              />
            </PopoverContent>
          </Popover>

          <div className="hidden sm:flex items-center text-gray-400 font-medium">-</div>

          <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
            <PopoverTrigger render={
              <Button variant="outline" className="w-full sm:w-auto h-10 rounded-xl border-gray-200 hover:bg-gray-50 text-slate-700 font-medium shadow-sm flex items-center justify-start sm:justify-center px-4">
                <CalendarIcon className="w-4 h-4 mr-2 text-slate-500" />
                <span className="truncate">{endDate ? format(endDate, "dd MMM yyyy", { locale: fr }) : "Date de fin"}</span>
              </Button>
            } />
            <PopoverContent className="w-auto p-0 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[100]" align="end" sideOffset={8}>
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => { setEndDate(date); setEndDateOpen(false); }}
                initialFocus
                className="p-3"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* KPI Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {isLoading 
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={`skeleton-${i}`} className="rounded-2xl border-gray-200 shadow-sm overflow-hidden h-[120px]">
                <CardContent className="p-5 sm:p-6 flex flex-col h-full justify-center space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-24 bg-gray-200" />
                      <Skeleton className="h-8 w-32 bg-gray-200" />
                    </div>
                    <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gray-200 shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))
          : stats.map((stat, index) => {
          const delay = ["delay-100", "delay-200", "delay-300", "delay-400"][index] || "";
          return (
            <Card
              key={index}
              className={`rounded-2xl border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] active:shadow-sm transition-all duration-300 overflow-hidden cursor-default animate-in fade-in slide-in-from-bottom-4 fill-mode-both ${delay}`}
            >
              <CardContent className="p-5 sm:p-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 tabular-nums break-words">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.iconBg}`}>
                    <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.iconColor}`} />
                  </div>
                </div>
                <div className="mt-4">
                  {stat.trend ? (
                    <div className="flex items-center text-xs sm:text-sm">
                      <span className="text-green-600 font-medium flex items-center">
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {stat.trend}
                      </span>
                      <span className="text-gray-500 ml-2 truncate">vs mois précédent</span>
                    </div>
                  ) : (
                    <div className="text-xs sm:text-sm text-gray-500 mt-1 truncate">{stat.subtitle}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph */}
        <Card className="lg:col-span-1 rounded-2xl border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] active:shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 fill-mode-both delay-500">
          <CardHeader className="pt-6 px-6 pb-4 border-b border-gray-100">
            <CardTitle className="text-lg text-gray-800">Statuts des Factures</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            {isLoading ? (
              <Skeleton className="w-[200px] h-[200px] rounded-full bg-gray-200" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={INVOICE_STATUS_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {INVOICE_STATUS_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `${value}%`}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="lg:col-span-2 rounded-2xl border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] active:shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 fill-mode-both delay-700">
          <CardHeader className="pt-6 px-6 pb-4 flex flex-row items-center justify-between border-b border-gray-100">
            <CardTitle className="text-lg text-gray-800">Dernières Factures</CardTitle>
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
              Voir tout <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="font-semibold">N° Facture</TableHead>
                    <TableHead className="font-semibold">Client</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="text-right font-semibold">Montant</TableHead>
                    <TableHead className="font-semibold">Statut</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={`skeleton-row-${i}`}>
                        <TableCell><Skeleton className="h-4 w-20 bg-gray-200" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32 bg-gray-200" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24 bg-gray-200" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20 bg-gray-200 ml-auto" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20 rounded-full bg-gray-200" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8 rounded-full bg-gray-200 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : recentInvoices.map((invoice, index) => (
                    <TableRow
                      key={invoice.id}
                      className="group hover:bg-blue-50/50 hover:shadow-sm hover:-translate-y-[1px] active:scale-[0.99] active:bg-blue-100/50 transition-all duration-200 cursor-pointer"
                    >
                      <TableCell onClick={() => router.push(`/factures/nouvelle?id=${invoice.id}`)} className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">{invoice.id}</TableCell>
                      <TableCell onClick={() => router.push(`/factures/nouvelle?id=${invoice.id}`)}>{invoice.client}</TableCell>
                      <TableCell onClick={() => router.push(`/factures/nouvelle?id=${invoice.id}`)} className="text-gray-500">{invoice.date}</TableCell>
                      <TableCell onClick={() => router.push(`/factures/nouvelle?id=${invoice.id}`)} className="text-right font-medium tabular-nums">
                        {formatFCFA(invoice.amount)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} className="focus:outline-none">
                            {getStatusBadge(invoice.status)}
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="center" className="w-[140px] rounded-xl bg-white shadow-lg border border-gray-100 z-50 p-1">
                            {["brouillon", "envoyée", "payée", "en retard"].map((s) => (
                              <DropdownMenuItem
                                key={s}
                                className="cursor-pointer capitalize font-medium"
                                onClick={async (e) => {
                                  e.preventDefault();
                                  await updateInvoiceStatus(invoice.id, s);
                                  setRefreshKey(k => k + 1);
                                }}
                              >
                                {s}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            className="flex items-center justify-center w-9 h-9 text-gray-400 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100 ml-auto"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px] rounded-xl bg-white shadow-lg border border-gray-100 z-50">
                            <DropdownMenuItem
                              onSelect={() => router.push(`/factures/nouvelle?id=${invoice.id}`)}
                              className="cursor-pointer font-medium"
                            >
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => router.push(`/factures/nouvelle?id=${invoice.id}`)}
                              className="cursor-pointer font-medium"
                            >
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger className="cursor-pointer font-medium">
                                Changer statut
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent className="w-[140px] rounded-xl bg-white shadow-lg border border-gray-100 z-50 p-1">
                                {["brouillon", "envoyée", "payée", "en retard"].map((s) => (
                                  <DropdownMenuItem
                                    key={s}
                                    className="cursor-pointer capitalize font-medium"
                                    onClick={async (e) => {
                                      e.preventDefault();
                                      await updateInvoiceStatus(invoice.id, s);
                                      setRefreshKey(k => k + 1);
                                    }}
                                  >
                                    {s}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={async (e) => {
                                e.preventDefault();
                                if (confirm("Voulez-vous vraiment supprimer cette facture ?")) {
                                  await deleteInvoice(invoice.id);
                                  setRefreshKey(k => k + 1);
                                }
                              }}
                              className="cursor-pointer font-medium text-red-600 focus:text-red-600"
                            >
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!isLoading && recentInvoices.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-gray-500 font-medium">
                        Aucune facture récente.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="sm:hidden flex flex-col">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={`skeleton-mob-${i}`} className="p-4 border-b border-gray-100 bg-white">
                    <div className="flex justify-between items-start mb-3">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-32 bg-gray-200" />
                        <Skeleton className="h-4 w-20 bg-gray-200" />
                      </div>
                      <Skeleton className="h-6 w-20 rounded-full bg-gray-200" />
                    </div>
                    <div className="flex justify-between items-end">
                      <Skeleton className="h-4 w-24 bg-gray-200" />
                      <Skeleton className="h-6 w-24 bg-gray-200" />
                    </div>
                  </div>
                ))
              ) : recentInvoices.map((invoice, index) => (
                <div 
                  key={invoice.id} 
                  className="group p-4 border-b border-gray-100 bg-white hover:bg-blue-50/50 active:bg-blue-100/50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/factures/nouvelle?id=${invoice.id}`)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{invoice.client}</div>
                      <div className="text-sm text-gray-500 font-medium">{invoice.id}</div>
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                       {getStatusBadge(invoice.status)}
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="text-sm text-gray-500 font-medium">
                      <div>Émise le : {invoice.date}</div>
                    </div>
                    <div className="font-bold text-gray-900 tabular-nums text-lg">
                      {formatFCFA(invoice.amount)}
                    </div>
                  </div>
                </div>
              ))}
              {!isLoading && recentInvoices.length === 0 && (
                <div className="p-8 text-center text-gray-500 font-medium bg-white">
                  Aucune facture récente.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
