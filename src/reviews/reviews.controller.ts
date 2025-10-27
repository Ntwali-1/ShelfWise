import { Controller, Post, Get, Patch, Delete, UseGuards, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/decorators/user.decorator';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('products/:productId')
  async createReview(
    @CurrentUser() user: any,
    @Param('productId') productId: string,
    @Body() createReviewDto: CreateReviewDto
  ) {
    return this.reviewsService.createReview(user.id, productId, createReviewDto);
  }

  @Get('products/:productId')
  async getProductReviews(@Param('productId') productId: string) {
    return this.reviewsService.getProductReviews(productId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':reviewId')
  async updateReview(
    @CurrentUser() user: any,
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Body() updateReviewDto: UpdateReviewDto
  ) {
    return this.reviewsService.updateReview(user.id, reviewId, updateReviewDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':reviewId')
  async deleteReview(
    @CurrentUser() user: any,
    @Param('reviewId', ParseIntPipe) reviewId: number
  ) {
    return this.reviewsService.deleteReview(user.id, reviewId);
  }
}

