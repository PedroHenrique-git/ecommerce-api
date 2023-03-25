import { Body, Controller, Post } from '@nestjs/common';
import { ValidationSchemaPipe } from 'src/shared/pipes/validation-schema.pipe';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post()
  checkoutSession(
    @Body(ValidationSchemaPipe) createCheckoutSession: CreateCheckoutSessionDto,
  ) {
    return this.paymentService.checkoutSession(createCheckoutSession);
  }
}
