export const createSEOMeta = (data) => [
    { hid: 'og:title', property: 'og:title', content: data.title },
    { hid: 'description', name: 'description', content: data.description },
    { hid: 'og:description', property: 'og:description', content: data.description },
    { hid: 'og:type', property: 'og:type', content: data.type },
    { hid: 'og:image', property: 'og:image', content: data.image },
    { hid: 'og:image:type', property: 'og:image:type', content: data.image_type },
    { hid: 'og:image:width', property: 'og:image:width', content: data.image_width },
    { hid: 'og:image:height', property: 'og:image:height', content: data.image_height },
    {
      hid: 'og:url',
      property: 'og:url',
      content: data.url,
    },
    {
      hid: 'twitter:card',
      name: 'twitter:card',
      content: data.cardType || 'summary_large_image',
    },
]