/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe(
  'pk_test_51QlmqlLpURvnaO1ZWr2OkYpQbXjvSeUTXEuqtTeopdGHRH6Z6bzg2zoDyS0uz2gFMgLXEkxoD82RMseEK9IKE4rL00NMwaIlzX'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      // `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}` // dev
      `/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
