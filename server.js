var connect = require('connect'),
		meryl = require('meryl'),
		mongous = require('mongous');
		
meryl
	.h('GET /') // virtual server handler
	.h('GET /{client}/public') // client files