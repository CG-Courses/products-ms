import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dtos';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  
  private readonly logger = new Logger( 'ProductsService' );

  public onModuleInit() {
    /** */
    this.$connect();
    this.logger.log( 'Database connected' );
  }

  public create( createProductDto: CreateProductDto ) {
    /** */
    return this.product.create({
      data: createProductDto
    });
  }

  public async findAll( { page, limit }: PaginationDto ) {
    /** */
    const totalPages: number = await this.product.count({
      where: { available: true }
    });
    const lastPage: number = Math.ceil( totalPages / limit );

    return {
      data: await this.product.findMany({
        where: { available: true },
        skip: ( page -1 ) * limit,
        take: limit
      }),
      metadata: {
        page,
        totalPages,
        lastPage
      }
    }
  }

  public async findOne( id: number ) {
    /** */
    const product = await this.product.findUnique({
      where: { id, available: true }
    });

    if ( !product ) {
      throw new NotFoundException( `Product with id #${id} not found` );
    }

    return product;

  }

  public async update( id: number, updateProductDto: UpdateProductDto ) {
    /** */
    const { id: __, ...data} = updateProductDto;

    await this.findOne( id );

    return this.product.update({
      where: { id },
      data
    });
  }

  public async remove( id: number ) {
    /** */
    await this.findOne( id );

    const product = await this.product.update({
      where: { id },
      data: {
        available: false
      }
    });

    return product;
    // return await this.product.delete({
    //   where: { id }
    // });
  }
}
