
export type Action = {
  label: string
  value: string
  platform: string
  icon: string
}

export const availableActions: Action[] = [{ 
    label: 'Follow us on Instagram', 
    value: 'instagram-follow', 
    platform: 'Instagram', 
    icon: 'instagram' 
  }, { 
    label: 'Tag us on Instagram', 
    value: 'instagram-review', 
    platform: 'Instagram', 
    icon: 'instagram',
  }, { 
    label: 'Leave a Google Review', 
    value: 'google-review', 
    platform: 'Google', 
    icon: 'google' 
  }, { 
    label: 'Leave a Facebook Review', 
    value: 'facebook-review', 
    platform: 'Facebook', 
    icon: 'facebook' 
  }, { 
    label: 'Follow us on Facebook', 
    value: 'facebook-follow', 
    platform: 'Facebook', 
    icon: 'facebook' 
  }, { 
    label: 'Follow us on TikTok', 
    value: 'tik-tok-follow', 
    platform: 'TikTok',
    icon: 'tiktok',
  }, { 
    label: 'Tag us on TikTok', 
    value: 'tik-tok-tag', 
    platform: 'TikTok',
    icon: 'tiktok',
  },
]
