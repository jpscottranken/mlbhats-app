//	This is the component that displays the user cart.
//	It shows all items a user has in their cart, gives
//	the option to remove them from the cart, and gives
//	the option to checkout (pay for products and order them).
import { Component, Fragment } from 'react';
import AppNavbar from './AppNavbar';
import {Card, CardText, CardBody, CardTitle, CardSubtitle, Button, Alert, Container} from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCart, updateCart, deleteFromCart } from '../actions/cartActions';
import Checkout from './Checkout';
import { checkout } from '../actions/orderActions';

class Cart extends Component {
    state = {
        loaded: false,
    }
	
    static propTypes = {
        getCart: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
        cardError: PropTypes.bool,
        addToCart: PropTypes.func.isRequired,
        deleteFromCart: PropTypes.func.isRequired,
		updateCart: PropTypes.func.isRequired,
        user: PropTypes.object.isRequired,
        cart: PropTypes.object.isRequired,
        checkout: PropTypes.func.isRequired
    }
	
    getCartItems = async (id) => {
        await this.props.getCart(id);
        this.state.loaded = true;
    }
	
    onDeleteFromCart = (id, itemId) => {
        this.props.deleteFromCart(id, itemId);
    }  
	
    onUpdateCart = async (userId, productId, qty) => {
      await this.props.updateCart(userId, productId, qty);
    }
    
    render(){
        const user = this.props.user;
        if(this.props.isAuthenticated && !this.props.cart.loading && !this.state.loaded){
            this.getCartItems(user._id);
        }
        return(
            <div>
                <AppNavbar/>
                {this.props.isAuthenticated ?
                    <Fragment>
                        {this.props.cart.cart ? null :
                            <Alert color="info" className="text-center">Your cart is empty!</Alert>
                        }
                    </Fragment>
                    : <Alert color="danger" className="text-center">Login to View!</Alert>
                }  
                {this.props.isAuthenticated && !this.props.cart.loading && this.state.loaded && this.props.cart.cart?
                <Container>
                    <div className="row">
                        {this.props.cart.cart.items.map((item)=>(
                            <div className="col-md-4">
                        <Card>
                            <CardBody>
                                <CardTitle tag="h5">Name: {item.name}</CardTitle>
                                <CardSubtitle tag="h6">Price: {item.price.toFixed(2)}</CardSubtitle>
                                <div style={qtyBox}>
                                  <p style={{...qtyBtn, border:"1px solid red", color: "Red"}} onClick={() => this.onUpdateCart(user._id, item.productId, item.quantity - 1)}>
                                    -1
                                  </p>
                                  <CardText>Quantity: {item.quantity}</CardText>
                                  <p style={{...qtyBtn, border:"1px solid green", color: "green"}} onClick={() => this.onUpdateCart(user._id, item.productId, item.quantity + 1)}>
             
                                    +1
                                  </p>
                                </div>
                                <Button color="danger" onClick={this.onDeleteFromCart.bind(this, user._id, item.productId)}>Delete</Button>
                            </CardBody>
                        </Card>
                        <br/>
                        </div>
                        ))}
                        <div class="col-md-12">
                        <Card>
                            <CardBody>
                                <CardTitle tag="h5">Total Cost = ${this.props.cart.cart.bill.toFixed(0)}</CardTitle>
                                <Checkout
                                    user={user._id}
                                    amount={this.props.cart.cart.bill}
                                    checkout={this.props.checkout}
                                />                   
                            </CardBody>
                        </Card>
                        </div>
                    </div>
                </Container>
                    :null}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    cart: state.cart,
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
})

const qtyBox = {display: "flex", justifyContent: "space-evenly", border: "1px solid #aaa", borderRadius: "5px", paddingTop: "5px", paddingBottom: "5px", marginBottom: "5px"};
const qtyBtn = {paddingLeft: "5px", paddingRight: "5px", borderRadius: "5px", marginBottom: "0px"};

export default connect(mapStateToProps, {getCart, updateCart, deleteFromCart, checkout})(Cart);
