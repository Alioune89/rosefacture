"use client";

import { useState } from "react";
import { Plus, MoreVertical, Search, Filter, Package, Tag } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

const formatFCFA = (amount: number) => {
  return new Intl.NumberFormat('fr-SN', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0
  }).format(amount).replace("XOF", "FCFA");
};

const PRODUCTS = [
  { id: "PRD-001", name: "Création de site web vitrine", category: "Service", price: 350000, stock: null, status: "actif" },
  { id: "PRD-002", name: "Maintenance mensuelle", category: "Service", price: 50000, stock: null, status: "actif" },
  { id: "PRD-003", name: "Logo et Charte graphique", category: "Design", price: 150000, stock: null, status: "actif" },
  { id: "PRD-004", name: "Heure de consultation", category: "Service", price: 25000, stock: null, status: "actif" },
  { id: "PRD-005", name: "Abonnement Hébergement (Annuel)", category: "Produit", price: 75000, stock: 12, status: "actif" },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "actif":
      return <Badge className="bg-green-50 text-green-700 hover:bg-green-50 rounded-full border-0 px-3 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" /> Actif</Badge>;
    case "inactif":
      return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 rounded-full border-0 px-3 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-2" /> Inactif</Badge>;
    default:
      return null;
  }
};

export default function ProduitsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Produits & Services</h1>
          <p className="text-sm sm:text-base text-gray-500 font-medium mt-1">Gérez votre catalogue pour facturer plus vite.</p>
        </div>
        <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm transition-all active:scale-[0.98] h-11 px-6">
          <Plus className="w-5 h-5 mr-2" />
          Nouvel Article
        </Button>
      </div>

      <Card className="rounded-2xl border-gray-200 shadow-sm bg-white hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] active:shadow-sm transition-all duration-300 overflow-hidden animate-in fade-in slide-in-from-bottom-4 fill-mode-both delay-100">
        <CardHeader className="pt-6 px-4 sm:px-6 pb-4 border-b border-gray-100 bg-white">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative w-full md:max-w-md group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-blue-600" />
              <Input 
                placeholder="Rechercher par nom, catégorie..." 
                className="pl-10 rounded-xl bg-gray-50/50 border-gray-200 h-11 focus:bg-white transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="rounded-xl border-gray-200 h-11 px-4 text-gray-600 hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              Filtrer
            </Button>
          </div>
        </CardHeader>
        
        {/* Vue Desktop */}
        <CardContent className="p-0 hidden sm:block">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                <TableHead className="font-semibold text-gray-800 pl-6 py-4">Nom de l'article</TableHead>
                <TableHead className="font-semibold text-gray-800 py-4">Catégorie</TableHead>
                <TableHead className="font-semibold text-gray-800 py-4 text-right">Prix Unitaire</TableHead>
                <TableHead className="font-semibold text-gray-800 py-4 text-center">Stock</TableHead>
                <TableHead className="font-semibold text-gray-800 py-4 text-center">Statut</TableHead>
                <TableHead className="pr-6 py-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow 
                  key={product.id} 
                  className="group hover:bg-blue-50/50 hover:shadow-sm hover:-translate-y-[1px] active:scale-[0.99] active:bg-blue-100/50 transition-all duration-200 cursor-pointer bg-white"
                >
                  <TableCell className="pl-6 py-4">
                    <div className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{product.name}</div>
                    <div className="text-gray-500 font-medium text-xs mt-1 uppercase tracking-wider">{product.id}</div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center text-gray-600 font-medium bg-gray-100 w-fit px-2.5 py-1 rounded-md text-xs">
                      <Tag className="w-3 h-3 mr-1.5 text-gray-400" />
                      {product.category}
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-gray-900 tabular-nums py-4 text-right">
                    {formatFCFA(product.price)}
                  </TableCell>
                  <TableCell className="py-4 text-center text-gray-500 font-medium">
                    {product.stock !== null ? product.stock : "—"}
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    {getStatusBadge(product.status)}
                  </TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center justify-center w-9 h-9 text-gray-400 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100 ml-auto">
                        <MoreVertical className="w-5 h-5" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px] rounded-xl bg-white shadow-lg border border-gray-100 z-50">
                        <DropdownMenuItem className="cursor-pointer font-medium">Modifier</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer font-medium">Dupliquer</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer font-medium text-red-600 focus:text-red-600">Supprimer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-500 bg-white font-medium">
                    Aucun article trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>

        {/* Vue Mobile */}
        <CardContent className="p-0 sm:hidden">
          <div className="flex flex-col">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="group p-4 border-b border-gray-100 bg-white hover:bg-blue-50/50 active:bg-blue-100/50 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{product.name}</div>
                    <div className="flex items-center text-gray-500 font-medium text-xs mt-1.5 gap-2">
                      <span className="uppercase tracking-wider">{product.id}</span>
                      <span>•</span>
                      <span className="bg-gray-100 px-2 py-0.5 rounded-md text-gray-600 flex items-center">
                        <Tag className="w-3 h-3 mr-1" />
                        {product.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-end border-t border-gray-50 pt-3 mt-3">
                  <div className="text-sm">
                    {product.stock !== null ? (
                      <span className="text-gray-500 font-medium">Stock: <strong className="text-gray-700">{product.stock}</strong></span>
                    ) : (
                      <span className="text-gray-400 font-medium italic">Service sans stock</span>
                    )}
                  </div>
                  <div className="font-bold text-blue-600 tabular-nums text-lg">
                    {formatFCFA(product.price)}
                  </div>
                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="p-8 text-center text-gray-500 font-medium bg-white">
                Aucun article trouvé.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
