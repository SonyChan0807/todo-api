var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-datavase.sqlite'
});

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,	
		validate: {
			len: [1,250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});


var User = sequelize.define('use', {
	email: Sequelize.STRING,
	defaultValue: false
});


Todo.belongsTo(User);
User.hasMany(Todo);

sequelize.sync().then(function () {
	console.log('Everthing is synced');

	
	User.findById(1).then(function (user) {
		user.getTodos({
			where: {
				completed: true // filter the condition
			}
		}).then(function (todos) {
			todos.forEach(function (todo) {
				console.log(todo.toJSON());
			});
		})
	});


	// User.create({
	// 	email: 'gerrychan@0807'
	// }).then(function (){
	// 	return Todo.create({
	// 		description: 'clean yard'
	// 	});
	// }).then(function (todo) {
	// 	User.findById(1).then(function (user) {
	// 		user.addTodo(todo);
	// 	});
	// });



	// Todo.create({
	// 	description: 'Take out trash',
	// 	//completed: false
	// }).then(function (todo) {
	// 	return Todo.create({
	// 		description: 'Hey how are you'
	// 	});
	// }).then(function () {
	// 	//return Todo.findById(1);
	// 	return Todo.findAll({
	// 		where: {
	// 			completed: false
	// 		}
	// 	});
	// }).then(function (todos) {
	// 	if (todos) {
	// 		todos.forEach(function(todo) {
	// 			console.log(todo.toJSON());
	// 		});
	// 	} else {
	// 		console.log('no todo found!');
	// 	}
	// }).catch(function (e) {
	// 	console.log(e);
	// });
});

