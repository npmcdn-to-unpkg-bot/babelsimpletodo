import { Button, Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';

const { Component } = React;
const wellStyles = {maxWidth: 400, margin: '0 auto 10px'};


/**
 * Our main application component.
 */
class TodoApp extends Component {
  constructor() {
    super();
    /**
     * here we declare TodoApp's state. this holds the input values for 
     * our brand, model, and owner inputs, the currently active filter,
     * and the todos.
     */
    this.state = {
      task: '',
      project: '',
      owner: '',
      visibilityFilter: 'SHOW_ALL',
      todos: []
    };
    
    // don't worry about this
    this.addTodo = this.addTodo.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.selectFilter = this.selectFilter.bind(this);
    this.toggleTodo = this.toggleTodo.bind(this);
  }

  render() {
    const { todos, visibilityFilter} = this.state;
    const visibleTodos = getVisibleTodos(todos, visibilityFilter);
    
    return (
      <div className='container'>
        <Navbar>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="#">React-Bootstrap</a>
      </Navbar.Brand>
    </Navbar.Header>
    <Nav>
      <NavItem eventKey={1} href="#">Link</NavItem>
      <NavItem eventKey={2} href="#">Link</NavItem>
      <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
        <MenuItem eventKey={3.1}>Action</MenuItem>
        <MenuItem eventKey={3.2}>Another action</MenuItem>
        <MenuItem eventKey={3.3}>Something else here</MenuItem>
        <MenuItem divider />
        <MenuItem eventKey={3.3}>Separated link</MenuItem>
      </NavDropdown>
    </Nav>
  </Navbar>
        <div className="well" style={wellStyles}>
    <Button bsStyle="primary" bsSize="large" block>Block level button</Button>
    <Button bsSize="large" block>Block level button</Button>
  </div>
        <input
          value={this.state.task}
          placeholder="What is the task?"
          onChange={(event) => {
            /** 
             * when the input changes, this is fired.
             * we get the new input value by accessing `event.target.value`.
             */
            const value = event.target.value;
            this.handleInput('task', value);
          }}/>
        <input

          value={this.state.project}
          placeholder="Which project is it for?"
          onChange={(event) => {
            const value = event.target.value;
            this.handleInput('project', value);
          }}/>
        <input
          value={this.state.owner}
          placeholder="Who will do this task?"
          onChange={(event) => {
            const value = event.target.value;
            this.handleInput('owner', value);
          }}/>
        <button 
          onClick={this.addTodo}>
          Add Todo
        </button>

        <p>
          Filter by:
          {' '}
          <FilterLink 
            filter='SHOW_ALL'
            currentFilter={visibilityFilter}
            selectFilter={this.selectFilter}>All</FilterLink>
          {' '}
          <FilterLink 
            filter='SHOW_ACTIVE' 
            currentFilter={visibilityFilter}
            selectFilter={this.selectFilter}>Active</FilterLink>
          {' '}
          <FilterLink 
            filter='SHOW_COMPLETED' 
            currentFilter={visibilityFilter}
            selectFilter={this.selectFilter}>Completed</FilterLink>
        </p>
        <TodoList 
          todos={visibleTodos}
          toggleTodo={this.toggleTodo}/>
      </div>
    )
  }  

  /**
   * add a new todo
   */
  addTodo () {
    // get current todos from state
    const todos = this.state.todos;
    
    // define our new todo
    const newTodo = {
      task: this.state.task,
      project: this.state.project,
      owner: this.state.owner,
      completed: false
    };

    // update todos with our new todo, then reset input fields.
    this.setState({
      todos: todos.concat([newTodo]),
      task: '',
      project: '',
      owner: ''
    });
  }
  
  /**
   * sets the active filter
   */
  selectFilter (filter) {
    this.setState({
      visibilityFilter: filter
    });
  }
  
  /**
   * toggles the todo as complete/not complete.
   */
  toggleTodo (index) {
    const todos = this.state.todos;
    
    // we're updating the `completed` property of the todo
    // by making a new copy of it using Object.assign,
    // instead of mutating the todo object directly.
    const updatedTodo = Object.assign({}, todos[index], {
      completed: !todos[index].completed
    });
    
    this.setState({
      todos: updateTodo(todos, updatedTodo, index)
    });
  }
  
  /**
   * this updates the input field's value in the state
   */
  handleInput (field, value) {
    this.setState({
      [field]: value
    });
  }
}

/**
 * TodoList component.  Displays a list of todos.
 */
const TodoList = (props) => {
  const {todos, toggleTodo} = props;
  return (
    <ul>
      { todos.map((todo, index) => {
        return (
          <Todo
            key={index}
            task={todo.task}
            project={todo.project}
            owner={todo.owner}
            completed={todo.completed}
            handleClick={() => toggleTodo(index)}/>
        );
      }) }
    </ul>
  )
};

/**
 * Single Todo component.
 */
const Todo = (props) => {
  const {
    task, 
    project, 
    owner, 
    completed, 
    handleClick,
    key
  } = props;
  
  return (
    <li className='todo'
      key={key}
      onClick={handleClick}>
      <p>Task: {task}</p>
  <div className="well" style={wellStyles}>
    <Button bsStyle="primary" bsSize="large" block>{project}</Button>
    <Button bsSize="large" block>{owner}</Button>
  </div>
      <p>Completed: {completed ? <span className='checkmark'>✓</span> : <span className='xmark'>NO</span>}</p>
    </li>
  )
}


/**
 * The `Filter by` link components.
 */
const FilterLink = (props) => {
  // if this filter is active, return a plain text span.
  if (props.filter === props.currentFilter) {
    return <span>{props.children}</span>
  }

  // if it's not active, return this <a>
  return (
    <a href='#'
      onClick={() => {
        props.selectFilter(props.filter)
      }}>
      {props.children}
    </a>
  );
};


/********************
 * HELPER FUNCTIONS
 ********************/

/**
 * Returns the todos that are visible and not filtered.
 */
const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(
        t => t.completed
      );
    case 'SHOW_ACTIVE':
      return todos.filter(
        t => !t.completed
      );
    default:
      return todos;
  }
};

/**
 * Given an array of todos, this uses slice to remove the todo at `index`
 * and replace it with `todo`.
 *
 * This is so we can update a todo's `completed` property without mutating the
 * `todos` state.
 */
const updateTodo = (todos, todo, index) => {
  return todos.slice(0, index).concat([todo]).concat(todos.slice(index + 1));
};


// Now we just render our app to the target element.
ReactDOM.render(<TodoApp/>, document.getElementById('app'));
