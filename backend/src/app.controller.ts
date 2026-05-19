import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('bootstrap')
  bootstrap() { return this.appService.bootstrap(); }

  @Post('auth/register') register(@Body() body: any) { return this.appService.register(body); }
  @Post('auth/login') login(@Body() body: any) { return this.appService.login(body); }

  @Post('communities') createCommunity(@Body() body: any) { return this.appService.createCommunity(body); }
  @Patch('communities/:id/join') joinLeave(@Param('id') id: string, @Body() body: any) { return this.appService.joinLeaveCommunity(id, body.userId); }

  @Post('posts') createPost(@Body() body: any) { return this.appService.createPost(body); }
  @Patch('posts/:id') updatePost(@Param('id') id: string, @Body() body: any) { return this.appService.updatePost(id, body); }
  @Delete('posts/:id') deletePost(@Param('id') id: string) { return this.appService.deletePost(id); }
  @Patch('posts/:id/vote') vote(@Param('id') id: string, @Body() body: any) { return this.appService.votePost(id, body.userId, body.value); }

  @Post('comments') addComment(@Body() body: any) { return this.appService.addComment(body); }
  @Delete('comments/:id') deleteComment(@Param('id') id: string) { return this.appService.deleteComment(id); }
}
