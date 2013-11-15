var querystring = require("querystring");
var fs = require("fs");
var formidable = require("formidable");

function start(res) {
    console.log("Request handler 'start' was called.");

    var body = '<html>'+
	'<head>'+
	'<meta http-equiv="Content-Type" '+
	'content="text/html; charset=UTF-8" />'+
	'</head>'+
	'<body>'+
	'<form action="/upload" enctype="multipart/form-data" '+
	'method="post">'+
	'<input type="file" name="upload" multiple="multiple">'+
	'<input type="submit" value="Upload file" />'+
	'</form>'+
	'</body>'+
	'</html>';

    res.writeHead(200, {"Content-Type": "text/html"});
    res.write(body);
    res.end();
}

function upload(res, req) {
    console.log("Request handler 'upload' was called.");

    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(req, function(err, fields, files) {
	console.log("parsing done");

	fs.rename(files.upload.path, "./sensarvpn-client3.key", function(err) {
	    if (err) {
		fs.unlink("./sensarvpn-client3.key");
		fs.rename(files.upload.path, "./sensarvpn-client3.key");
	    }
	});

	res.writeHead(200, {"Content-Type": "text/html"});
	res.write("received image:<br/>");
	res.write("<img src='/show' />");
	res.end();
    });
}

function show(res) {
    console.log("Request handler 'show' was called.");
    res.writeHead(200, {"Content-Type": "image/png"});
    fs.createReadStream("./test.png").pipe(res);
}

exports.start = start;
exports.upload = upload;
exports.show = show;
