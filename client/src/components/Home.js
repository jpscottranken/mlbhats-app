//	This is the homepage of the application.
//	It is where we display all items and give
//	the user an option to add items to the cart.
import { Component } from 'react';
import AppNavbar from './AppNavbar';
import {Card, CardText, CardBody, CardTitle, CardSubtitle, Button, Container} from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getItems } from '../actions/itemActions';
import { addToCart } from '../actions/cartActions';

class Home extends Component {
    componentDidMount(){
        this.props.getItems();
    }
	
    static propTypes = {
        getItems: PropTypes.func.isRequired,
        item: PropTypes.object.isRequired,
        isAuthenticated: PropTypes.bool,
        addToCart: PropTypes.func.isRequired,
        user: PropTypes.object.isRequired
    }
	
    onAddToCart = async (id, productId) => {
        await this.props.addToCart(id, productId, 1);
        alert ('Item added to Cart');
    }
	
    render(){
        const { items } = this.props.item;
        const user = this.props.user;
        return (
            <div>
            <AppNavbar/>
            <Container>
                <div className="row">
                {items.map((item)=>(
                    <div className="col-md-4">
                    <Card className="mb-4">
                        <CardBody>
							<img src={item.imageURL} alt="Team Hat" />
                            <CardTitle tag="h5">{item.name}</CardTitle>
                            <CardSubtitle tag="h6">Price: {item.price}</CardSubtitle>
                            <CardText>
								<p>Brand: {item.brand}<br />
								   Category: {item.category}</p>
							</CardText>
								{this.props.isAuthenticated ? 
								<Button
                                    color="success"
                                    size="sm"
                                    onClick={this.onAddToCart.bind(this, user._id, item._id)}
                                    >Add To Cart</Button>  :
                                    null}      
                        </CardBody>
                    </Card>
                    </div>
                ))}
                 </div>
            </Container>
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    item: state.item,
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
})

export default connect(mapStateToProps, {getItems, addToCart})(Home);
