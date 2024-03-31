import { mkdir, stat, appendFile } from 'fs/promises';
import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Injectable()
export class LoggingService implements LoggerService {
  // log(message: any, ...optionalParams: any[]) {

  // }

  // fatal(message: any, ...optionalParams: any[]) {}

  // error(message: any, ...optionalParams: any[]) {}

  // warn(message: any, ...optionalParams: any[]) {}

  // debug?(message: any, ...optionalParams: any[]) {}

  // verbose?(message: any, ...optionalParams: any[]) {}

  private logDirectory: string;
  private logFileName: string;
  private logFilePath: string;
  private maxLogFileSizeKB: number;
  private fileCreated = false;

  constructor(private readonly configService: ConfigService) {
    this.maxLogFileSizeKB = this.configService.get<number>('LOG_SIZE');
    this.logDirectory = join(
      process.cwd(),
      this.configService.get<string>('LOG_DIRECTORY'),
    );
    this.logFileName = this.configService.get<string>('LOG_FILENAME');
    this.createLogFile();
  }

  async log(message: string) {
    if (this.fileCreated) {
      const logMessage = `[${new Date().toISOString()}] ${message}\n`;
      await this.appendFileWithSizeCheck(logMessage);
    }
  }

  async error(message: string) {
    const logMessage = `[${new Date().toISOString()}] ${message}\n`;
    await this.appendFileWithSizeCheck(logMessage);
  }

  async warn(message: string) {
    const logMessage = `[${new Date().toISOString()}] ${message}\n`;
    await this.appendFileWithSizeCheck(logMessage);
  }

  async logRequest(url: string, method: string, query: any, body: any) {
    await this.log(
      `Request: ${method} ${url} | Query: ${JSON.stringify(query)} | Body: ${JSON.stringify(body)}`,
    );
  }

  async logResponse(statusCode: number) {
    await this.log(`Response: Status ${statusCode}`);
  }

  private async appendFileWithSizeCheck(logMessage: string) {
    try {
      const stats = await stat(this.logFilePath);
      const fileSizeInBytes = stats.size;
      const fileSizeInKB = fileSizeInBytes / 1024;

      if (fileSizeInKB + logMessage.length > this.maxLogFileSizeKB) {
        await this.createLogFile();
      }
    } catch {}

    await appendFile(this.logFilePath, logMessage);
  }

  async createLogFile() {
    try {
      await mkdir(this.logDirectory, { recursive: true });
      const currentDate = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/\D/g, '');
      this.logFilePath = join(
        this.logDirectory,
        `${this.logFileName}_${currentDate}.log`,
      );
      console.log(this.logFilePath);

      await appendFile(this.logFilePath, '');
      this.fileCreated = true;
    } catch (error) {
      console.error(`Error creating log file: ${error.message}`);
    }
  }
}
