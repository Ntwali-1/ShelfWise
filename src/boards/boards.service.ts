import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class BoardsService {

  constructor(private prisma: PrismaService) {}

  async createBoard (data){
    //return this.prisma.board.create({
    //  data: data
    //});
    console.log("Creating a new board");
  }

  async allBoards() {
    console.log("Fetching all boards");
    // return this.prisma.board.findMany();
  }

  async updateBoard(id, newData) {
    console.log("Updating board");
  }
}