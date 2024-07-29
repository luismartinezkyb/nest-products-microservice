import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

@Controller('products')
export class ProductsController {
  constructor() {}

  @Post()
  createProduct() {
    return 'CreateProduct';
  }
  @Get()
  getProducts() {
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
