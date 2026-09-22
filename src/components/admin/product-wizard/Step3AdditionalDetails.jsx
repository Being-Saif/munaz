import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@utils/cn';
import { useProductForm } from '@hooks/useProductForm';

const PATTERN_OPTIONS = ['Printed', 'Solid', 'Embroidered', 'Striped', 'Checked', 'Floral', 'Woven Design'];
const ORNAMENTATION_OPTIONS = ['Embroidery', 'Sequins', 'Mirror Work', 'Zari Work', 'Lace', 'None'];
const UNIT_OPTIONS = ['Piece', 'Pair', 'Set', 'Kg', 'Gram', 'Meter'];

const AccordionSection = ({ title, children, defaultOpen = true, darkMode }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={cn('rounded-lg border overflow-hidden', darkMode ? 'border-gray-700' : 'border-gray-200')}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-colors',
          darkMode ? 'bg-gray-800 text-white hover:bg-gray-750' : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
        )}
      >
        {title}
        <ChevronDown size={16} className={cn('transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className={cn('p-4 space-y-4', darkMode ? 'bg-gray-800/50' : 'bg-white')}>
          {children}
        </div>
      )}
    </div>
  );
};

/**
 * Step 3 — Additional Details
 * Brand, pattern, ornamentation, style code, care instructions, manufacturer info.
 * Grouped in accordion sections to keep the long form readable.
 */
const Step3AdditionalDetails = ({ darkMode }) => {
  const { draft, setSection } = useProductForm();
  const details = draft.additionalDetails;

  const update = (field, value) => setSection('additionalDetails', { ...details, [field]: value });

  const labelClass = cn('text-sm font-medium mb-1.5 block', darkMode ? 'text-gray-300' : 'text-gray-700');
  const inputClass = cn(
    'w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:ring-2 focus:ring-primary/30',
    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
  );

  return (
    <div className="max-w-2xl space-y-4">
      <AccordionSection title="Product Information" darkMode={darkMode}>
        <div>
          <label className={labelClass}>Brand</label>
          <input value={details.brand} onChange={(e) => update('brand', e.target.value)} placeholder="e.g. Munaz Originals" className={inputClass} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Pattern</label>
            <select value={details.pattern} onChange={(e) => update('pattern', e.target.value)} className={inputClass}>
              <option value="">Select Pattern</option>
              {PATTERN_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Ornamentation</label>
            <select value={details.ornamentation} onChange={(e) => update('ornamentation', e.target.value)} className={inputClass}>
              <option value="">Select Ornamentation</option>
              {ORNAMENTATION_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Style Code / Product ID</label>
          <input value={details.styleCode} onChange={(e) => update('styleCode', e.target.value)} placeholder="Leave blank to auto-generate (e.g. MNZ-KUR-0007)" className={inputClass} />
          <p className={cn('text-xs mt-1', darkMode ? 'text-gray-400' : 'text-gray-500')}>
            Leave empty and a unique code will be created automatically when you publish.
          </p>
        </div>

        <div>
          <label className={labelClass}>Care Instructions</label>
          <textarea value={details.careInstructions} onChange={(e) => update('careInstructions', e.target.value)} rows={3} placeholder="e.g. Dry clean only, do not bleach" className={inputClass} />
        </div>
      </AccordionSection>

      <AccordionSection title="Packaging" defaultOpen={false} darkMode={darkMode}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Net Quantity</label>
            <input
              type="number"
              min="1"
              value={details.netQuantity ?? 1}
              onChange={(e) => update('netQuantity', Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Unit</label>
            <select value={details.unit || 'Piece'} onChange={(e) => update('unit', e.target.value)} className={inputClass}>
              {UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
        <p className={cn('text-xs', darkMode ? 'text-gray-500' : 'text-gray-400')}>
          e.g. &quot;1 Piece&quot;, &quot;2 Pieces&quot;, &quot;1 Pair&quot;, &quot;1 Set&quot;
        </p>
      </AccordionSection>

      <AccordionSection title="Manufacturer Details" defaultOpen={false} darkMode={darkMode}>
        <div>
          <label className={labelClass}>Country of Origin</label>
          <input value={details.countryOfOrigin} onChange={(e) => update('countryOfOrigin', e.target.value)} placeholder="India" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Manufacturer</label>
          <input value={details.manufacturer} onChange={(e) => update('manufacturer', e.target.value)} placeholder="Manufacturer name & address" className={inputClass} />
        </div>
      </AccordionSection>
    </div>
  );
};

// Step 3 has no strictly required fields per spec — all optional
export const validateStep3 = () => ({});

export default Step3AdditionalDetails;
