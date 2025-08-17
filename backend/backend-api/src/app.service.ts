import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getTest(): { message: string; task: string } {
    return {
      message: 'Test endpoint for FIRSTKEY-28',
      task: 'Task 3 test - Do something',
    };
  }
}
