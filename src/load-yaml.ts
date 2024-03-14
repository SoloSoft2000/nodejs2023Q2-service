import { OpenAPIObject } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const API_DOC_FILENAME = '../../doc/api.yaml';

export const loadYaml = () => {
  const pathToFile = join(__dirname, API_DOC_FILENAME);
  const file: string = readFileSync(pathToFile, 'utf8');
  return yaml.load(file) as OpenAPIObject;
};
