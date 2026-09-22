const SIZE_CHART = [
  { size: 'XS', bust: '32', waist: '26', hip: '35' },
  { size: 'S', bust: '34', waist: '28', hip: '37' },
  { size: 'M', bust: '36', waist: '30', hip: '39' },
  { size: 'L', bust: '38', waist: '32', hip: '41' },
  { size: 'XL', bust: '40', waist: '34', hip: '43' },
  { size: 'XXL', bust: '42', waist: '36', hip: '45' },
  { size: '3XL', bust: '44', waist: '38', hip: '47' },
];

const SizeGuidePage = () => {
  return (
    <div className="pt-6 lg:pt-8 pb-16">
      <div className="section-container max-w-3xl mx-auto">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-dark mb-2">Size Guide</h1>
        <p className="text-text-secondary text-sm mb-8">
          All measurements are in inches. If you're between two sizes, we recommend choosing the larger size for a
          comfortable fit.
        </p>

        <div className="rounded-xl border border-border overflow-hidden bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-hover text-text-secondary">
                <th className="px-4 py-3 text-left font-semibold">Size</th>
                <th className="px-4 py-3 text-left font-semibold">Bust (in)</th>
                <th className="px-4 py-3 text-left font-semibold">Waist (in)</th>
                <th className="px-4 py-3 text-left font-semibold">Hip (in)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {SIZE_CHART.map((row) => (
                <tr key={row.size}>
                  <td className="px-4 py-3 font-medium text-dark">{row.size}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.bust}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.waist}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.hip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-5 rounded-xl border border-border bg-surface">
          <p className="text-sm font-semibold text-dark mb-2">How to measure</p>
          <ul className="text-sm text-text-secondary space-y-1.5 list-disc list-inside">
            <li><strong>Bust:</strong> Measure around the fullest part of your bust.</li>
            <li><strong>Waist:</strong> Measure around the narrowest part of your waistline.</li>
            <li><strong>Hip:</strong> Measure around the fullest part of your hips.</li>
          </ul>
          <p className="text-xs text-text-muted mt-3">
            Note: Individual product pages may include a specific size chart — always check the product's own chart when available.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SizeGuidePage;
