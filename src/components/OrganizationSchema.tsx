const OrganizationSchema = () => {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'RockstarHub',
    'url': 'https://rockstarhub.ru',
    'logo': 'https://rockstarhub.ru/hub_512.png',
    'description': 'Всё о твоих любимых играх от компании Rockstar Games',
    'sameAs': [
      'https://twitter.com/rockstarhub',
      'https://facebook.com/rockstarhub',
      'https://youtube.com/rockstarhub'
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  );
};

export default OrganizationSchema;