import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { CloudinaryService } from './cloudinary.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { Roles } from '../rbac/role.decorator';
import { Role } from '../rbac/role.enum';
import { RolesGuard } from '../rbac/role.guard';
import { multerMemoryStorage } from './multer.config';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(ClerkAuthGuard, RolesGuard)
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multerMemoryStorage,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Invalid file type. Allowed: JPEG, PNG, WebP, GIF'), false);
        }
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file (JPEG, PNG, WebP, GIF - max 5MB)',
        },
      },
    },
  })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const url = await this.cloudinaryService.uploadImage(file);
    return { url };
  }
}
