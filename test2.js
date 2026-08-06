const cheerio = require('cheerio');
fetch('https://github.com/users/amit7451/contributions').then(res=>res.text()).then(t=>{
  const $ = cheerio.load(t);
  let d = 0;
  $('table.ContributionCalendar-grid tbody tr td.ContributionCalendar-day').each((i, el) => {
    if ($(el).attr('data-date')) d++;
  });
  console.log('days found:', d);
});
