// src/config/env-validation.ts
import { IsString, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import * as fs from 'fs';

export function validateEnvFile(envFilePath: string) {
    if (!fs.existsSync(envFilePath)) {
        throw new Error(`❌ Environment file "${envFilePath}" not found!`);
    }
}

export class EnvironmentVariables {
    @IsString()
    MONGODB_URI: string;
}

export function validateEnvironmentVariables(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });
    const errors = validateSync(validatedConfig, { skipMissingProperties: false });
    
    if (errors.length > 0) {
        throw new Error(`❌ Invalid environment configuration: ${errors}`);
    }
    
    return validatedConfig;
}