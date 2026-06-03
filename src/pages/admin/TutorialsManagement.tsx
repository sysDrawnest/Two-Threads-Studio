import React, { useState } from 'react';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import { mockAdminTutorials, AdminTutorial } from '../../data/adminData';

const TutorialsManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTutorial, setEditTutorial] = useState<AdminTutorial | null>(null);
  const [form, setForm] = useState({ title: '', instructor: '', difficulty: 'Beginner', duration: '', description: '', videoUrl: '', status: 'draft' });

  const openAdd = () => { setEditTutorial(null); setForm({ title: '', instructor: '', difficulty: 'Beginner', duration: '', description: '', videoUrl: '', status: 'draft' }); setIsModalOpen(true); };
  const openEdit = (t: AdminTutorial) => { setEditTutorial(t); setForm({ title: t.title, instructor: t.instructor, difficulty: t.difficulty, duration: t.duration, description: '', videoUrl: '', status: t.status }); setIsModalOpen(true); };

  const inputCls = "w-full p-2.5 border border-outline-variant focus:border-primary-container focus:outline-none bg-transparent font-sans text-sm";
  const labelCls = "block font-sans text-xs uppercase tracking-widest text-primary-container mb-1.5";

  const columns = [
    {
      key: 'thumbnail', label: 'Tutorial',
      render: (t: AdminTutorial) => (
        <div className="flex items-center gap-3">
          <img src={t.thumbnail} alt={t.title} className="w-12 h-8 object-cover flex-shrink-0" />
          <span className="font-sans text-sm text-primary-container">{t.title}</span>
        </div>
      )
    },
    { key: 'instructor', label: 'Instructor', sortable: true },
    { key: 'difficulty', label: 'Difficulty', sortable: true },
    { key: 'duration', label: 'Duration' },
    { key: 'enrollments', label: 'Enrollments', sortable: true },
    {
      key: 'status', label: 'Status',
      render: (t: AdminTutorial) => (
        <span className={`font-sans text-[10px] px-2 py-1 uppercase tracking-wider ${t.status === 'published' ? 'bg-[#e8f4e8] text-[#3a6b3a]' : 'bg-surface-container text-on-surface-variant'}`}>{t.status}</span>
      )
    },
    {
      key: 'actions', label: 'Actions',
      render: (t: AdminTutorial) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(t)} className="font-sans text-xs text-on-secondary-container hover:text-primary-container bg-transparent border-none cursor-pointer underline">Edit</button>
          <button className="font-sans text-xs text-error hover:text-error/70 bg-transparent border-none cursor-pointer underline">Delete</button>
        </div>
      )
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-light text-primary-container">Tutorials</h1>
          <p className="font-sans text-sm text-on-surface-variant mt-1">{mockAdminTutorials.length} tutorials total</p>
        </div>
        <button onClick={openAdd} className="bg-primary-container text-inverse-on-surface px-6 py-3 font-sans text-xs tracking-widest uppercase border-none cursor-pointer hover:bg-[#5a3d2b] transition-colors flex items-center gap-2">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Tutorial
        </button>
      </div>

      <div className="bg-background border border-outline-variant p-6">
        <DataTable data={mockAdminTutorials} columns={columns} searchPlaceholder="Search tutorials..." />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editTutorial ? 'Edit Tutorial' : 'Add Tutorial'} size="lg">
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-5" onSubmit={e => { e.preventDefault(); setIsModalOpen(false); }}>
          <div className="sm:col-span-2">
            <label className={labelCls}>Title</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputCls} placeholder="Botanical Thread Painting" required />
          </div>
          <div>
            <label className={labelCls}>Instructor</label>
            <input value={form.instructor} onChange={e => setForm(f => ({ ...f, instructor: e.target.value }))} className={inputCls} placeholder="Elara Vance" required />
          </div>
          <div>
            <label className={labelCls}>Difficulty</label>
            <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))} className={inputCls}>
              <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Duration</label>
            <input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} className={inputCls} placeholder="4h 30m" required />
          </div>
          <div>
            <label className={labelCls}>Status</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={inputCls}>
              <option value="draft">Draft</option><option value="published">Published</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Video URL</label>
            <input value={form.videoUrl} onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))} className={inputCls} placeholder="https://..." />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={inputCls} rows={3} placeholder="A comprehensive course on..." />
          </div>
          <div className="sm:col-span-2 flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 border border-outline-variant bg-transparent font-sans text-sm text-primary-container cursor-pointer hover:bg-surface-container transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2.5 bg-primary-container text-inverse-on-surface font-sans text-sm border-none cursor-pointer hover:bg-[#5a3d2b] transition-colors">Save Tutorial</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TutorialsManagement;
