import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Stripe } from 'stripe';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('stripe.secretKey'), {
      apiVersion: null,
    });
  }

  private get getClientUrl() {
    return this.configService.get('client.url');
  }

  async checkoutSession({ clientEmail, cartItems }: CreateCheckoutSessionDto) {
    const { url } = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: clientEmail,
      line_items: cartItems.map((cartItem) => {
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: cartItem.name,
            },
            unit_amount: cartItem.price,
          },
          quantity: cartItem.quantity,
        };
      }),
      success_url: `${this.getClientUrl}/success`,
      cancel_url: `${this.getClientUrl}/cancel`,
    });

    return { url };
  }
}
