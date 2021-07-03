const Koa = require('koa');

const fs = require('fs');
const path = require('path')
const cheerio = require('cheerio');
const app = new Koa()

app.use(ctx => {
  const {
    url,
    query
  } = ctx.request;

  // console.log(url, query)
  if (url === '/') {
    ctx.type = 'text/html';
    const content = fs.readFileSync('./index.html', 'utf-8');
    const $ = cheerio.load(content);
    $('head').prepend(
      `
      <script>
      window.process = {
        env: {
          NODE_ENV: 'dev'
        }
      }
      </script>
      `
    )
    ctx.body = $.html();
  } else if (url.endsWith('.js')) {
    const p = path.resolve(__dirname, url.slice(1))
    ctx.type = "application/javascript"
    const content = fs.readFileSync(p, 'utf-8');
    ctx.body = rewriteImport(content);
  } else if (url.startsWith('/@modules/')) {
    const prefix = path.resolve(__dirname, 'node_modules', url.replace('/@modules/', ''))
    const module = require(prefix + '/package.json').module
    const p = path.resolve(__dirname, 'node_modules', url.replace('/@modules/', ''), module)
    const content = fs.readFileSync(p, 'utf-8')
    ctx.type = 'application/javascript';
    ctx.body = rewriteImport(content);
  }
})

app.listen(3000, () => {
  console.log('here is vite')
})

function rewriteImport(content) {
  // import xx from 'xxx'
  // 使用正则 或者ast解析
  return content.replace(/ from ['|"]([^'"]+)['|"]/g, function (s0, s1) {
    console.log('s', s0, s1);
    // ./ ../ / 
    if (s1[0] !== '.' && s1[1] !== '/') {
      return `from '/@modules/${s1}'`
    }
    return s0;
  })
}