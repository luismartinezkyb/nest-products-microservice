import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { PRODUCT_SERVICE } from 'src/config';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly products_client: ClientProxy,
  ) {}

  @Post()
  createProduct() {
    return 'CreateProduct';
  }
  @Get()
  getProducts(@Query() paginationDto: PaginationDto) {
    return this.products_client.send(
      { cmd: 'find_all_products' },
      paginationDto,
    );
    return 'Get products';
  }
  @Get(':id')
  async getProduct(@Param('id') id: string) {
    //TODO: Manejo de exceptions
    try {
      const product = await firstValueFrom(
        this.products_client.send(
          { cmd: 'find_one_product' },
          {
            id,
          },
        ),
      );
      return product;
    } catch (error) {
      console.log({ error });
      throw new BadRequestException(error);
    }
  }
  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return 'Delete one product' + id;
  }
  @Patch(':id')
  patchProduct(@Param('id') id: string, @Body() body: any) {
    return 'Update one product' + id;
  }
}
