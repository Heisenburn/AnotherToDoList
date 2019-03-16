var todoList = {
  todos: [],
  
  addTodo: function (todoText) {
    this.todos.push({
      todoText: todoText,
      completed: false
    });
  },
  changeTodo: function (position, todoText) {
    this.todos[position].todoText = todoText;
  },
  deleteTodo: function (position) {
    this.todos.splice(position, 1);
  },
  toggleCompleted: function (position) {
    var todo = this.todos[position];
    todo.completed = !todo.completed;
  },
  toggleAll: function () {
    var totalTodos = this.todos.length;
    var completedTodos = 0;

    // Get number of completed todos.
    this.todos.forEach(function (todo) {
      if (todo.completed === true) {
        completedTodos++;
      }


    });


    this.todos.forEach(function (todo) {

      //Case 1: If everything’s true, make everything false.
      if (completedTodos === totalTodos) {

        todo.completed = false;
        // Case 2: Otherwise, make everything true.
      } else {
        todo.completed = true;

      }

    });
  },
  deleteAllTodos: function () {

    this.todos.splice(0, this.todos.length);
    saveTodosIntoLocalStorage();

  },


};

var handlers = {
  addTodo: function () {
    var addTodoTextInput = document.getElementById('addTodoTextInput');
    todoList.addTodo(addTodoTextInput.value);
    addTodoTextInput.value = '';
    view.displayTodos();
    saveTodosIntoLocalStorage();
     
  },
  changeTodo: function () {
    var changeTodoPositionInput = document.getElementById('changeTodoPositionInput');
    var changeTodoTextInput = document.getElementById('changeTodoTextInput');
    todoList.changeTodo(changeTodoPositionInput.valueAsNumber, changeTodoTextInput.value);
    changeTodoPositionInput.value = '';
    changeTodoTextInput.value = '';
    view.displayTodos();
  },
  deleteTodo: function (position) {

    todoList.deleteTodo(position);
    view.displayTodos();
  },
  deleteAllTodos: function () {
    todoList.deleteAllTodos();
    view.displayTodos();
  },

  toggleCompleted: function () {
    var toggleCompletedPositionInput = document.getElementById('toggleCompletedPositionInput');
    todoList.toggleCompleted(toggleCompletedPositionInput.valueAsNumber);
    toggleCompletedPositionInput.value = '';
    view.displayTodos();
  },
  toggleAll: function () {
    todoList.toggleAll();
    view.displayTodos();
  }
};

var view = {
  displayTodos: function () {

    var todosUl = document.querySelector('ul');
    todosUl.innerHTML = ''; //rendering all elements once again

    
    todoList.todos.forEach(function (todo, position) {

      var todoLi = document.createElement('li');
      
      var circle = document.createElement('input');
      circle.className = 'checkBoxes';
     
      circle.setAttribute('type', 'checkbox');

     


      if (todo.completed === true) {
        //add class .tick 
      } else {

      }

      todoLi.id = position; //adding html id to every each item in order to manipulate them later

      todoLi.textContent = todo.todoText;



      todoLi.insertBefore(circle, todoLi.childNodes[0]);
      

      todosUl.appendChild(todoLi);

      

    }, this); //passing 'this' keyword explicitly to allow createDeleteButton function work within callback function

  },
  
 
  createDeleteButton: function () {
    var deleteButton = document.createElement('button'); //specyfing the type of element
    deleteButton.textContent = 'x'; //displaying text on a button
    deleteButton.className = 'deleteButton'; //adding class to the button
    return deleteButton;
  },
  setUpEventListeners: function () { //a single event listener instead of many

    var todosUl = document.querySelector('ul');
    var deleteAllButton = document.getElementById('deleteAllButton');



    todosUl.addEventListener('click', function (event) { //listening for clicking the delete button 

      //get the element that was clicked on
      var elementClicked = event.target;

      //chceck if elementClicked is a delete button
      if (elementClicked.className === 'deleteButton') {
        handlers.deleteTodo(parseInt(elementClicked.parentNode.id)); //eleteButton is child of li 
      }
    });




    deleteAllButton.addEventListener('click', function (event) {

      //get the element that was clicked on
      var elementClicked = event.target;

      if (elementClicked.idName === "deleteAllButton") {

        handlers.deleteAllTodos(parseInt(elementClicked));

      }
    });

  }
}




 
view.setUpEventListeners();


if (todoList.todos.length === 0){ //checking if there are any elements in the list before retrieving data from exisiting array
  getTodosFromLocalStorage(); 
}


view.setUpEventListeners();


function saveTodosIntoLocalStorage(){

  var array = todoList.todos;
  localStorage.setItem("array", JSON.stringify(array));
  
  }

function getTodosFromLocalStorage(){

todoList.todos = JSON.parse(localStorage.getItem("array"));
view.displayTodos();

}