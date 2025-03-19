
export const availableActions = [{ 
    id: 'instagram-follow',
    name: 'Follow us on Instagram',
    platform: 'instagram', 
  }, { 
    id: 'instagram-tag',
    name: 'Tag us on Instagram',
    platform: 'instagram', 
  }, { 
    id: 'google-review',
    name: 'Leave us a Google review',
    platform: 'google', 
  }, { 
    id: 'facebook-review',
    name: 'Leave us a Facebook review',
    platform: 'facebook', 
  }, { 
    id: 'facebook-follow',
    name: 'Follow us on Facebook',
    platform: 'facebook', 
  }, { 
    id: 'tiktok-follow',
    name: 'Follow us on TikTok',
    platform: 'tiktok',
  }, { 
    id: 'tiktok-tag',
    name: 'Tag us on TikTok',
    platform: 'tiktok',
  },
]

export const availableActionInstructions: Record<string, {qr: string, button: string}> = {
  'instagram-follow': {
    qr: 'Scan the QR code to follow us on Instagram',
    button: 'Click the button and follow us on Instagram',
  },
  'instagram-tag': {
    qr: 'Tag the following account on a new Instagram post',
    button: 'Tag the following account on a new Instagram post',
  },
  'google-review': {
    qr: 'Scan the QR code to leave us a Google review',
    button: 'Click the button and leave us a Google review',
  },
  'facebook-review': {
    qr: 'Scan the QR code to leave us a Facebook review',
    button: 'Click the button and leave us a Facebook review',
  },
  'facebook-follow': {
    qr: 'Scan the QR code to follow us on Facebook',
    button: 'Click the button and follow us on Facebook',
  },
  'tiktok-follow': {
    qr: 'Scan the QR code to follow us on TikTok',
    button: 'Click the button and follow us on TikTok',
  },
  'tiktok-tag': {
    qr: 'Tag the following account on a new TikTok post',
    button: 'Tag the following account on a new TikTok post',
  },
}
