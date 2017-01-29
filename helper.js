var fs = require('fs'),
    request = require('request')
    http = require('http-https'),                                                
    Stream = require('stream').Transform;                                


function download(uri, filename, callback){
	//filename=escapeRegExp(filename);
  	request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream('img/'+filename)).on('close', callback);
  });
}

function escapeRegExp(str) {
  	return str.replace(/\//g, " "); // $& means the whole matched string
}


function downloadstream(url, filename){
	http.request(url, function(response) {                                        
  		var data = new Stream();                                                    
		response.on('data', function(chunk) {                                       
			data.push(chunk);                                                         
		});                                                                         

		response.on('end', function() {                                             
			fs.writeFileSync(__dirname+'/img/'+filename+'.png', data.read());                               
		});                                                                         
	}).end();
}



// download('https://cdn.shopify.com/s/files/1/1257/6393/products/Ahmad_Tea_of_London_Cardamon_Tea_Tin.jpg?v=1484870305', 
// 	'test.png', function(){
// 	console.log('done');
//  });
//downloadstream();
//exports.download = download
exports.downloadstream = downloadstream