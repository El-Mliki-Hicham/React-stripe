import {
    CardElement,
    Elements,
    useElements,
    useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';

console.log();

function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [token, setToken] = useState(null);

    const handleSubmit = async event => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);

        const { error, token } = await stripe.createToken(cardElement);

        if (error) {
            console.error(error);
        } else {
            console.log(token);
            setToken(token);

            fetch(
                'http://192.168.11.109:8000/api/shop/customer/payment-intent',
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        stripeToken: token.id,
                    }),
                }
            )
                .then(res => {
                    console.log(res);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={!stripe}>
                Pay
            </button>
            {token && <div>Token: {token.id}</div>}
        </form>
    );
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function App() {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
}
export default App;
