//	This is the helper function created to handle
//	the payment via Stripe Checkout.
import StripeCheckout from 'react-stripe-checkout';
const STRIPE_PUBLISHABLE = 'pk_test_TYooMQauvdEDq54NiTphI7jx';

const onToken = (user,checkout) => token => 
    checkout(user, token.id);

const Checkout = ({ amount, user, checkout }) => 
    <StripeCheckout
      amount={amount * 100}
      token={onToken(user,checkout)}
      currency='USD'
      stripeKey={STRIPE_PUBLISHABLE}
/>
export default Checkout;
