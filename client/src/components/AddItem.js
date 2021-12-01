//	This component is used to add items to the store.
//	It is not linked to the Navbar as we don't want
//	users to add new items to the store.
import { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import { addItem } from '../actions/itemActions';
import PropTypes from 'prop-types';
import AppNavbar from './AppNavbar';
class AddItem extends Component {
    state = {
        title: '',
        description: '',
        category: '',
        price: '',
    }
	
    static propTypes = {
        isAuthenticated: PropTypes.bool
    }
	
    onChange = (e) => {
        this.setState({[e.target.name]:e.target.value});
    }
	
    onSubmit = async (e) => {
        e.preventDefault();
        const newItem = {
            title: this.state.title,
            description: this.state.description,
            category: this.state.category,
            price: this.state.price
        }
		
        await this.props.addItem(newItem);
		
        alert('Item added successfully');
    }
	
    render(){
        return(
            <div>
                <AppNavbar/>
                <Container>
                    <h2 className="text-center mb-3">Add a new Item</h2>
                    { this.props.isAuthenticated ?
                    <Form onSubmit={this.onSubmit}>
                        <FormGroup>
                            <Label for="name">Name</Label>
                            <Input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Name of the item"
                                onChange={this.onChange}
                            />
                            <br/>
                            <Label for="imageURL">Image URL</Label>
                            <Input
                                type="text"
                                name="imageURL"
                                id="imageURL"
                                placeholder="Image URL of the item"
                                onChange={this.onChange}
                            />
                            <br/>
                            <Label for="description">Description</Label>
                            <Input
                                type="text"
                                name="description"
                                id="description"
                                placeholder="Description of the item"
                                onChange={this.onChange}
                            />
                            <br/>
                            <Label for="brand">Brand</Label>
                            <Input 
                                type="text"
                                name="brand" 
                                id="brand"
                                placeholder="Brand of the item"
                                onChange={this.onChange}
                                >
                            </Input>
                            <br/>
                            <Label for="category">Category</Label>
                            <Input 
                                type="text"
                                name="category" 
                                id="category"
                                placeholder="Category of the item"
                                onChange={this.onChange}
                                >
                            </Input>
                            <br/>
                            <Label for="numberInStock">Number in Stock</Label>
                            <Input
                                type="number"
                                name="numberInStock"
                                id="numberInStock"
                                placeholder="Number in Stock of the item"
                                onChange={this.onChange}
                            />
                            <br/>
                            <Label for="price">Price</Label>
                            <Input
                                type="number"
                                name="price"
                                id="price"
                                placeholder="Price of the item"
                                onChange={this.onChange}
                            />
                            
                            <Button
                                color="dark"
                                style={{marginTop: '2rem'}}
                                block
                            >Add Item</Button>
                        </FormGroup>
                    </Form> : 
                    <Alert className="text-center" color="danger">Login to add items!</Alert>
                    }
                </Container>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    item: state.item,
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps,{addItem})(AddItem);
