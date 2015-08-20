function StorageService(){

	this.setStorage = function SetStorage(key, content){

		/*            content.forEach(function(obj){delete obj.$$hashKey});
			-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	
		angular.toJson retira a informação desnecessária que o angular usa para obter JSON limpo*/

		window.localStorage.setItem(key, angular.toJson(content));
	};

	this.getStorage = function GetStorage(key){
		if (!window.localStorage.getItem(key)){
			return [];
		}
		return JSON.parse(window.localStorage.getItem(key));		
	};
}

angular.module('app', [])
	.factory('fabrica', function Fabrica(){
		return {prop1:"fabrica",prop2:20};
	})
	.service('storageService', [StorageService])
    .controller('AppCtrl', ['$scope','fabrica','storageService',

        function($scope, fabrica, storageService) {

            var self = this;

            this.todos = storageService.getStorage('todos');
            this.filterState = {};
            this.checkTodos = false;

            this.persist = function(key, content){
            	storageService.setStorage(key, content);
            };

            this.submit = function() {
                if (self.todo) {
                    self.todo.completed = false;
                    self.todos.push(self.todo);
                    self.todo = null;
           
                    self.persist('todos', self.todos);
                }

            };

            this.changeTodos = function() {

                for (var i = self.todos.length - 1; i >= 0; i--) {
                    self.todos[i].completed = !(self.checkTodos);
                };
                self.persist('todos', self.todos);
            };

            /*
			this.todosChecked = function() {
				if (self.todos.length) {
					for (var i = self.todos.length - 1; i >= 0; i--) {
						if (!self.todos[i].completed) {
							self.checkTodos = false;
							return false;
						}
					};
				}
				self.checkTodos = true;
				return true;
			};
			*/

            this.todosChecked = function() {
                return self.checkTodos = self.todos.every(function(todo) {
                    return todo.completed;
                });
            };

            this.remove = function(todo) {
                self.todos.splice(self.todos.indexOf(todo), 1);
                self.persist('todos', self.todos);
            };


            /*this.howManyChecked = function() {

				return self.todos.map(function(todo) {
					return todo.completed ? 1 : 0;
				}).reduce(function(a, b) {
					return a + b;
				}, 0);
			}*/

            this.howManyChecked = function() {

                return self.todos.reduce(function(a, b) {
                    return a + (b.completed ? 1 : 0);
                }, 0);
            }

            this.howManyUnchecked = function() {

                return self.todos.reduce(function(a, b) {
                    b = !b.completed ? 1 : 0;
                    return a + b;
                }, 0);
            }

            this.clearCompleted = function() {
                for (var i = self.todos.length - 1; i >= 0; i--) {
                    if (self.todos[i].completed) {
                        self.todos.splice(i, 1);
                    }
                };
               self.persist('todos', self.todos);
            }


            /*
			this.howMany = function(comportamento, todos) {
				var howMany = 0;
				for (var i = todos.length - 1; i >= 0; i--) {
					if (comportamento(todos[i])) {
						howMany++
					}
				};
				return howMany;
			};

			this.howManyUnchecked = function() {
				return self.howMany(function teste(todo) {
					return !todo.completed;
				}, self.todos);
			};

			this.howManyChecked = function() {
				return self.howMany(function teste(todo) {
					return todo.completed;
				}, self.todos);
			};


			this.howManyUnchecked2 = function() {
				return self.todos.filter(function teste(todo) {
					return !todo.completed;
				}).length;
			}

			this.howManyChecked2 = function() {
				return self.todos.filter(function teste(todo) {
					return todo.completed;
				}).length;
			};

			this.numArray = function(comportamento, todos) {
				return todos.map(function(todo) {
					if (comportamento(todo)) {
						return 1;
					}
					return 0;
				});
			}

			this.howManyChecked3 = function() {
				return self.numArray(function(todo) {
					return todo.completed
				}, self.todos).reduce(function(a, b) {
					return a + b;
				});
			}

			this.howManyChecked3 = function() {
				return self.numArray(function(todo) {
					return !todo.completed
				}, self.todos).reduce(function(a, b) {
					return a + b;
				});
			}
			*/
        }
    ])
