const got = require('@/utils/got');
const cheerio = require('cheerio');
const { parseDate } = require('@/utils/parse-date');

module.exports = async (ctx) => {
    const baseUrl = 'https://rumble.com';
    const { channel, routeParams = '' } = ctx.params;
    const { data: response } = await got(`${baseUrl}/c/${channel}/${routeParams}`);
    const $ = cheerio.load(response);
    const items = $('article.video-item')
        .toArray()
        .map((item) => {
            item = $(item);
            return {
                title: item.find('h3.video-item--title').first().text(),
                link: item.find('a').first().attr('href'),
                pubDate: parseDate(item.find('time.video-item--time').attr('datetime')),
                author: item.find('div.ellipsis-1').text(),
                itunes_item_image: item.find('img.video-item--img').attr('src'),
                description: item.html(),
            };
        });
    ctx.state.data = {
        title: channel,
        link: `${baseUrl}/c/${channel}`,
        image: $('img.channel-header--thumb').attr('src'),
        item: items,
    };
};
