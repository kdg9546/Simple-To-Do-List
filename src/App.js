import React, { Component } from "react"; 
import "bootstrap/dist/css/bootstrap.css"; 
import Container from "react-bootstrap/Container"; 
import Row from "react-bootstrap/Row"; 
import Col from "react-bootstrap/Col"; 
import Button from "react-bootstrap/Button"; 
import InputGroup from "react-bootstrap/InputGroup"; 
import FormControl from "react-bootstrap/FormControl"; 
import ListGroup from "react-bootstrap/ListGroup"; 
  
class App extends Component { 
    constructor(props) { 
        super(props); 
  
        this.state = { 
            userInput: "", 
            list: [], 
        }; 
    } 
  
    // Set a user input value 
    updateInput(value) { 
        this.setState({ 
            userInput: value, 
        }); 
    } 
  
    addItem() { 
        if (this.state.userInput !== "") { 
            fetch('http://localhost:3001/api/todo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ value: this.state.userInput }),
            })
            .then(response => response.json())
            .then(data => {
                const list = [...this.state.list];
                list.push({ id: data.id, value: data.value });
                this.setState({ list, userInput: "" });
            })
            .catch(error => console.error('Error:', error));
        } 
    } 
  
    deleteItem(id) { 
        fetch(`http://localhost:3001/api/todo/${id}`, {
            method: 'DELETE',
        })
        .then(() => {
            const list = this.state.list.filter(item => item.id !== id);
            this.setState({ list });
        })
        .catch(error => console.error('Error:', error));
    } 
  
    editItem = (index) => { 
        const editedTodo = prompt('Edit the todo:');
        if (editedTodo !== null && editedTodo.trim() !== '') {
            const id = this.state.list[index].id;
            fetch(`http://localhost:3001/api/todo/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ value: editedTodo }),
            })
            .then(() => {
                const list = [...this.state.list];
                list[index].value = editedTodo;
                this.setState({ list });
            })
            .catch(error => console.error('Error:', error));
        }
    } 
  
    componentDidMount() {
        fetch('http://localhost:3001/api/todo')
        .then(response => response.json())
        .then(data => this.setState({ list: data }))
        .catch(error => console.error('Error:', error));
    }

    render() { 
        return ( 
            <Container> 
                <Row 
                    style={{ 
                        display: "flex", 
                        justifyContent: "center", 
                        alignItems: "center", 
                        fontSize: "3rem", 
                        fontWeight: "bolder", 
                    }} 
                > 
                    TODO LIST 
                </Row> 
  
                <hr /> 
                <Row> 
                    <Col md={{ span: 5, offset: 4 }}> 
                        <InputGroup className="mb-3"> 
                            <FormControl 
                                placeholder="add item . . . "
                                size="lg"
                                value={this.state.userInput} 
                                onChange={(item) => 
                                    this.updateInput(item.target.value) 
                                } 
                                aria-label="add something"
                                aria-describedby="basic-addon2"
                            /> 
                            <InputGroup> 
                                <Button 
                                    variant="dark"
                                    className="mt-2"
                                    onClick={() => this.addItem()} 
                                > 
                                    ADD 
                                </Button> 
                            </InputGroup> 
                        </InputGroup> 
                    </Col> 
                </Row> 
                <Row> 
                    <Col md={{ span: 5, offset: 4 }}> 
                        <ListGroup> 
                            {/* map over and print items */} 
                            {this.state.list.map((item, index) => { 
                                return ( 
                                  <div key = {index} >  
                                    <ListGroup.Item 
                                        variant="dark"
                                        action 
                                        style={{display:"flex", 
                                                justifyContent:'space-between'
                                      }} 
                                    > 
                                        {item.value} 
                                        <span> 
                                        <Button style={{marginRight:"10px"}} 
                                        variant = "light"
                                        onClick={() => this.deleteItem(item.id)}> 
                                          Delete 
                                        </Button> 
                                        <Button variant = "light"
                                        onClick={() => this.editItem(index)}> 
                                          Edit 
                                        </Button> 
                                        </span> 
                                    </ListGroup.Item> 
                                  </div> 
                                ); 
                            })} 
                        </ListGroup> 
                    </Col> 
                </Row> 
            </Container> 
        ); 
    } 
} 
  
export default App;
