import { useState } from 'react';
import { cn } from '@utils/cn';

/**
 * DynamicAttributeRenderer
 * Renders form inputs automatically from a config array.
 *
 * config: [{ name, label, type, options?, allowCustom? }]
 * Supported types: dropdown | multi-select | chips | text | number | boolean | date
 *
 * allowCustom (dropdown | multi-select | chips):
 *   Lets the admin enter a custom value not in the predefined options.
 *   - dropdown: adds an "Other…" option that reveals a text input; the typed
 *     value is stored directly.
 *   - multi-select / chips: adds a small "+ Add custom" input that appends the
 *     typed value as a selectable/removable chip.
 *
 * values: object keyed by attribute `name`
 * onChange(name, value)
 */

const OTHER = '__other__';

const DynamicAttributeRenderer = ({ config, values, onChange, darkMode }) => {
  const labelClass = cn('text-sm font-medium mb-1.5 block', darkMode ? 'text-gray-300' : 'text-gray-700');
  const inputClass = cn(
    'w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:ring-2 focus:ring-primary/30',
    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
  );

  const chipBtn = (selected) => cn(
    'px-3.5 py-1.5 rounded-full border text-sm font-medium transition-colors',
    selected
      ? 'bg-primary text-white border-primary'
      : darkMode ? 'border-gray-600 text-gray-300 hover:border-gray-500' : 'border-gray-300 text-gray-600 hover:border-gray-400'
  );

  return (
    <div className="space-y-5">
      {config.map((attr) => (
        <div key={attr.name}>
          <label className={labelClass}>
            {attr.label}
            {attr.required && ' *'}
          </label>
          <Field
            attr={attr}
            value={values[attr.name]}
            onChange={onChange}
            inputClass={inputClass}
            chipBtn={chipBtn}
            darkMode={darkMode}
          />
        </div>
      ))}
    </div>
  );
};

// Individual field — kept as its own component so each can hold local UI state
// (e.g. the "Other" text box, or the custom-chip input) without leaking across fields.
const Field = ({ attr, value, onChange, inputClass, chipBtn, darkMode }) => {
  switch (attr.type) {
    case 'dropdown':
      return <DropdownField attr={attr} value={value} onChange={onChange} inputClass={inputClass} />;
    case 'multi-select':
    case 'chips':
      return <MultiField attr={attr} value={value} onChange={onChange} inputClass={inputClass} chipBtn={chipBtn} darkMode={darkMode} />;
    case 'text':
      return (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(attr.name, e.target.value)}
          placeholder={attr.placeholder || `Enter ${attr.label}`}
          className={inputClass}
        />
      );
    case 'number':
      return (
        <input
          type="number"
          value={value ?? ''}
          onChange={(e) => onChange(attr.name, e.target.value)}
          placeholder={attr.placeholder || `Enter ${attr.label}`}
          className={inputClass}
        />
      );
    case 'boolean':
      return (
        <button
          type="button"
          onClick={() => onChange(attr.name, !value)}
          className={cn('w-11 h-6 rounded-full relative transition-colors', value ? 'bg-primary' : darkMode ? 'bg-gray-600' : 'bg-gray-300')}
        >
          <span className={cn('absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform', value ? 'translate-x-[22px]' : 'translate-x-0.5')} />
        </button>
      );
    case 'date':
      return (
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(attr.name, e.target.value)}
          className={inputClass}
        />
      );
    default:
      return null;
  }
};

const DropdownField = ({ attr, value, onChange, inputClass }) => {
  // A value that's set but not in the options list means it's a custom entry.
  const isCustom = !!value && !attr.options.includes(value);
  const [showOther, setShowOther] = useState(isCustom);

  const handleSelect = (e) => {
    const v = e.target.value;
    if (v === OTHER) {
      setShowOther(true);
      onChange(attr.name, ''); // clear until they type
    } else {
      setShowOther(false);
      onChange(attr.name, v);
    }
  };

  return (
    <div className="space-y-2">
      <select
        value={showOther || isCustom ? OTHER : (value || '')}
        onChange={handleSelect}
        className={inputClass}
      >
        <option value="">Select {attr.label}</option>
        {attr.options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
        {attr.allowCustom && <option value={OTHER}>Other (type your own)</option>}
      </select>

      {attr.allowCustom && (showOther || isCustom) && (
        <input
          type="text"
          autoFocus
          value={value || ''}
          onChange={(e) => onChange(attr.name, e.target.value)}
          placeholder={`Enter custom ${attr.label.toLowerCase()}`}
          className={inputClass}
        />
      )}
    </div>
  );
};

const MultiField = ({ attr, value, onChange, chipBtn }) => {
  const selectedList = value || [];
  const [customText, setCustomText] = useState('');

  const toggle = (opt) => {
    const next = selectedList.includes(opt) ? selectedList.filter((v) => v !== opt) : [...selectedList, opt];
    onChange(attr.name, next);
  };

  const addCustom = () => {
    const v = customText.trim();
    if (!v) return;
    if (!selectedList.includes(v)) onChange(attr.name, [...selectedList, v]);
    setCustomText('');
  };

  // Custom (selected) values that aren't part of the predefined options.
  const customSelected = selectedList.filter((v) => !attr.options.includes(v));

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap gap-2">
        {attr.options.map((opt) => (
          <button key={opt} type="button" onClick={() => toggle(opt)} className={chipBtn(selectedList.includes(opt))}>
            {opt}
          </button>
        ))}
        {/* Render custom chips (already selected) so admins can toggle them off */}
        {customSelected.map((opt) => (
          <button key={opt} type="button" onClick={() => toggle(opt)} className={chipBtn(true)}>
            {opt} ✕
          </button>
        ))}
      </div>

      {attr.allowCustom && (
        <div className="flex gap-2">
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustom(); } }}
            placeholder={`Add custom ${attr.label.toLowerCase()}`}
            className={cn(
              'flex-1 px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-primary/30',
              'border-gray-300 dark:border-gray-600'
            )}
          />
          <button
            type="button"
            onClick={addCustom}
            className="px-3 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-colors"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
};

export default DynamicAttributeRenderer;
