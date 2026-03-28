import { useState } from "react";
import { AvailabilitySlot, DAY_NAMES } from "../../types";

type TimeSlot = {
  start_time: string;
  end_time: string;
};

type DayAvailability = {
  day_of_week: number;
  is_active: boolean;
  slots: TimeSlot[];
};

type Props = {
  slots: AvailabilitySlot[];
  onSave: (slots: AvailabilitySlot[]) => Promise<void>;
  loading?: boolean;
};

export default function AvailabilityEditor({ slots, onSave, loading }: Props) {
  // 🔥 Convert backend → UI format
  const initial: DayAvailability[] = DAY_NAMES.map((_, i) => {
    const daySlots = slots.filter((s) => s.day_of_week === i);

    return {
      day_of_week: i,
      is_active: daySlots.length > 0,
      slots:
        daySlots.length > 0
          ? daySlots.map((s) => ({
              start_time: s.start_time,
              end_time: s.end_time,
            }))
          : [{ start_time: "09:00", end_time: "17:00" }],
    };
  });

  const [local, setLocal] = useState<DayAvailability[]>(initial);
  const [error, setError] = useState("");

  // Toggle day
  const toggleDay = (day: number) => {
    setLocal((prev) =>
      prev.map((d) =>
        d.day_of_week === day
          ? { ...d, is_active: !d.is_active }
          : d
      )
    );
  };

  // Add slot
  const addSlot = (day: number) => {
    setLocal((prev) =>
      prev.map((d) =>
        d.day_of_week === day
          ? {
              ...d,
              slots: [...d.slots, { start_time: "09:00", end_time: "17:00" }],
            }
          : d
      )
    );
  };

  // Remove slot
  const removeSlot = (day: number, idx: number) => {
    setLocal((prev) =>
      prev.map((d) =>
        d.day_of_week === day
          ? {
              ...d,
              slots: d.slots.filter((_, i) => i !== idx),
            }
          : d
      )
    );
  };

  // Update time
  const updateTime = (
    day: number,
    idx: number,
    field: "start_time" | "end_time",
    value: string
  ) => {
    setLocal((prev) =>
      prev.map((d) =>
        d.day_of_week === day
          ? {
              ...d,
              slots: d.slots.map((s, i) =>
                i === idx ? { ...s, [field]: value } : s
              ),
            }
          : d
      )
    );
  };

  // Save (convert UI → backend)
  const handleSave = async () => {
    setError("");

    const flattened: AvailabilitySlot[] = [];

    for (const day of local) {
      if (!day.is_active) continue;

      for (const slot of day.slots) {
        if (slot.start_time >= slot.end_time) {
          setError(`${DAY_NAMES[day.day_of_week]}: invalid time range`);
          return;
        }

        flattened.push({
          day_of_week: day.day_of_week,
          start_time: slot.start_time,
          end_time: slot.end_time,
        } as AvailabilitySlot);
      }
    }

    try {
      await onSave(flattened);
    } catch {
      setError("Failed to save availability");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow max-w-3xl mx-auto">
      <h2 className="text-lg font-semibold mb-4">Weekly Hours</h2>

      {error && (
        <div className="mb-4 text-red-600 bg-red-50 px-3 py-2 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {local.map((day) => (
          <div key={day.day_of_week} className="border-b pb-4">

            {/* HEADER */}
            <div className="flex items-center gap-4 mb-2">
              <input
                type="checkbox"
                checked={day.is_active}
                onChange={() => toggleDay(day.day_of_week)}
              />

              <span className="w-28 font-medium">
                {DAY_NAMES[day.day_of_week]}
              </span>
            </div>

            {/* SLOTS */}
            {day.is_active ? (
              <div className="ml-10 space-y-2">

                {day.slots.map((slot, idx) => (
                  <div key={idx} className="flex items-center gap-2">

                    <input
                      type="time"
                      value={slot.start_time}
                      onChange={(e) =>
                        updateTime(day.day_of_week, idx, "start_time", e.target.value)
                      }
                      className="border px-2 py-1 rounded"
                    />

                    <span>-</span>

                    <input
                      type="time"
                      value={slot.end_time}
                      onChange={(e) =>
                        updateTime(day.day_of_week, idx, "end_time", e.target.value)
                      }
                      className="border px-2 py-1 rounded"
                    />

                    <button
                      onClick={() => removeSlot(day.day_of_week, idx)}
                      className="text-red-500 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => addSlot(day.day_of_week)}
                  className="text-blue-600 text-sm"
                >
                  + Add hours
                </button>

              </div>
            ) : (
              <div className="ml-10 text-gray-400 text-sm">Unavailable</div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}