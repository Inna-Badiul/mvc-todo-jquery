$(function () {
  var ENTER_KEYCODE = 13;

  var $todoList = $('#todo-list');
  var $newTodo = $('#new-todo');

  var ViewModel = {
    todos: [],
    filter: undefined,
    createTodo: function(newTodoText){
      this.todos.push({
        title:newTodoText,
        isActive:true,
        uid: _.uniqueId('todos_')
      });
    },
    toggleAll: function(newState){
      _.forEach(this.todos, function(todo) {
        todo.isActive = newState;
      });
    },

    returnFilteredList : function(){
      var filtered = [];
      if(this.filter == "all"){
        filtered = this.todos;
      } else if(this.filter == "active"){
        filtered = _.filter(this.todos, function(o) { return o.isActive; });
      }else if(this.filter == 'completed'){
        filtered = _.filter(this.todos, function(o) { return !o.isActive; });
      }

      return filtered;
    },

    removeTodosByUid : function(selectedTodoId){
      this.todos = _.remove(this.todos, function(n) {
        return n.uid !== selectedTodoId ;
      });
    },

    setTodoState: function(id, isActive){
      var selectedTodo = _.find(this.todos, function(o) { return o.uid === id; });
      selectedTodo.isActive = isActive;
    },

    clearComplitedTodos : function(){
      this.todos = _.filter(this.todos, function(o) {
        return o.isActive;
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
      var filteredTodos = ViewModel.returnFilteredList();
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

        this.renderTodosList();
        $newTodo.val('');
      }
    },

    toggleChekedAllList : function(){
      var isChecked = $('#toggle-all').prop("checked");
      ViewModel.toggleAll(!isChecked);
      this.renderTodosList();
    },

    deleteItem : function (event) {
      var selectedTodoId =$(event.currentTarget).parents('li').attr('data-uid');
      ViewModel.removeTodosByUid(selectedTodoId);
      this.renderTodosList();
    },

    stateChange : function(event){
      var selectedTodoId = $(event.currentTarget).parents('li').attr('data-uid');
      ViewModel.setTodoState(selectedTodoId, !event.currentTarget.checked);
    },

    clearComplited : function(){
      ViewModel.clearComplitedTodos();
      this.renderTodosList();
    }
  };
  App.init();
});
