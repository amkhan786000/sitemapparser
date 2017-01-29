var saxStream = require('sax').createStream(true, {trim: true}),
    hh = require('http-https'),
    streamify = require('streamify'),
    stream = streamify(),
    helper = require('./helper');
var url = 'http://www.qualitygrocers.com/sitemap_products_1.xml'

var list = []

function escapeRegExp(str) {
    return str.replace(/\//g, " "); // $& means the whole matched string
}

function objectFromArray (arr) {
  var obj = {}
  while (arr.length > 0) {
    obj[arr.shift()] = arr.shift()
  }
  return obj
}

saxStream.on("opentag", function (node) {
  if (node.name !== 'urlset' && node.name !== 'sitemapindex') {
    if (node.name === 'url' && list.length > 0 || node.name === 'sitemap' && list.length > 0) {
      var obj=objectFromArray(list);
      console.log(obj['image:loc']);
      helper.downloadstream(obj['image:loc'], escapeRegExp(obj['image:title']), function(){
        console.log('done');
      });
      list = []
    } else {
      if (node.name !== 'url' 
        && node.name !== 'sitemap'
        && node.name !== 'loc'
        && node.name !== 'lastmod'
        && node.name !== 'changefreq'
        && node.name !== 'image:image'
        && node.name !== 'image:image'
        ) {
          list.push(node.name)
      }
    }
  }
})

saxStream.on("text", function (text) {
  if (list.length > 0) {
      list.push(text)
  }
})

saxStream.on("end", function (node) {
  //console.log(objectFromArray(list))
})

hh.get(url, function (response) {
  stream.resolve(response)
})

stream
.pipe(saxStream)