import { Controller, Post, Body, Get, Patch, Param } from "@nestjs/common";
import { BoardsService } from "./boards.service";
import { CreateBoardDto } from "./dto/createBoard.dto";

export class BoardsController {

  constructor(private readonly boardsService: BoardsService) {} 

  @Post('create')
  async createBoard(@Body() data: CreateBoardDto) {
    return this.boardsService.createBoard(data);
  }

  @Get('all')
  async allBoards() {
    return this.boardsService.allBoards();
  }

  @Patch(':id')
  async updateBoard(@Param('id') id: string, @Body() newData: CreateBoardDto) {
    return this.boardsService.updateBoard(+id, newData);
  }
}