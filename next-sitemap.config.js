// next-sitemap.config.js
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://rockstarhub.ru',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },

  additionalPaths: async (config) => {
    const endpoints = [
      'games',
      'achievements'
    ];

    const paths = [];

    for (const endpoint of endpoints) {
      try {

        const response = await fetch(
          `${process.env.STRAPI_API_URL}/${endpoint}?pagination[pageSize]=100`
        );
        const data = await response.json();
        

        data.data.forEach((item) => {
          let loc;
          
          if (endpoint === 'achievements') {

            loc = `/games/${item.game_name}/achievements/${item.page_url}`;
          } else {

            loc = `/${endpoint}/${item.slug}`;
          }
          
          paths.push({
            loc: loc,
            changefreq: 'daily',
            priority: 0.7,
            lastmod: new Date().toISOString(),
          });
        });
      } catch (error) {
        console.error(`Ошибка при получении данных из ${endpoint}:`, error);
      }
    }

    return paths;
  },
};