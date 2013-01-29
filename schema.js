var mongoose = require('mongoose');

var db = mongoose.createConnection(app.mongoDB);

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var User = new Schema({
	firstName		: String,
	lastName		: String,
	photo			: String,
	foursquareId	: { type: String, required: true },
	accessToken		: String,
	dishes			: [{ type: Schema.Types.ObjectId, ref: 'dish' }]
});
User.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName;
});

var Post = new Schema({
	title		: String,
	id			: String,
	description : String,
	created     : { type: Date, default: Date.now }
});
Post.virtual('createdAt').get(function () {
  return this.created.getTime();
});

app.objects = {

	Post	: db.model('Post',Post),
	user	: db.model('user',usersch)

};
