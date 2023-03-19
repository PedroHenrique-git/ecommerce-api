import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ValidationSchemaPipe } from 'src/shared/pipes/validation-schema.pipe';
import { Role } from 'src/shared/protocols/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post()
  @Roles(Role.admin, Role.customer)
  @UseGuards(RolesGuard)
  checkoutSession(
    @Body(ValidationSchemaPipe) createCheckoutSession: CreateCheckoutSessionDto,
  ) {
    return this.paymentService.checkoutSession(createCheckoutSession);
  }
}
