
export type Action = {
  label: string
  value: string
  platform: string
  icon: string
  instruction: string
}

export const availableActions: Action[] = [{ 
    label: 'Follow us on Instagram', 
    value: 'instagram-follow', 
    platform: 'Instagram', 
    icon: 'instagram',

    instruction: 'Scan the code below to leave a review'
  }, { 
    label: 'Tag us on Instagram', 
    value: 'instagram-review', 
    platform: 'Instagram', 
    icon: 'instagram',

    instruction: 'Make a new post and include the following Instagram handle',
  }, { 
    label: 'Leave a Google Review', 
    value: 'google-review', 
    platform: 'Google', 
    icon: 'google',

    instruction: 'Scan the code below to leave a review'
  }, { 
    label: 'Leave a Facebook Review', 
    value: 'facebook-review', 
    platform: 'Facebook', 
    icon: 'facebook',

    instruction: 'Scan the code below to leave a review',
  }, { 
    label: 'Follow us on Facebook', 
    value: 'facebook-follow', 
    platform: 'Facebook', 
    icon: 'facebook',

    instruction: 'Scan the code below and follow us',
  }, { 
    label: 'Follow us on TikTok', 
    value: 'tik-tok-follow', 
    platform: 'TikTok',
    icon: 'tiktok',
    instruction: 'Scan the code below and follow us',
  }, { 
    label: 'Tag us on TikTok', 
    value: 'tik-tok-tag', 
    platform: 'TikTok',
    icon: 'tiktok',
    instruction: 'Make a new post and include the following TikTok handle',
  },
]
