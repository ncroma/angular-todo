function StorageService() {

    this.setStorage = function SetStorage(key, content) {
        /*            content.forEach(function(obj){delete obj.$$hashKey});
			-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	-	
		angular.toJson retira a informação desnecessária que o angular usa para obter JSON limpo*/
        window.localStorage.setItem(key, angular.toJson(content));
    };

    this.getStorage = function GetStorage(key) {
        if (!window.localStorage.getItem(key)) {
            return [];
        }
        return JSON.parse(window.localStorage.getItem(key));
    };
}

angular.module('app', [])
    .service('storageService', [StorageService])
    .controller('AppCtrl', ['$scope', 'storageService',

        function($scope, storageService) {

            var self = this;

            this.todosPorOrganizar = storageService.getStorage('todos');

            this.filterState = {};
            this.checkTodos = false;

            this.todosOrganizer = function todosOrganizer(todos) {
                var todosOrganizados = [];
                var todoArray = [];

                if (todos.length) {
                    for (var i = 0; i < todos.length; i++) {
                        todoArray.push(todos[i]);
                        if (!todos[i + 1]) {
                            todosOrganizados.push(new todoPorDia(todos[i].date, todoArray));
                        } else {
                            if (howManyDaysBetween(todos[i].date, todos[i + 1].date) > 0) {
                                todosOrganizados.push(new todoPorDia(todos[i].date, todoArray));
                                todoArray = [];
                            }
                        }
                    };
                }
                return todosOrganizados;
            }

            this.todosPorDia = self.todosOrganizer(self.todosPorOrganizar);

            $scope.$watch('AppCtrl.todosPorOrganizar', function() {
                self.todosPorDia = self.todosOrganizer(self.todosPorOrganizar);
                storageService.setStorage('todos', self.todosPorOrganizar);
            }, true);


            this.submit = function() {
                if (self.todo) {
                    self.todo.completed = false;
                    self.todo.date = Date.now();
                    self.todosPorOrganizar.push(self.todo);
                    self.todo = null;
                }
            }

            this.changeTodos = function() {
                for (var i = self.todosPorOrganizar.length - 1; i >= 0; i--) {
                    self.todosPorOrganizar[i].completed = !(self.checkTodos);
                }
            }

            this.todosChecked = function() {
                return self.checkTodos = self.todosPorOrganizar.every(function(todo) {
                    return todo.completed;
                });
            }

            this.remove = function(todo) {
                self.todosPorOrganizar.splice(self.todosPorOrganizar.indexOf(todo), 1);
            }


            this.howManyChecked = function() {
                return self.todosPorOrganizar.reduce(function(a, b) {
                    return a + (b.completed ? 1 : 0);
                }, 0);
            }

            this.howManyUnchecked = function() {
                return self.todosPorOrganizar.reduce(function(a, b) {
                    b = !b.completed ? 1 : 0;
                    return a + b;
                }, 0);
            }

            this.clearCompleted = function() {
                for (var i = self.todosPorOrganizar.length - 1; i >= 0; i--) {
                    if (self.todosPorOrganizar[i].completed) {
                        self.todosPorOrganizar.splice(i, 1);
                    }
                };
            }

            function todoPorDia(dia, todos) {
                this.dia = dia;
                this.listaTodos = todos;
            }

            function howManyDaysBetween(past, future) {
                var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                var firstDate = future;
                var secondDate = past;
                var difference_ms = Math.abs(future - past);
                return Math.round(difference_ms / oneDay);
            }
        }
    ])