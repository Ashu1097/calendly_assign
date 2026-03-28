import { useState, useEffect } from 'react';
import { AvailabilitySlot } from '../types';
import { availabilityApi } from '../api';
import PageHeader         from '../components/layout/PageHeader';
import AvailabilityEditor from '../components/availability/AvailabilityEditor';
import Toast              from '../components/layout/Toast';
import { FullPageSpinner } from '../components/layout/Spinner';


export default function AvailabilityPage({}) {
  const [slots, setSlots]   = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]     = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    availabilityApi.get()
      .then((res) => setSlots(res.data))
      .catch(() => setToast({ msg: 'Failed to load availability', type: 'error' }))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (updated: AvailabilitySlot[]) => {
  try {
    setSaving(true);
    const res = await availabilityApi.update(updated);
    setSlots(res.data);
    setToast({ msg: 'Availability saved!', type: 'success' });
  } catch {
    setToast({ msg: 'Failed to save availability', type: 'error' });
  } finally {
    setSaving(false);
  }
};

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <PageHeader
        title="Availability"
        subtitle="Set your weekly schedule. Invitees can only book during these hours."
      />

      {loading ? (
        <FullPageSpinner />
      ) : (
        <AvailabilityEditor
          slots={slots}
          onSave={handleSave}
          loading={saving}
    />
      )}

      {toast && (
        <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
