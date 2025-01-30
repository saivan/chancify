'use client';

import QRCodeStyling from 'qr-code-styling';
import { useEffect, useState } from 'react';

type QRCodeProps = {
  url: string;
}

export function QRCode({ url }: QRCodeProps) {
  const [qrCode] = useState(
    new QRCodeStyling({
      type: 'svg',
      data: url,
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
    })
  );

  useEffect(() => {
    const container = document.getElementById('qr-code-container');
    if (container) {
      container.innerHTML = '';
      qrCode.append(container);
    }
  }, [qrCode]);

  return <div id="qr-code-container" className="w-full h-full" />
}
