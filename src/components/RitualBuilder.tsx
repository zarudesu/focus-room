import { useState } from 'react';
import { strings } from '../strings';
import { RITUAL_PRESETS } from '../data/ritualPresets';

interface RitualBuilderProps {
  onSave: (trigger: string) => void;
}

export function RitualBuilder({ onSave }: RitualBuilderProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(RITUAL_PRESETS[0]);
  const [customText, setCustomText] = useState('');

  const trigger = customText.trim() || selectedPreset || '';

  function handlePresetClick(preset: string) {
    setSelectedPreset(preset);
    setCustomText('');
  }

  function handleSave() {
    if (!trigger) return;
    onSave(trigger);
  }

  return (
    <div className="screen screen-ritual">
      <h1>{strings.ritual.heading}</h1>
      <p className="ritual-body">{strings.ritual.body}</p>

      <p className="ritual-preview">
        {strings.ritual.templatePrefix} <span className="ritual-preview-trigger">{trigger || '…'}</span>{' '}
        {strings.ritual.templateJoin}
      </p>

      <div className="ritual-presets">
        {RITUAL_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            className={`chip${!customText && selectedPreset === preset ? ' chip-active' : ''}`}
            onClick={() => handlePresetClick(preset)}
          >
            {preset}
          </button>
        ))}
      </div>

      <input
        className="ritual-custom-input"
        type="text"
        value={customText}
        placeholder={strings.ritual.customPlaceholder}
        onChange={(event) => setCustomText(event.target.value)}
      />

      <button className="button-primary button-large" disabled={!trigger} onClick={handleSave}>
        {strings.ritual.saveButton}
      </button>
    </div>
  );
}
