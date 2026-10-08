"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getInvoices, updateInvoiceStatus, deleteInvoice } from "@/lib/store";
import Link from "next/link";
import { Plus, MoreVertical, Search, Filter, Download } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const formatFCFA = (amount: number) => {
  return new Intl.NumberFormat('fr-SN', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0
  }).format(amount).replace("XOF", "FCFA");
};

// Removed hardcoded INVOICES

const getStatusBadge = (status: string) => {
  switch (status) {
    case "payée":
      return <Badge className="bg-green-50 text-green-700 hover:bg-green-50 rounded-full border-0 px-3 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" /> Payée</Badge>;
    case "envoyée":
      return <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 rounded-full border-0 px-3 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" /> Envoyée</Badge>;
    case "en retard":
      return <Badge className="bg-red-50 text-red-700 hover:bg-red-50 rounded-full border-0 px-3 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2" /> En retard</Badge>;
    case "brouillon":
      return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 rounded-full border-0 px-3 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-2" /> Brouillon</Badge>;
    default:
      return null;
  }
};

export default function FacturesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setInvoices(await getInvoices());
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    await updateInvoiceStatus(id, status);
    setInvoices(await getInvoices());
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette facture ?")) {
      await deleteInvoice(id);
      setInvoices(await getInvoices());
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inv.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Factures</h1>
          <p className="text-sm sm:text-base text-gray-500 font-medium mt-1">Gérez vos factures et suivez vos paiements.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="outline" className="hidden sm:flex rounded-xl border-gray-200 h-11 px-5 text-gray-600 font-semibold hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Link href="/factures/nouvelle" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm transition-all active:scale-[0.98] h-11 px-6">
              <Plus className="w-5 h-5 mr-2" />
              Nouvelle Facture
            </Button>
          </Link>
        </div>
      </div>

      <Card className="rounded-2xl border-gray-200 shadow-sm bg-white hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] active:shadow-sm transition-all duration-300 overflow-hidden animate-in fade-in slide-in-from-bottom-4 fill-mode-both delay-100">
        <CardHeader className="pt-6 px-4 sm:px-6 pb-4 border-b border-gray-100 bg-white">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative w-full md:max-w-md group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-blue-600" />
              <Input 
                placeholder="Rechercher par N° ou client..." 
                className="pl-10 rounded-xl bg-gray-50/50 border-gray-200 h-11 focus:bg-white transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v || "all")}>
                <SelectTrigger className="w-full sm:w-[180px] h-11 rounded-xl border-gray-200 font-medium">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="brouillon">Brouillons</SelectItem>
                  <SelectItem value="envoyée">Envoyées</SelectItem>
                  <SelectItem value="payée">Payées</SelectItem>
                  <SelectItem value="en retard">En retard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        {/* Vue Desktop */}
        <CardContent className="p-0 hidden sm:block">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                <TableHead className="font-semibold text-gray-800 pl-6 py-4">N° Facture</TableHead>
                <TableHead className="font-semibold text-gray-800 py-4">Client</TableHead>
                <TableHead className="font-semibold text-gray-800 py-4">Date d&apos;émission</TableHead>
                <TableHead className="font-semibold text-gray-800 py-4">Date d&apos;échéance</TableHead>
                <TableHead className="font-semibold text-gray-800 py-4 text-right">Montant</TableHead>
                <TableHead className="font-semibold text-gray-800 py-4 text-center">Statut</TableHead>
                <TableHead className="pr-6 py-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`skeleton-desktop-${i}`}>
                    <TableCell className="pl-6 py-4"><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="py-4"><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell className="py-4"><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="py-4"><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="py-4 text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                    <TableCell className="py-4 text-center"><Skeleton className="h-6 w-24 rounded-full mx-auto" /></TableCell>
                    <TableCell className="pr-6 py-4 text-right"><Skeleton className="h-8 w-8 rounded-full ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : paginatedInvoices.map((invoice) => (
                <TableRow 
                  key={invoice.id} 
                  className="group hover:bg-blue-50/50 hover:shadow-sm hover:-translate-y-[1px] active:scale-[0.99] active:bg-blue-100/50 transition-all duration-200 cursor-pointer bg-white"
                >
                  <TableCell onClick={() => router.push(`/factures/nouvelle?id=${invoice.id}`)} className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors pl-6 py-4 cursor-pointer">{invoice.id}</TableCell>
                  <TableCell onClick={() => router.push(`/factures/nouvelle?id=${invoice.id}`)} className="font-medium text-gray-700 py-4 cursor-pointer">{invoice.client}</TableCell>
                  <TableCell onClick={() => router.push(`/factures/nouvelle?id=${invoice.id}`)} className="text-gray-500 font-medium py-4 cursor-pointer">{invoice.date}</TableCell>
                  <TableCell onClick={() => router.push(`/factures/nouvelle?id=${invoice.id}`)} className="text-gray-500 font-medium py-4 cursor-pointer">{invoice.dueDate}</TableCell>
                  <TableCell onClick={() => router.push(`/factures/nouvelle?id=${invoice.id}`)} className="text-right font-bold text-gray-900 tabular-nums py-4 cursor-pointer">
                    {formatFCFA(invoice.amount)}
                  </TableCell>
                  <TableCell className="py-4 text-center">
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
                              await handleStatusChange(invoice.id, s);
                            }}
                          >
                            {s}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger 
                        onClick={(e) => e.stopPropagation()} 
                        className="flex items-center justify-center w-9 h-9 text-gray-400 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px] rounded-xl bg-white shadow-lg border border-gray-100 z-50">
                        <DropdownMenuItem onClick={() => router.push(`/factures/nouvelle?id=${invoice.id}`)} className="cursor-pointer font-medium">Voir détails</DropdownMenuItem>
                        <Link href={`/factures/nouvelle?id=${invoice.id}`}>
                          <DropdownMenuItem className="cursor-pointer font-medium">Modifier</DropdownMenuItem>
                        </Link>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="cursor-pointer font-medium">
                            Changer le statut
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent className="z-50 bg-white rounded-xl shadow-lg border border-gray-100">
                              <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, 'brouillon')} className="cursor-pointer font-medium">Brouillon</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, 'envoyée')} className="cursor-pointer font-medium">Envoyée</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, 'payée')} className="cursor-pointer font-medium text-green-600 focus:text-green-600">Payée</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, 'en retard')} className="cursor-pointer font-medium text-red-600 focus:text-red-600">En retard</DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuItem className="cursor-pointer font-medium">Envoyer par email</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={(e) => { e.preventDefault(); handleDelete(invoice.id); }} className="cursor-pointer font-medium text-red-600 focus:text-red-600">Supprimer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && filteredInvoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-gray-500 bg-white font-medium">
                    Aucune facture trouvée.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>

        {/* Vue Mobile */}
        <CardContent className="p-0 sm:hidden">
          <div className="flex flex-col">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={`skeleton-mob-${i}`} className="p-4 border-b border-gray-100 bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
              ))
            ) : paginatedInvoices.map((invoice) => (
              <div 
                key={invoice.id} 
                className="group p-4 border-b border-gray-100 bg-white hover:bg-blue-50/50 active:bg-blue-100/50 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3" onClick={() => router.push(`/factures/nouvelle?id=${invoice.id}`)}>
                  <div>
                    <div className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{invoice.client}</div>
                    <div className="text-sm text-gray-500 font-medium">{invoice.id}</div>
                  </div>
                  {getStatusBadge(invoice.status)}
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-sm text-gray-500 font-medium">
                    <div>Émise le : {invoice.date}</div>
                    <div>Échéance : {invoice.dueDate}</div>
                  </div>
                  <div className="font-bold text-gray-900 tabular-nums text-lg">
                    {formatFCFA(invoice.amount)}
                  </div>
                </div>
              </div>
            ))}
            {!isLoading && filteredInvoices.length === 0 && (
              <div className="p-8 text-center text-gray-500 font-medium bg-white">
                Aucune facture trouvée.
              </div>
            )}
          </div>
        </CardContent>
        <CardContent className="p-4 border-t border-gray-100 bg-gray-50/30">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1)); }}
                  className={cn("rounded-xl", currentPage === 1 && "pointer-events-none opacity-50")} 
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink 
                    href="#" 
                    isActive={currentPage === i + 1}
                    onClick={(e) => { e.preventDefault(); setCurrentPage(i + 1); }}
                    className="rounded-xl"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p + 1)); }}
                  className={cn("rounded-xl", currentPage === totalPages && "pointer-events-none opacity-50")} 
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>
    </div>
  );
}
