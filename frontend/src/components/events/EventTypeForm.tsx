import { useState, useEffect } from 'react';
import { EventType, EventTypeFormData } from '../../types';
import { slugify } from '../../utils';

interface EventTypeFormProps {
  initial?: EventType;
  onSubmit: (data: EventTypeFormData) => Promise<void>;
  onCancel: () => void;
}

const COLOR_PRESETS = [
  '#0069FF', '#7C3AED', '#10B981', '#F59E0B',
  '#EF4444', '#EC4899', '#14B8A6', '#6B7280',
];

const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120];

export default function EventTypeForm({ initial, onSubmit, onCancel }: EventTypeFormProps) {
  const [form, setForm] = useState<EventTypeFormData>({
    name:        initial?.name        ?? '',
    slug:        initial?.slug        ?? '',
    duration:    initial?.duration    ?? 30,
    description: initial?.description ?? '',
    color:       initial?.color       ?? '#0069FF',
  });
  const [slugManual, setSlugManual] = useState(!!initial);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  // Auto-generate slug from name
  useEffect(() => {
    if (!slugManual && form.name) {
      setForm((f) => ({ ...f, slug: slugify(f.name) }));
    }
  }, [form.name, slugManual]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) return setError('Name is required');
    if (!form.slug.trim()) return setError('Slug is required');
    try {
      setLoading(true);
      await onSubmit(form);
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="label">Event Name *</label>
        <input
          className="input"
          placeholder="e.g. 30 Minute Meeting"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
        />
      </div>

      {/* Slug */}
      <div>
        <label className="label">URL Slug *</label>
        <div className="flex items-center rounded-lg border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white">
          <span className="px-3 py-2 text-sm text-gray-400 bg-gray-50 border-r border-gray-300 select-none whitespace-nowrap">
            calendly.com/
          </span>
          <input
            className="flex-1 px-3 py-2 text-sm outline-none"
            value={form.slug}
            onChange={(e) => {
              setSlugManual(true);
              setForm((f) => ({ ...f, slug: e.target.value }));
            }}
            required
          />
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="label">Duration</label>
        <div className="grid grid-cols-3 gap-2">
          {DURATION_OPTIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setForm((f) => ({ ...f, duration: d }))}
              className={`py-2 text-sm rounded-lg border font-medium transition-colors ${
                form.duration === d
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {d < 60 ? `${d} min` : `${d / 60} hr`}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="label">Color</label>
        <div className="flex items-center gap-2 flex-wrap">
          {COLOR_PRESETS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setForm((f) => ({ ...f, color: c }))}
              className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                form.color === c ? 'border-gray-800 scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
          <input
            type="color"
            value={form.color}
            onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
            className="w-7 h-7 rounded-full cursor-pointer border border-gray-300"
            title="Custom color"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="label">Description</label>
        <textarea
          className="input resize-none"
          rows={3}
          placeholder="Write a summary about this event type..."
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Saving…' : initial ? 'Save Changes' : 'Create Event Type'}
        </button>
      </div>
    </form>
  );
}
