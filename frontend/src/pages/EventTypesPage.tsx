import { useState, useEffect, useCallback } from 'react';
import { EventType, EventTypeFormData } from '../types';
import { eventTypesApi } from '../api';
import PageHeader   from '../components/layout/PageHeader';
import EventTypeCard from '../components/events/EventTypeCard';
import EventTypeForm from '../components/events/EventTypeForm';
import Modal        from '../components/layout/Modal';
import Toast        from '../components/layout/Toast';
import { FullPageSpinner } from '../components/layout/Spinner';

export default function EventTypesPage() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading]       = useState(true);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editing, setEditing]       = useState<EventType | null>(null);
  const [toast, setToast]           = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [deleteItem, setDeleteItem] = useState<EventType | null>(null);

  const fetchEventTypes = useCallback(async () => {
    try {
      const res = await eventTypesApi.getAll();
      setEventTypes(res.data);
    } catch {
      setToast({ msg: 'Failed to load event types', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEventTypes(); }, [fetchEventTypes]);

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit   = (et: EventType) => { setEditing(et); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const handleSubmit = async (data: EventTypeFormData) => {
    if (editing) {
      await eventTypesApi.update(editing.id, data);
      setToast({ msg: 'Event type updated', type: 'success' });
    } else {
      await eventTypesApi.create(data);
      setToast({ msg: 'Event type created', type: 'success' });
    }
    closeModal();
    fetchEventTypes();
  };

  const handleDelete = (et: EventType) => {
  setDeleteItem(et); // open modal ONLY
  };
    
  const confirmDelete = async () => {
  if (!deleteItem) return;

  try {
    await eventTypesApi.delete(deleteItem.id);
    setToast({ msg: 'Event type deleted', type: 'success' });
    fetchEventTypes();
  } catch {
    setToast({ msg: 'Failed to delete', type: 'error' });
  } finally {
    setDeleteItem(null);
  }
};

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <PageHeader
        title="Event Types"
        subtitle="Create event types that you can share for people to book time with you."
        action={
          <button onClick={openCreate} className="btn-primary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Event Type
          </button>
        }
      />

      {loading ? (
        <FullPageSpinner />
      ) : eventTypes.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No event types yet</h3>
          <p className="text-gray-500 text-sm mb-4">Create your first event type to start accepting bookings.</p>
          <button onClick={openCreate} className="btn-primary">Create Event Type</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {eventTypes.map((et) => (
            <EventTypeCard
              key={et.id}
              eventType={et}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editing ? 'Edit Event Type' : 'New Event Type'}
      >
        <EventTypeForm
          initial={editing ?? undefined}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>

      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {deleteItem && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-2xl w-96 shadow-xl animate-fade-in">

      <h2 className="text-lg font-semibold mb-2">
        Delete "{deleteItem.name}"?
      </h2>

      <p className="text-sm text-gray-500 mb-4">
        This cannot be undone.
      </p>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setDeleteItem(null)}
          className="px-4 py-2 border rounded-lg"
        >
          Cancel
        </button>


        <button
          onClick={confirmDelete}
          disabled={!deleteItem}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          Delete
        </button>
      </div>

    </div>
  </div>
)}
    </div>
  );
}