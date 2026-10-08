import { supabase } from './supabase';

export async function getInvoices() {
  const { data, error } = await supabase.from('invoices').select('*').order('created_at', { ascending: false });
  if (error || !data) return [];
  return data.map((inv: any) => ({
    id: inv.id,
    client: inv.client,
    date: inv.date,
    dueDate: inv.due_date,
    amount: inv.amount,
    status: inv.status,
    items: inv.items,
    createdAt: inv.created_at
  }));
}

export async function saveInvoice(invoice: any) {
  const { error } = await supabase.from('invoices').upsert({
    id: invoice.id,
    client: invoice.client,
    date: invoice.date,
    due_date: invoice.dueDate,
    amount: invoice.amount,
    status: invoice.status,
    items: invoice.items,
    created_at: invoice.createdAt || new Date().toISOString()
  });
  if (error) console.error("Error saving invoice:", error);
}

export async function updateInvoiceStatus(id: string, status: string) {
  const { error } = await supabase.from('invoices').update({ status }).eq('id', id);
  if (error) console.error("Error updating invoice status:", error);
}

export async function getSettings() {
  const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();
  if (error || !data) return {
    legalName: "",
    rc: "",
    ninea: "",
    address: "",
    email: "",
    phone: ""
  };
  return {
    legalName: data.legal_name,
    rc: data.rc,
    ninea: data.ninea,
    address: data.address,
    email: data.email,
    phone: data.phone
  };
}

export async function saveSettings(settings: any) {
  const { error } = await supabase.from('settings').upsert({
    id: 1,
    legal_name: settings.legalName,
    rc: settings.rc,
    ninea: settings.ninea,
    address: settings.address,
    email: settings.email,
    phone: settings.phone
  });
  if (error) console.error("Error saving settings:", error);
}

export async function getClients() {
  const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
  if (error || !data) return [];
  
  // Format keys to match frontend (camelCase)
  return data.map((c: any) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    address: c.address,
    totalBilled: c.total_billed,
    status: c.status,
    createdAt: c.created_at
  }));
}

export async function saveClient(client: any) {
  let id = client.id;
  if (!id) {
    const { data: countData } = await supabase.from('clients').select('id', { count: 'exact' });
    const count = countData ? countData.length : 0;
    id = `CL-${(count + 1).toString().padStart(3, '0')}`;
  }

  const { error } = await supabase.from('clients').upsert({
    id: id,
    name: client.name,
    email: client.email,
    phone: client.phone,
    address: client.address,
    total_billed: client.totalBilled || 0,
    status: client.status || 'actif',
    created_at: client.createdAt || new Date().toISOString()
  });
  if (error) console.error("Error saving client:", error);
  return id;
}

export async function updateClientStatus(id: string, status: string) {
  const { error } = await supabase.from('clients').update({ status }).eq('id', id);
  if (error) console.error("Error updating client status:", error);
}

export async function deleteInvoice(id: string) {
  // fetch invoice to get client and amount
  const { data: invoice } = await supabase.from('invoices').select('client, amount').eq('id', id).single();
  
  if (invoice) {
    // find client by name
    const { data: clientData } = await supabase.from('clients').select('id, total_billed, status').eq('name', invoice.client).single();
    if (clientData) {
       // update client total billed
       const newTotal = Math.max(0, (clientData.total_billed || 0) - (invoice.amount || 0));
       const newStatus = newTotal === 0 ? 'inactif' : clientData.status;
       await supabase.from('clients').update({ total_billed: newTotal, status: newStatus }).eq('id', clientData.id);
    }
  }

  const { error } = await supabase.from('invoices').delete().eq('id', id);
  if (error) console.error("Error deleting invoice:", error);
}

export async function deleteClient(id: string) {
  const { error } = await supabase.from('clients').delete().eq('id', id);
  if (error) console.error("Error deleting client:", error);
}

