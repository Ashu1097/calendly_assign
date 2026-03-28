import { format, parseISO } from 'date-fns';
import Spinner from '../layout/Spinner';

interface TimeSlotPickerProps {
  slots:          string[];   // ISO strings
  selectedSlot:   string | null;
  onSelectSlot:   (slot: string) => void;
  loading:        boolean;
}

export default function TimeSlotPicker({ slots, selectedSlot, onSelectSlot, loading }: TimeSlotPickerProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <svg className="w-10 h-10 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm">No available times on this day</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
      {slots.map((slot) => {
        const isSelected = slot === selectedSlot;
        return (
          <button
            key={slot}
            onClick={() => onSelectSlot(slot)}
            className={[
              'w-full py-2.5 px-4 rounded-lg text-sm font-medium border transition-colors text-center',
              isSelected
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-800 border-gray-300 hover:border-blue-400 hover:text-blue-600',
            ].join(' ')}
          >
            {format(parseISO(slot), 'h:mm a')}
          </button>
        );
      })}
    </div>
  );
}
