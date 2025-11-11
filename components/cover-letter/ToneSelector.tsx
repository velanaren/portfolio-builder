/**
 * Tone Selector Component
 * Allows user to select cover letter tone
 */

'use client';

interface ToneSelectorProps {
  selectedTone: 'formal' | 'conversational' | 'energetic';
  onToneChange: (tone: 'formal' | 'conversational' | 'energetic') => void;
}

const tones = [
  {
    id: 'formal' as const,
    name: 'Formal',
    description: 'Professional, corporate, structured',
  },
  {
    id: 'conversational' as const,
    name: 'Conversational',
    description: 'Friendly, personable, relatable',
  },
  {
    id: 'energetic' as const,
    name: 'Energetic',
    description: 'Enthusiastic, dynamic, passionate',
  },
];

export default function ToneSelector({ selectedTone, onToneChange }: ToneSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-[14px] font-semibold" style={{ color: '#1A1F2E' }}>
        Select Tone
      </label>

      <div className="flex flex-wrap gap-2">
        {tones.map((tone) => (
          <button
            key={tone.id}
            type="button"
            onClick={() => onToneChange(tone.id)}
            className="flex-1 min-w-[140px] px-4 py-3 rounded-lg transition-all duration-300 border-2"
            style={{
              backgroundColor: selectedTone === tone.id ? '#D4A574' : '#F8FAFB',
              borderColor: selectedTone === tone.id ? '#D4A574' : '#E5E7EB',
              color: selectedTone === tone.id ? '#0F1419' : '#6B7280',
            }}
          >
            <div className="text-left">
              <div className="font-semibold text-[14px] mb-1">{tone.name}</div>
              <div className="text-[11px] opacity-80">{tone.description}</div>
            </div>
          </button>
        ))}
      </div>

      <p className="text-[12px]" style={{ color: '#6B7280' }}>
        Current Tone: <span className="font-semibold" style={{ color: '#D4A574' }}>
          {tones.find(t => t.id === selectedTone)?.name}
        </span>
      </p>
    </div>
  );
}
