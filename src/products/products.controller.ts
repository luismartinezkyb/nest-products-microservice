import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, finalize, firstValueFrom, tap } from 'rxjs';
import { PaginationDto } from 'src/common';
import { PRODUCT_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly products_client: ClientProxy,
  ) {}

  @Post()
  async createProduct(@Body() data: CreateProductDto) {
    try {
      const product = await firstValueFrom(
        this.products_client.send(
          { cmd: 'create_product' },
          {
            ...data,
          },
        ),
      );
      return product;
    } catch (error) {
      // console.log({ error });
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: `Product not created`,
      });
    }
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
      // console.log({ error });
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: `Product with id ${id} not found`,
      });
    }
    // return this.products_client
    //   .send(
    //     { cmd: 'find_one_product' },
    //     {
    //       id,
    //     },
    //   )
    //   .pipe(
    //     catchError((err) => {
    //       throw new RpcException(err);
    //     }),
    //   );
  }
  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    try {
      console.log({ id });
      const product = await firstValueFrom(
        this.products_client.send(
          { cmd: 'delete_product' },
          {
            id,
          },
        ),
      );
      return product;
    } catch (error) {
      // console.log({ error });
      throw new RpcException(error);
    }
  }
  @Patch(':id')
  async patchProduct(@Param('id') id: string, @Body() body: UpdateProductDto) {
    return this.products_client
      .send(
        { cmd: 'update_product' },
        {
          id,
          ...body,
        },
      )
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
    // try {
    //   const product = await firstValueFrom(
    //     this.products_client.send(
    //       { cmd: 'update_product' },
    //       {
    //         id,
    //         ...body,
    //       },
    //     ),
    //   );
    //   return product;
    // } catch (error) {
    //   // console.log({ error });
    //   throw new RpcException({
    //     status: HttpStatus.UNAUTHORIZED,
    //     message: `product failed updating`,
    //   });
    // }
  }
  @Post('wait/:id')
  async waitForR(@Param('id') id: string) {
    try {
      const now = Date.now();
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('terminando process 1...');
      const res = await firstValueFrom(
        this.products_client.send(
          { cmd: 'wait_response' },
          {
            id,
          },
        ),
      );
      console.log({ res });
      const time = Date.now() - now;
      return `ready after ${time}`;
    } catch (error) {
      // console.log({ error });
      throw new RpcException(error);
    }
  }
  @Post('wait2/:id')
  async waitForRe(@Param('id') id: string) {
    const now = Date.now();
    this.products_client
      .send(
        { cmd: 'wait_response' },
        {
          id,
        },
      )
      .pipe(
        tap((res) => {
          console.log({ res });
          const time = Date.now() - now;
          console.log(`ready after ${time}`);
          return `ready after ${time}`;
        }),
        catchError((err) => {
          console.error('Error capturado:', err);
          throw new RpcException(err);
        }),
      )
      .subscribe({
        next: (response) => console.log('Respuesta recibida:', response),
        error: (err) => console.error('Error en la suscripción:', err),
        complete: () => console.log('Proceso completado.'),
      });
    return 'Request sent, processing in background...';
  }

  @Post('not-wait/:id')
  async notWait(@Param('id') id: string) {
    try {
      const now = Date.now();
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('terminando process 1...');
      this.products_client.emit({ cmd: 'wait_response' }, { id });
      const time = Date.now() - now;
      return `ready after ${time}`;
    } catch (error) {
      // console.log({ error });
      throw new RpcException(error);
    }
  }
}
