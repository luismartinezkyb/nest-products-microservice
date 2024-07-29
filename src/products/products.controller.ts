import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
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
  getProducts() {
    return this.products_client.send({ cmd: 'find_all_products' }, {});
    return 'Get products';
  }
  @Get(':id')
  getProduct(@Param('id') id: string) {
    return 'Get one product' + id;
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
