import { Controller } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // @Post()
  @MessagePattern({ cmd: 'create_product' })
  public create(
    @Payload() createProductDto: CreateProductDto
  ) {
    return this.productsService.create( createProductDto );
  }

  // @Get()
  @MessagePattern({ cmd: 'find_all_products' })
  public findAll(
    @Payload() paginationDto: PaginationDto
  ) {
    return this.productsService.findAll( paginationDto );
  }

  // @Get(':id')
  @MessagePattern({ cmd: 'find_one_product' })
  public findOne(
    @Payload('id') id: number
  ) {
    return this.productsService.findOne( +id );
  }

  // @Patch(':id')
  @MessagePattern({ cmd: 'update_product' })
  public update(
    // @Param('id') id: number,
    // @Body() updateProductDto: UpdateProductDto
    @Payload() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.update( +updateProductDto.id, updateProductDto );
  }

  // @Delete(':id')
  @MessagePattern({ cmd: 'delete_product' })
  public remove(
    @Payload('id') id: number
  ) {
    return this.productsService.remove( +id );
  }
}
