import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Search, Phone, Mail, Pencil, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { SlideOver } from '../components/SlideOver';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { TableSkeleton } from '../components/LoadingSkeleton';
import { useData } from '../hooks/useData';
import type { Contact } from '../lib/database';

type ContactForm = {
  name: string;
  role: string;
  company: string;
  phone: string;
  email: string;
  notes: string;
};

export function Contacts() {
  const { data: rawData, loading, create, update, remove } = useData('contacts');
  const data = rawData as unknown as Contact[];
  const [search, setSearch] = useState('');
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ContactForm>();

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.role?.toLowerCase().includes(q) ||
      c.company?.toLowerCase().includes(q) ||
      c.phone?.includes(q) ||
      c.email?.toLowerCase().includes(q)
    );
  }, [data, search]);

  function openNew() {
    setEditing(null);
    reset({ name: '', role: '', company: '', phone: '', email: '', notes: '' });
    setSlideOpen(true);
  }

  function openEdit(contact: Contact) {
    setEditing(contact);
    reset({
      name: contact.name,
      role: contact.role || '',
      company: contact.company || '',
      phone: contact.phone || '',
      email: contact.email || '',
      notes: contact.notes || '',
    });
    setSlideOpen(true);
  }

  async function onSubmit(form: ContactForm) {
    try {
      if (editing) {
        await update(editing.id, form);
        toast.success('Contact updated');
      } else {
        await create(form);
        toast.success('Contact added');
      }
      setSlideOpen(false);
    } catch {
      toast.error('Failed to save contact');
    }
  }

  async function onDelete() {
    if (!deleteTarget) return;
    try {
      await remove(deleteTarget.id);
      toast.success('Contact deleted');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete');
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-40 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-56 bg-slate-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-slate-200 rounded animate-pulse" />
        </div>
        <TableSkeleton rows={5} cols={4} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Contacts</h2>
          <p className="text-slate-500 text-sm mt-1">Key business contacts and suppliers</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-[#1B2A4A] text-white rounded-lg font-medium hover:bg-[#1e335a] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Contact</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-72">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No contacts found"
          description={search ? 'Try adjusting your search terms' : 'Add your first contact to get started'}
          actionLabel={search ? undefined : 'Add Contact'}
          onAction={search ? undefined : openNew}
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="p-4">Name & Role</th>
                  <th className="p-4">Company</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4 w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map(contact => (
                  <tr key={contact.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => openEdit(contact)}>
                    <td className="p-4">
                      <div className="font-medium text-slate-900">{contact.name}</div>
                      {contact.role && <div className="text-xs text-slate-500">{contact.role}</div>}
                    </td>
                    <td className="p-4 text-slate-600">{contact.company || '-'}</td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        {contact.phone && (
                          <a
                            href={`tel:${contact.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 text-[#0D9488] hover:underline text-sm"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            {contact.phone}
                          </a>
                        )}
                        {contact.email && (
                          <a
                            href={`mailto:${contact.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 text-[#0D9488] hover:underline text-sm"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            {contact.email}
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <button onClick={(e) => { e.stopPropagation(); openEdit(contact); }} className="p-1 text-slate-400 hover:text-slate-700">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(contact); }} className="p-1 text-slate-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SlideOver Form */}
      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title={editing ? 'Edit Contact' : 'Add Contact'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
            <input {...register('name', { required: true })} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <input {...register('role')} placeholder="e.g. Accountant, Supplier" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
            <input {...register('company')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
            <input {...register('phone')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" {...register('email')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
            <textarea {...register('notes')} rows={3} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button type="button" onClick={() => setSlideOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-[#1B2A4A] rounded-lg hover:bg-[#1e335a] transition-colors disabled:opacity-50">
              {isSubmitting ? 'Saving...' : editing ? 'Update' : 'Add'} {isSubmitting ? '' : 'Contact'}
            </button>
          </div>
        </form>
      </SlideOver>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={onDelete}
        title="Delete Contact"
        description={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
      />
    </div>
  );
}
