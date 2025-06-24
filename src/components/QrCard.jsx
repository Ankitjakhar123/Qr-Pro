import React from 'react';

/**
 * QrCard component displays a QR code with a label (icon + text) below it, all inside a styled card.
 * Props:
 * - qrRef: ref for the QR code container (for rendering QR code)
 * - labelText: string, text to display below the QR code
 * - labelIcon: JSX (SVG) or image URL for the icon/logo
 * - borderStyle: 'rounded' | 'square', controls border radius
 * - borderSize: number (px)
 * - borderColor: string (CSS color)
 * - backgroundColor: background color for the QR code area
 * - labelBgColor: background color for the label area
 * - labelTextColor: color for the label text
 * - shadow: boolean, whether to show shadow
 * - cardRef: ref for the whole card (for export as image)
 */
const QrCard = ({
  qrRef,
  labelText,
  labelIcon,
  borderStyle = 'rounded',
  borderSize = 4,
  borderColor = '#000',
  backgroundColor = '#fff',
  labelBgColor = '#000',
  labelTextColor = '#fff',
  shadow = true,
  cardRef
}) => {
  const borderRadius = borderStyle === 'rounded' ? '1.5rem' : '0.5rem';
  const labelRadius = borderStyle === 'rounded' ? '9999px' : '0.5rem';
  return (
    <div
      ref={cardRef}
      className="flex flex-col items-center"
      style={{ userSelect: 'none' }}
    >
      <div
        className={shadow ? 'bg-white p-4 shadow-lg' : 'bg-white p-4'}
        style={{
          borderRadius,
          backgroundColor,
          border: `${borderSize}px solid ${borderColor}`
        }}
      >
        <div
          ref={qrRef}
          style={{ borderRadius, backgroundColor }}
        />
      </div>
      {/* Label Section Below QR */}
      <div
        className={shadow ? 'flex items-center mt-4 px-4 py-2 w-fit shadow-md' : 'flex items-center mt-4 px-4 py-2 w-fit'}
        style={{
          borderRadius: labelRadius,
          backgroundColor: labelBgColor
        }}
      >
        {labelIcon && (
          typeof labelIcon === 'string' ? (
            <img src={labelIcon} alt="icon" className="w-6 h-6 mr-2" />
          ) : (
            <span className="mr-2">{labelIcon}</span>
          )
        )}
        <span className="text-xl font-semibold" style={{ color: labelTextColor }}>{labelText}</span>
      </div>
    </div>
  );
};

export default QrCard; 