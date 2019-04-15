const todosLi = document.getElementsByTagName('li');
const checkBoxes = document.getElementsByClassName("checkBoxes");
const bubble = document.querySelector('.bubble');
const todosUl = document.querySelector("ul");

const todoList = {
  todos: [],

  addTodo: function (todoText) {
    this.todos.push({
      todoText: todoText,
      completed: false,

    });
  },
  changeTodo: function (position, todoText) {
    this.todos[position].todoText = todoText;
  },
  deleteTodo: function (position) {
    this.todos.splice(position, 1);
  },

  deleteAllTodos: function () {

    this.todos.splice(0, this.todos.length);
    saveTodosIntoLocalStorage();

  },


};

const handlers = {
  addTodo: function () {
    const addTodoTextInput = document.getElementById('addTodoTextInput');
    todoList.addTodo(addTodoTextInput.value);
    addTodoTextInput.value = '';
    view.displayTodos();
    saveTodosIntoLocalStorage();

  },
  changeTodo: function () {
    const changeTodoPositionInput = document.getElementById('changeTodoPositionInput');
    const changeTodoTextInput = document.getElementById('changeTodoTextInput');
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

  deleteSelected: function () {



    const checkBoxes = document.querySelectorAll('input:checked');

    for (checkBox of checkBoxes) { //checking if all elements are crossed, if so - then use deleteAllTodos() function
      if (checkBox.length === todoList.todos.length) {
        handlers.deleteAllTodos();
      } else {
        for (const element of todoList.todos) {

          if (element.completed === true) {

            const indexOfElement = todoList.todos.indexOf(element);
            todoList.todos.splice(indexOfElement, 1);
            view.displayTodos();
          }
        }
      }
    }


    saveTodosIntoLocalStorage();

  },

  toggleAll: function () {

    const buttons = document.getElementsByClassName('checkBoxes');
    const completedButtons = [];
    const uncompletedButtons = [];
    const todosLi = document.getElementsByTagName('li');

    //toggling checked value

    for (const button of buttons) {


      if (button.checked === true) {

        completedButtons.push(button);



      } else {
        uncompletedButtons.push(button);

      }

    }

    if (completedButtons.length === buttons.length) { //only when all elements are selected remove checked
      for (const button of buttons) {
        button.checked = false;
      }
    }

    for (const button of uncompletedButtons) {
      button.checked = true;
    }



    //toggling crossed class

    for (uncompletedTodo of uncompletedButtons) {
      for (todo of todosLi) {

        todoList.todos[todo.id].completed = true;
        todo.classList.add("crossed");

      }
    }


    if (completedButtons.length === buttons.length) { //only when all elements are selected remove class
      for (completedTodo of completedButtons) {
        for (todo of todosLi) {

          todoList.todos[todo.id].completed = false;
          todo.classList.remove("crossed");


        }
      }
    }


    saveTodosIntoLocalStorage();


  },
  toggleCrossed: function (event) {

    const todosLi = document.getElementsByTagName('li');
    const elementClicked = event.target.id;

    todosLi[elementClicked].classList.toggle("crossed");
    todoList.todos[elementClicked].completed = !todoList.todos[elementClicked].completed; //toggling the boolean value in the todoList array

    saveTodosIntoLocalStorage();


  },


  editText: function (event) {

  
    
    const elementClicked = event.target.id;
    const bubble = document.querySelector('.bubble'); 
   
    if(bubble){
      
      todosUl.removeChild(bubble) //deleting the bubble 

    }else{
      

      checkBoxes[elementClicked].parentNode.insertBefore(view.createBubble(), checkBoxes[elementClicked]); //inserting bubble before checkbox in the DOM

    }
   

  

    todosLi[elementClicked].setAttribute('contenteditable', 'true');



    const editButton = document.getElementsByClassName("editButton");
    const contenteditable = document.querySelector('[contenteditable]');


    

    todosLi[elementClicked].addEventListener('input', function () {


      event.target.textContent = "Save";
      
    });

   
    editButton[elementClicked].addEventListener("click", function () {


      if (event.target.textContent === "Save") {
        todoList.todos[elementClicked].todoText = contenteditable.textContent;
        saveTodosIntoLocalStorage();



        event.target.textContent = "Saved!";
        editButton[elementClicked].classList.add("blueButton");

        todosLi[elementClicked].setAttribute('contenteditable', 'false'); //disable edit after saving

        
    

        setTimeout(function () {

          event.target.textContent = "Edit";
          editButton[elementClicked].classList.remove("blueButton");
         

        }, 1000);
      } 

    

    });


    
  }
}




const view = {
  displayTodos: function () {

    const todosUl = document.querySelector('ul');
    todosUl.innerHTML = ''; //rendering all elements once again


    todoList.todos.forEach(function (todo, position) {



      const todoLi = document.createElement('li');
      todoLi.id = position; //adding html id to every each item in order to manipulate them later
      todoLi.textContent = todo.todoText;



      todosUl.appendChild(this.createCheckButton(position));
      todosUl.appendChild(todoLi);

      todosUl.appendChild(this.createEditButton(position)); //creating editButton and passing position/id value to it

      if (todo.completed === true) {

        todoLi.className = "crossed";
        button.checked = true;

      }




    }, this); //passing 'this' keyword explicitly to allow createDeleteButton function work within callback function

  },


  createEditButton: function (position) {

    const editButton = document.createElement('button'); //specyfing the type of element
    editButton.textContent = 'Edit'; //displaying text on a button
    editButton.className = 'editButton'; //adding class to the button
    editButton.setAttribute('onclick', 'handlers.editText(event)');
    editButton.id = position;
    editButton.setAttribute('title', 'Click and edit text');

    return editButton;

  },
  createCheckButton: function (position) {

    const button = document.createElement('input');
    button.className = 'checkBoxes';
    button.setAttribute('type', 'checkbox');
    button.setAttribute('onclick', 'handlers.toggleCrossed(event)');
    button.id = position;


    return button;
  },

  createBubble: function () {

    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.innerText = "Click on the text to edit it";

    return bubble;
  }
}



if (localStorage.length >= 1){ //checking if there are any elements in localStorage
  getTodosFromLocalStorage();
}




function saveTodosIntoLocalStorage() {

  const array = todoList.todos;
  localStorage.setItem("array", JSON.stringify(array));

}

function getTodosFromLocalStorage() {

  todoList.todos = JSON.parse(localStorage.getItem("array"));
  view.displayTodos();

}


Element.prototype.appendAfter = function (element) {
  element.parentNode.insertBefore(this, element.nextSibling);
}, false;