import React from 'react';

/**
 * QrCard component displays a QR code with a label (icon + text) below it, all inside a styled card.
 * Props:
 * - qrRef: ref for the QR code container (for rendering QR code)
 * - labelText: string, text to display below the QR code
 * - labelIcon: JSX (SVG) or image URL for the icon/logo
 * - borderStyle: 'rounded' | 'square', controls border radius
 * - backgroundColor: background color for the QR code area
 * - cardRef: ref for the whole card (for export as image)
 */
const QrCard = ({ qrRef, labelText, labelIcon, borderStyle = 'rounded', backgroundColor = '#fff', cardRef }) => {
  const borderRadius = borderStyle === 'rounded' ? '1.5rem' : '0.5rem';
  const labelRadius = borderStyle === 'rounded' ? '9999px' : '0.5rem';

  return (
    <div
      ref={cardRef}
      className="flex flex-col items-center"
      style={{ userSelect: 'none' }}
    >
      <div
        className="bg-white p-4 border-4 border-black shadow-lg"
        style={{ borderRadius, backgroundColor }}
      >
        <div
          ref={qrRef}
          style={{ borderRadius, backgroundColor }}
        />
      </div>
      {/* Label Section Below QR */}
      <div
        className="flex items-center mt-4 bg-black px-4 py-2 w-fit shadow-md"
        style={{ borderRadius: labelRadius }}
      >
        {labelIcon && (
          typeof labelIcon === 'string' ? (
            <img src={labelIcon} alt="icon" className="w-6 h-6 mr-2" />
          ) : (
            <span className="mr-2">{labelIcon}</span>
          )
        )}
        <span className="text-white text-xl font-semibold">{labelText}</span>
      </div>
    </div>
  );
};

export default QrCard; 