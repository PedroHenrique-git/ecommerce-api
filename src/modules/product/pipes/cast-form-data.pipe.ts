import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class CastFormDataPipe
  implements PipeTransform<CreateProductDto, CreateProductDto>
{
  transform(
    value: CreateProductDto | UpdateProductDto,
  ): CreateProductDto | UpdateProductDto {
    const { categoryId, image, name, price } = value;

    const isCategoryInvalid = categoryId && isNaN(categoryId);
    const isPriceInvalid = price && isNaN(price);
    const isNameInvalid = name && typeof name !== 'string';
    const isImageInvalid = image && typeof image !== 'string';

    if (isCategoryInvalid) {
      throw new BadRequestException('Invalid categoryId type');
    }

    if (isPriceInvalid) {
      throw new BadRequestException('Invalid price type');
    }

    if (isNameInvalid) {
      throw new BadRequestException('Invalid name type');
    }

    if (isImageInvalid) {
      throw new BadRequestException('Invalid image type');
    }

    const dto =
      value instanceof CreateProductDto
        ? new CreateProductDto()
        : new UpdateProductDto();

    if (categoryId) {
      dto.categoryId = Number(categoryId);
    }

    if (price) {
      dto.price = Number(price);
    }

    if (name) {
      dto.name = name;
    }

    dto.image = image ?? '';

    return dto;
  }
}
