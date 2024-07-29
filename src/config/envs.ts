import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
  PRODUCTS_MICROSERVICE_HOST: string;
  PRODUCTS_MICROSERVICE_PORT: number;
}
const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    PRODUCTS_MICROSERVICE_HOST: joi.string().required(),
    PRODUCTS_MICROSERVICE_PORT: joi.number().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);
const envVars: EnvVars = value;
// console.log({ error });
// console.log({ envVars });

//JOI VALIDATION
if (error) {
  throw new Error(`Config Error Validation ${error.message}`);
}
export const envs = {
  port: envVars.PORT,
  microservice_products_host: envVars.PRODUCTS_MICROSERVICE_HOST,
  microservice_products_port: envVars.PRODUCTS_MICROSERVICE_PORT,
};
