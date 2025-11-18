export const distributionChannels = [
  {
    name: 'Zepto',
    logo: 'https://cdn.worldvectorlogo.com/logos/zepto.svg',
    fallbackIcon: '🛒',
    type: 'E-commerce',
    adTypes: [
      { id: 'sponsored_products', name: 'Sponsored Products', description: 'Promote products in search' },
      { id: 'banner_ads', name: 'Banner Ads', description: 'Homepage & category banners' },
      { id: 'featured_store', name: 'Featured Brand Store', description: 'Custom storefront' },
      { id: 'flash_sale', name: 'Flash Sale Placement', description: 'Flash sale sections' },
    ]
  },
  {
    name: 'Facebook',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png',
    fallbackIcon: '📘',
    type: 'Social Media',
    adTypes: [
      { id: 'feed_ads', name: 'Feed Ads', description: 'News feed ads' },
      { id: 'story_ads', name: 'Stories Ads', description: 'Full-screen stories' },
      { id: 'reels_ads', name: 'Reels Ads', description: 'Video in Reels' },
      { id: 'messenger_ads', name: 'Messenger Ads', description: 'Messenger placement' },
    ]
  },
  {
    name: 'Instagram',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png',
    fallbackIcon: '📸',
    type: 'Social Media',
    adTypes: [
      { id: 'feed_ads', name: 'Feed Ads', description: 'Photo/video in feed' },
      { id: 'story_ads', name: 'Stories Ads', description: 'Between stories' },
      { id: 'reels_ads', name: 'Reels Ads', description: 'Instagram Reels' },
      { id: 'shopping_ads', name: 'Shopping Ads', description: 'Product tags' },
    ]
  },
  {
    name: 'YouTube',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg',
    fallbackIcon: '▶️',
    type: 'Video',
    adTypes: [
      { id: 'skippable', name: 'Skippable In-Stream', description: 'Skip after 5 sec' },
      { id: 'non_skippable', name: 'Non-Skippable', description: '15-20 second ads' },
      { id: 'bumper', name: 'Bumper Ads', description: '6-second ads' },
      { id: 'discovery', name: 'Video Discovery', description: 'Search results' },
    ]
  },
  {
    name: 'Google Display',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Google_Ads_logo.svg',
    fallbackIcon: '🔍',
    type: 'Display',
    adTypes: [
      { id: 'responsive', name: 'Responsive Display', description: 'Auto-optimized' },
      { id: 'image', name: 'Image Ads', description: 'Banner ads' },
      { id: 'native', name: 'Native Ads', description: 'Match site content' },
      { id: 'gmail', name: 'Gmail Ads', description: 'Gmail inbox' },
    ]
  },
  {
    name: 'Email',
    fallbackIcon: '📧',
    type: 'Direct',
    adTypes: [
      { id: 'promotional', name: 'Promotional', description: 'Offers & deals' },
      { id: 'newsletter', name: 'Newsletter', description: 'Content updates' },
    ]
  },
  {
    name: 'SMS',
    fallbackIcon: '💬',
    type: 'Direct',
    adTypes: [
      { id: 'promotional', name: 'Promotional SMS', description: 'Offers via SMS' },
    ]
  },
  {
    name: 'WhatsApp',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
    fallbackIcon: '💚',
    type: 'Messaging',
    adTypes: [
      { id: 'business', name: 'Business Messages', description: 'Direct messaging' },
      { id: 'catalog', name: 'Catalog Messages', description: 'Product catalogs' },
    ]
  }
];
