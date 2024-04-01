import { mkdir, stat, appendFile } from 'fs/promises';
import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Injectable()
export class LoggingService extends ConsoleLogger {
  private logDirectory: string;
  private errLogFilePath: string;
  private logFilePath: string;
  private maxLogFileSizeKB: number;
  private fileCreated = false;
  private logLevels: LogLevel[] = ['log'];

  constructor(private readonly configService: ConfigService) {
    super();
    this.maxLogFileSizeKB = this.configService.get<number>('LOG_SIZE');
    this.logDirectory = join(
      process.cwd(),
      this.configService.get<string>('LOG_DIRECTORY'),
    );
    this.createLogFile('INIT');
  }

  setLogLevels(levels: LogLevel[]) {
    this.logLevels = levels;
  }

  async log(message: string) {
    super.log(message);
    if (this.fileCreated && this.logLevels.includes('log')) {
      const logMessage = `[${new Date().toISOString()}] ${message}\n`;
      await this.appendFileWithSizeCheck(logMessage);
    }
  }

  async verbose(message: string) {
    super.verbose(message);
    if (this.fileCreated && this.logLevels.includes('verbose')) {
      const logMessage = `[${new Date().toISOString()}] Verbose: ${message}\n`;
      await this.appendFileWithSizeCheck(logMessage);
    }
  }

  async error(message: string) {
    super.error(message);
    if (this.logLevels.includes('error')) {
      const logMessage = `[${new Date().toISOString()}] Error: ${message}\n`;
      await this.appendFileWithSizeCheck(logMessage, true);
    }
  }

  async warn(message: string) {
    super.warn(message);
    if (this.logLevels.includes('warn')) {
      const logMessage = `[${new Date().toISOString()}] Warn: ${message}\n`;
      await this.appendFileWithSizeCheck(logMessage, true);
    }
  }

  async fatal(message: string) {
    super.fatal(message);
    if (this.logLevels.includes('fatal')) {
      const logMessage = `[${new Date().toISOString()}] Fatal: ${message}\n`;
      await this.appendFileWithSizeCheck(logMessage, true);
    }
  }

  async logRequest(url: string, method: string, query: any, body: any) {
    if (this.logLevels.includes('log')) {
      await this.log(
        `Request: ${method} ${url} | Query: ${JSON.stringify(query)} | Body: ${JSON.stringify(body)}`,
      );
    }
  }

  async logResponse(statusCode: number) {
    if (this.logLevels.includes('log')) {
      await this.log(`Response: Status ${statusCode}`);
    }
  }

  private async appendFileWithSizeCheck(logMessage: string, isError = false) {
    try {
      const stats = await stat(
        isError ? this.errLogFilePath : this.logFilePath,
      );
      const fileSizeInBytes = stats.size;
      const fileSizeInKB = fileSizeInBytes / 1024;

      if (fileSizeInKB + logMessage.length > this.maxLogFileSizeKB) {
        await this.createLogFile(isError ? 'ERR' : 'APP');
      }
    } catch {}

    await appendFile(
      isError ? this.errLogFilePath : this.logFilePath,
      logMessage,
    );
  }

  async createLogFile(typeFile: 'INIT' | 'APP' | 'ERR') {
    try {
      await mkdir(this.logDirectory, { recursive: true });
      const currentDate = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/\D/g, '');
      if (typeFile === 'INIT' || typeFile === 'APP') {
        this.logFilePath = join(
          this.logDirectory,
          `LOG_${currentDate}_APP.log`,
        );
        await appendFile(this.logFilePath, '');
        this.fileCreated = true;
      }
      if (typeFile === 'INIT' || typeFile === 'ERR') {
        this.errLogFilePath = join(
          this.logDirectory,
          `LOG_${currentDate}_ERR.log`,
        );
      }
    } catch (error) {
      console.error(`Error creating log file: ${error.message}`);
    }
  }
}
