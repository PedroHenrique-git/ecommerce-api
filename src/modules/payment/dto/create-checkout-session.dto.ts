import { CartItem } from '../protocols/cartitem.type';

export class CreateCheckoutSessionDto {
  clientEmail: string;
  cartItems: CartItem[];
}
