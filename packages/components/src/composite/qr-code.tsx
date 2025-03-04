'use client';

import QRCodeStyling from 'qr-code-styling';
import { useEffect, useState } from 'react';
import { cn } from '../utilities';

type QRCodeProps = {
  url: string;
  className?: string;
}

export function QRCode({ url, className }: QRCodeProps) {
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);

  useEffect(() => {
    const qr = new QRCodeStyling({
      type: 'svg',
      data: url,
      width: 300,
      height: 300,
      dotsOptions: {
        type: 'dots',
        color: '#334155',
      },
      backgroundOptions: {
        color: "transparent",
      },
      cornersSquareOptions: {
        type: 'square',
      },
      cornersDotOptions: {
        type: 'square',
      }
    });
    setQrCode(qr);
  }, [url]);

  useEffect(() => {
    if (!qrCode) return;
    
    const container = document.getElementById('qr-code-container');
    if (container) {
      container.innerHTML = '';
      qrCode.append(container);
      
      // Get the SVG element that was just added
      const svg = container.querySelector('svg');
      if (svg) {
        // Make SVG responsive with viewBox
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      }
    }
  }, [qrCode]);

  return <div id="qr-code-container" className={cn("w-full h-full", className)} />
}
