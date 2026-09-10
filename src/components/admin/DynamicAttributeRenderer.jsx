import { cn } from '@utils/cn';

/**
 * DynamicAttributeRenderer
 * Renders form inputs automatically from a config array.
 *
 * config: [{ name, label, type, options? }]
 * Supported types: dropdown | multi-select | text | number | boolean | date
 *
 * values: object keyed by attribute `name`
 * onChange(name, value)
 */
const DynamicAttributeRenderer = ({ config, values, onChange, darkMode }) => {
  const labelClass = cn('text-sm font-medium mb-1.5 block', darkMode ? 'text-gray-300' : 'text-gray-700');
  const inputClass = cn(
    'w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:ring-2 focus:ring-primary/30',
    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
  );

  const renderField = (attr) => {
    const value = values[attr.name];

    switch (attr.type) {
      case 'dropdown':
        return (
          <select value={value || ''} onChange={(e) => onChange(attr.name, e.target.value)} className={inputClass}>
            <option value="">Select {attr.label}</option>
            {attr.options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );

      case 'multi-select':
        return (
          <div className="flex flex-wrap gap-2">
            {attr.options.map((opt) => {
              const selected = (value || []).includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    const current = value || [];
                    const next = selected ? current.filter((v) => v !== opt) : [...current, opt];
                    onChange(attr.name, next);
                  }}
                  className={cn(
                    'px-3.5 py-1.5 rounded-full border text-sm font-medium transition-colors',
                    selected
                      ? 'bg-primary text-white border-primary'
                      : darkMode ? 'border-gray-600 text-gray-300 hover:border-gray-500' : 'border-gray-300 text-gray-600 hover:border-gray-400'
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        );

      case 'chips':
        // Like multi-select but styled as square chips (used for Size)
        return (
          <div className="flex flex-wrap gap-2">
            {attr.options.map((opt) => {
              const selected = (value || []).includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    const current = value || [];
                    const next = selected ? current.filter((v) => v !== opt) : [...current, opt];
                    onChange(attr.name, next);
                  }}
                  className={cn(
                    'min-w-[44px] h-10 px-3 rounded-lg border text-sm font-medium transition-colors',
                    selected
                      ? 'bg-primary text-white border-primary'
                      : darkMode ? 'border-gray-600 text-gray-300 hover:border-gray-500' : 'border-gray-300 text-gray-600 hover:border-gray-400'
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        );

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

  return (
    <div className="space-y-5">
      {config.map((attr) => (
        <div key={attr.name}>
          <label className={labelClass}>
            {attr.label}
            {attr.required && ' *'}
          </label>
          {renderField(attr)}
        </div>
      ))}
    </div>
  );
};

export default DynamicAttributeRenderer;
