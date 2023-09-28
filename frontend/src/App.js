import React,{Component} from 'react';
import './App.css';
import Modal from './components/Modal';
// import { Modal } from 'bootstrap';
import axios from 'axios';

// var tasks = [
//   {
//     id:2,
//     title: ' weekly checkup',
//     description : "na",
//     completed : false
//   }
// ]
// function App() {
//   return (
//     <div className="App">
//       Hello.
//     </div>
//   );
// }

class App extends Component{
  constructor(props){
    super(props);
    this.state={
      modal:false,
      viewCompleted:false,
      todoList : [],
      activeItem:{
        title:'',
        description:'',
        completed:false,
      }
    }
  }

componentDidMount(){
  this.refreshList();
}

refreshList=()=>{
  axios
  .get("http://127.0.0.1:8000/api/tasks/")
  .then(res => this.setState({todoList:res.data}))
  .catch(err => console.log(err))
}

  toggle = ()=>{
    this.setState({modal: !this.state.modal})
  };

  handleSubmit = item => {
    this.toggle();
    if(item.id){
      axios.put(`http://127.0.0.1:8000/api/tasks/${item.id}/`,item)
      .then(res=> this.refreshList());
    }
    axios.post('http://127.0.0.1:8000/api/tasks/',item)
    .then(res => this.refreshList());
    // alert('Saved!' + JSON.stringify(item));
  };

  handleDelete = item => {
    if(item.id){
      axios.delete(`http://127.0.0.1:8000/api/tasks/${item.id}/`)
      .then(res=> this.refreshList());
    };
    // alert('Deleted!' + JSON.stringify(item));
  };

  createItem = ()=>{
    const item = { title:'',description: "", completed: false};
    this.setState({activeItem:item ,modal :!this.state.modal});
  };

  editItem = item =>{
    this.setState({activeItem:item ,modal :!this.state.modal})
  }


  displayCompleted = status =>{
    if(status){
      return this.setState({viewCompleted:true});
    }
    return this.setState({viewCompleted:false});
  }
  renderTabList = () =>{
    return(
      <div className='my-5 tab-list'>
        <span
        onClick={()=> this.displayCompleted(true)}
        className={this.state.viewCompleted ? 'active' : ''}
        >
          Completed
        </span>
        <span
        onClick={()=> this.displayCompleted(false)}
        className={this.state.viewCompleted ? '' : 'active'}
        >
          Incompleted
        </span>
      </div>
    )
  }
  renderItems = ()=>{
    const {viewCompleted} = this.state;
    const newItems = this.state.todoList.filter(
      item => item.completed == viewCompleted
    );
    return newItems.map((item=>(
      <li
      key={item.id}
      className='list-group-items d-flex justify-content-between align-items-center'>
      <span className={`todo-title me-2 ${this.state.viewCompleted ? "completed-todo":""}`}
      title={item.title}>
        {item.title}
      </span>
      <span>
        <button className='btn btn-info mt-2 me-2' onClick={()=>this.editItem(item)}>Edit</button>
        <button className='btn btn-danger mt-2 me-2' onClick={()=>this.handleDelete(item)}>Delete</button>
      </span>
      </li>
    )));
  };
  render(){
    return(
      <main className='content p-3 mb-2 bg-info'>
        <h1 className='text-white text-uppercase text-center my-4'>Task Manager</h1>
        <div className='row'>
          <div className='col-md-6 col-sma-10 mx-auto p-0'>
            <div className='card p-3'>
              <div>
                <button className='btn btn-dark' onClick={this.createItem}>Add Task</button>
              </div>
              {this.renderTabList()}
              <ul className='list-group list-group-flush'>
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        <footer className='my-3 mb-2 bg-info text-white text-center'>Copyrights 2023 &copy; All Rights Reserved</footer>
        {this.state.modal ?(
          <Modal activeItem={this.state.activeItem} toggle={this.toggle}
          onSave={this.handleSubmit}/>
        ): null}
      </main>
    )
  }
}

export default App;
