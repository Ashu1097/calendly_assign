import { useState } from 'react';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addMonths, subMonths, eachDayOfInterval, isSameMonth,
  isSameDay, isToday, isBefore, startOfDay,
} from 'date-fns';
import { SHORT_DAY_NAMES } from '../../types';

interface CalendarProps {
  selectedDate:   Date | null;
  onSelectDate:   (date: Date) => void;
  availableDays:  number[];   // day_of_week values that have slots
}

export default function Calendar({ selectedDate, onSelectDate, availableDays }: CalendarProps) {
  const [viewMonth, setViewMonth] = useState(new Date());
  const today = startOfDay(new Date());

  const monthStart = startOfMonth(viewMonth);
  const monthEnd   = endOfMonth(viewMonth);
  const gridStart  = startOfWeek(monthStart);
  const gridEnd    = endOfWeek(monthEnd);
  const days       = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const isAvailable = (d: Date) =>
    isSameMonth(d, viewMonth) &&
    !isBefore(d, today) &&
    availableDays.includes(d.getDay());

  return (
    <div className="select-none">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setViewMonth((m) => subMonths(m, 1))}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h3 className="text-base font-semibold text-gray-900">
          {format(viewMonth, 'MMMM yyyy')}
        </h3>

        <button
          onClick={() => setViewMonth((m) => addMonths(m, 1))}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          aria-label="Next month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {SHORT_DAY_NAMES.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {days.map((day) => {
          const available = isAvailable(day);
          const selected  = selectedDate && isSameDay(day, selectedDate);
          const today_    = isToday(day);
          const inMonth   = isSameMonth(day, viewMonth);

          return (
            <button
              key={day.toISOString()}
              disabled={!available}
              onClick={() => available && onSelectDate(day)}
              className={[
                'mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors',
                !inMonth                         && 'invisible',
                available && !selected           && 'text-gray-900 hover:bg-blue-100 hover:text-blue-700 cursor-pointer',
                available && today_ && !selected && 'ring-2 ring-blue-400 ring-offset-1',
                selected                         && 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer',
                !available && inMonth            && 'text-gray-300 cursor-not-allowed',
              ].filter(Boolean).join(' ')}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}
