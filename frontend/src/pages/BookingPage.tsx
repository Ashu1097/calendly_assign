import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { EventType, AvailabilitySlot, BookingFormData } from '../types';
import { eventTypesApi, availabilityApi, bookingApi } from '../api';
import { formatDuration } from '../utils';
import Calendar       from '../components/booking/Calendar';
import TimeSlotPicker from '../components/booking/TimeSlotPicker';
import BookingForm    from '../components/booking/BookingForm';
import { FullPageSpinner } from '../components/layout/Spinner';
import toast from "react-hot-toast";
type Step = 'datetime' | 'form';

export default function BookingPage() {
  const { slug }    = useParams<{ slug: string }>();
  const navigate    = useNavigate();

  const [eventType, setEventType]     = useState<EventType | null>(null);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slots, setSlots]             = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [step, setStep]               = useState<Step>('datetime');
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError]             = useState('');
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Load event type + availability
  useEffect(() => {
    if (!slug) return;
    Promise.all([
      eventTypesApi.getBySlug(slug),
      availabilityApi.get(),
    ])
      .then(([etRes, avRes]) => {
        setEventType(etRes.data);
        setAvailability(avRes.data);
      })
      .catch(() => setError('Event not found or unavailable.'))
      .finally(() => setLoadingPage(false));
  }, [slug]);

  // Load available time slots when date selected
  useEffect(() => {
    if (!selectedDate || !eventType) return;
    setSlots([]);
    setSelectedSlot(null);
    setLoadingSlots(true);
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    availabilityApi
      .getSlots(eventType.id, dateStr)
      .then((res) => setSlots(res.data.slots))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [selectedDate, eventType]);
  

 

const handleBook = async (formData: BookingFormData) => {
  if (!eventType || !selectedSlot) return;

  try {
    const promise = bookingApi.create({
      event_type_id: eventType.id,
      invitee_name: formData.invitee_name,
      invitee_email: formData.invitee_email,
      start_time: selectedSlot,
      notes: formData.notes,
    });

    const res = await toast.promise(promise, {
      loading: "Booking your slot...",
      success: "You're booked!",
      error: "Something went wrong",
    });

    // ✅ navigate after success
    navigate(`/confirmation/${res.data.id}`);

  } catch (err: any) {
    if (err?.response?.status === 409) {
      toast.error("Slot already booked");
      setStep("datetime");
      setSelectedSlot(null);
    }
  }
};
  const availableDays = availability
    .filter((s) => s.is_active)
    .map((s) => s.day_of_week);

  if (loadingPage) return <FullPageSpinner />;
  if (error || !eventType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Page not found</h2>
          <p className="text-gray-500">{error || 'This booking link is no longer active.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row transition-all">

        {/* ── Left panel: event details ─────────────────────────────────────── */}
        <div className="w-full md:w-72 flex-shrink-0 p-8 border-b md:border-b-0 md:border-r border-gray-200">
          <div
            className="w-10 h-10 rounded-full mb-4 flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: eventType.color }}
          >
            {(eventType.owner_name ?? 'U')[0].toUpperCase()}
          </div>

          <p className="text-sm text-gray-500 mb-1">{eventType.owner_name ?? 'Host'}</p>
          <h1 className="text-xl font-bold text-gray-900 mb-3">{eventType.name}</h1>

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatDuration(eventType.duration)}
          </div>

          {selectedSlot && (
            <div className="flex items-center gap-2 text-sm text-blue-600 mt-3 font-medium">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {format(new Date(selectedSlot), 'EEE, MMM d · h:mm a')}
            </div>
          )}

          {eventType.description && (
            <p className="mt-4 text-sm text-gray-500 leading-relaxed">{eventType.description}</p>
          )}
        </div>

        {/* ── Right panel: calendar / form ──────────────────────────────────── */}
        <div className="flex-1 p-8">
          {step === 'datetime' ? (
            <>
              <h2 className="text-base font-semibold text-gray-900 mb-6">Select a Date & Time</h2>
              <div className="flex flex-col md:flex-row gap-8">
                {/* Calendar */}
                <div className="flex-1">
                  <Calendar
                    selectedDate={selectedDate}
                    onSelectDate={(date) => {
                      const today = new Date();
                      today.setHours(0,0,0,0);

                      if (date < today) return; // ❌ block past dates
                      setSelectedDate(date);
                    }}
                    availableDays={availableDays}                 
                  />
                </div>

                {/* Time slots */}
                
                {selectedDate && (
                  <div className="md:w-48">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      {format(selectedDate, 'EEEE, MMM d')}
                    </p>
                    {selectedDate && !loadingSlots && slots.length > 0 && (
                      <p className="text-xs text-gray-400 mb-2">Select a time</p>
                    )}
                    {loadingSlots && (
                      <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="h-10 bg-gray-200 animate-pulse rounded"></div>
                        ))}
                      </div>
                    )}
                    {!loadingSlots && selectedDate && slots.length === 0 && (
                      <p className="text-sm text-gray-400">No available slots for this date</p>
                    )}
                    <TimeSlotPicker
                      slots={slots}
                      selectedSlot={selectedSlot}
                      onSelectSlot={(slot) => {
                        setSelectedSlot(slot);
                        setTimeout(() => setStep('form'), 150); // smooth UX
                      }}
                      loading={loadingSlots}                    
                    />
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-base font-semibold text-gray-900 mb-6">Enter Your Details</h2>
              <BookingForm
                eventType={eventType}
                selectedSlot={selectedSlot!}
                onSubmit={handleBook}
                onBack={() => setStep('datetime')}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
