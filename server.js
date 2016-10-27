var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;
var _ = require('underscore');
// var todos = [{
// 	id: 1,
// 	description: 'Take out the trash',
// 	completed: false
// }, {
// 	id: 2,
// 	description: 'Go to the market',
// 	completed: false
// }, {
// 	id: 3,
// 	description: 'Call Dad tonight',
// 	completed: true
// }];

var todos = [];
var todoNextId = 1;


app.use(bodyParser.json());

app.get('', function (req, res) {
	res.send('Todo API Root');
});

// GET /todos
app.get('/todos', function (req, res) {
	res.json(todos);
});

//GET /todos/:id
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId}); // replace forEach
	
	// todos.forEach(function (todo) {
	// 	if (todo.id === todoId) {
	// 		matchedTodo = todo;
	// 	}
	// });
	
	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}	
});

//POST /todos/:id
app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	console.log('test_1')
	console.log(body);
	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
	}
	body.description = body.description.trim();
	body.id = todoNextId++;  // equal to todoNextId++
	todos.push(body);
	res.json(body);
});

// DELETE /todos/:id

app.delete('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (!matchedTodo) {
		res.status(404).json({"error": "no todo found whit that id"});
	} else {
		todos = _.whitout(todos, matchedTodo);
		res.json(todos);
	}
});




app.listen(PORT, function () {
	console.log('Express listening on port' + PORT + '!');
});