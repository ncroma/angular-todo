angular.module('app', [])
.controller('AppCtrl', [function(){
	var self = this;
	this.todos = [];
	this.filterState = {};
	this.checkTodos = false;


	this.submit = function(){
		if (self.todo){
			self.todo.completed = false;
			self.todos.push(self.todo);
			self.todo = null;
		}
		
	};

	this.changeTodos = function(){
		
		for (var i = self.todos.length - 1; i >= 0; i--) {
			self.todos[i].completed = !(self.checkTodos);
		};
	};

	this.todosChecked2 = function(){
		if (self.todos.length){
			for (var i = self.todos.length - 1; i >= 0; i--) {
				if (self.todos[i].completed === false){
					self.checkTodos = false;
					return false;
				}
			};
		}
		self.checkTodos = true;
		return true;
	};

	this.todosChecked = function(){
		return self.checkTodos = self.todos.every(function (todo) {
			return todo.completed;
		});
	};

	this.remove = function(todo){
		self.todos.splice(self.todos.indexOf(todo), 1);
	};

	this.howMany = function(comportamento){
		var howMany = 0;
		for (var i = self.todos.length - 1; i >= 0; i--) {
			if (comportamento(self.todos[i])){howMany ++}
		};
		return howMany;
	};


	this.howManyUnchecked = function(){
		return self.howMany(function teste(todo){
			return !todo.completed;
		});
	};

	this.howManyChecked = function(){
		return self.howMany(function teste(todo){
			return todo.completed;
		});
	};

	this.clearCompleted = function (argument) {
		for (var i = self.todos.length - 1; i >= 0; i--) {
			if (self.todos[i].completed === true){
				self.todos.splice(i,1);
			}
		};
	}


}])