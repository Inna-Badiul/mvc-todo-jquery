$(function () {
  var ENTER_KEYCODE = 13;

  var $todoList = $('#todo-list');
  var $newTodo = $('#new-todo');

  var ViewModel = {
    todos: [],
    filter: undefined,
    createTodo: function(newTodoText){
      ViewModel.todos.push({
        title:newTodoText,
        isActive:true,
        uid: _.uniqueId('todos_')
      });
    },
    toggleAll: function(newState){
       _.forEach(ViewModel.todos, function(todo) {
         todo.isActive = newState;
      });
    },

    returnFilterdList : function(){
      var filtered = [];
      if(ViewModel.filter == "all"){
        filtered = ViewModel.todos;
      } else if(ViewModel.filter == "active"){
        filtered = _.filter(ViewModel.todos, function(o) { return o.isActive; });
      }else if(ViewModel.filter == 'completed'){
        filtered = _.filter(ViewModel.todos, function(o) { return !o.isActive; });
      }

      return filtered;
    },

    removeTodosByUid : function(selectedTodoId){
      ViewModel.todos = _.remove(ViewModel.todos, function(n) {
          return n.uid !== selectedTodoId ;
      });
    }
  };


  var App = {
    init: function(){
      todoTamplateAsFunction = _.template($("#todo-template").html());
      footerTamplateAsFunction = _.template($("#footer-template").html());
      this.bindEvents();
      var routes = {
        '/:filter': (function(f){
          ViewModel.filter = f;
          this.renderTodosList();
        }).bind(this)
      }
      Router(routes).init('/all');
    },

    bindEvents: function () {
      $newTodo.on('keyup', this.create.bind(this));
      $('#toggle-all').on( "change",this.toggleChekedAllList.bind(this));
      $('#footer').on('click','.clear-completed',this.clearComplited.bind(this));
      $todoList
        .on('click', ".delete-item", this.deleteItem.bind(this))
        .on( "change", ".chekbox-list", this.stateChange.bind(this));
    },

    renderTodosList : function(){
      var filteredTodos = ViewModel.returnFilterdList();
      var html = todoTamplateAsFunction({
        'todos': filteredTodos
      });
      $todoList.html(html);

      if(filteredTodos.length>0){
        $todoList.show();
      }else{
        $todoList.hide();
      }
      this.renderFooter();
    },

    renderFooter : function(){
      var html = footerTamplateAsFunction({});
      $('#footer').html(html);
    },

    create : function(event){
      var newTodoText;
      if (event.keyCode == ENTER_KEYCODE) {
        newTodoText = $newTodo.val();
        ViewModel.createTodo(newTodoText);

        App.renderTodosList();
        $newTodo.val('');
      }
    },

    toggleChekedAllList : function(){
       var isChecked = $('#toggle-all').prop("checked");
       ViewModel.toggleAll(!isChecked);
       App.renderTodosList();
     },

    deleteItem : function (event) {
        var selectedTodoId =$(event.currentTarget).parents('li').attr('data-uid');
        ViewModel.removeTodosByUid(selectedTodoId);
        App.renderTodosList();
    },

    stateChange : function(event){
        var selectedTodoId = $(event.currentTarget).parents('li').attr('data-uid');
        var selectedTodo = _.find(ViewModel.todos, function(o) { return o.uid === selectedTodoId; });
        selectedTodo.isActive = !event.currentTarget.checked;
    },

    clearComplited : function(){
        ViewModel.todos = _.filter(ViewModel.todos, function(o) {
          return o.isActive;
        });
        App.renderTodosList();
    }
  };
  App.init();
});
