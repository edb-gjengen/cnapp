import stripe from 'tipsi-stripe'
import Config from 'react-native-config';

stripe.init({
    publishableKey: Config.STRIPE_PUBLISHABLE_KEY,
});

class Charge {
    openStripe() {
        stripe.createTokenWithCard().then((data) => {
            // returns a token.tokenId which should be saved

        })
    }
}