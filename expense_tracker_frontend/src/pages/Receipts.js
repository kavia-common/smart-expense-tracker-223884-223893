import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Default Receipts page.
 * Currently a minimal placeholder to break circular import issues caused by index re-exports.
 * Extend this component with actual receipt listing/upload functionality as needed.
 */
export default function ReceiptsPage() {
  return (
    <div>
      <h2>Receipts</h2>
      <div className="card" style={{ padding: 16 }}>
        <p style={{ margin: 0, color: 'var(--muted)' }}>
          Receipt management coming soon. You can upload and view receipts from the Expenses page.
        </p>
      </div>
    </div>
  );
}
