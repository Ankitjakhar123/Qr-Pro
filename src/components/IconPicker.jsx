import React, { useRef } from 'react';

/**
 * IconPicker component lets the user pick from a set of icons or upload a custom image.
 * Props:
 * - icons: array of { key, icon } where icon is JSX (SVG) or image URL
 * - value: selected icon key or URL
 * - onChange: function(newValue)
 * - allowUpload: boolean, if true allows uploading a custom image
 */
const IconPicker = ({ icons = [], value, onChange, allowUpload = true }) => {
  const fileInputRef = useRef();

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {icons.map(({ key, icon }) => (
        <button
          key={key}
          type="button"
          className={`p-2 border-2 ${value === key ? 'border-amoled-accent' : 'border-transparent'} rounded-lg bg-white shadow`}
          onClick={() => onChange(key)}
        >
          {typeof icon === 'string' ? (
            <img src={icon} alt={key} className="w-8 h-8" />
          ) : (
            icon
          )}
        </button>
      ))}
      {allowUpload && (
        <>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleUpload}
          />
          <button
            type="button"
            className="p-2 border-2 border-dashed border-amoled-border rounded-lg bg-white shadow flex flex-col items-center justify-center"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            <span className="text-xs">Upload</span>
            <svg className="w-6 h-6 text-amoled-muted" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
              <polyline points="7 10 12 4 17 10" />
              <line x1="12" y1="4" x2="12" y2="16" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
};

export default IconPicker; 