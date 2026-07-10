import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../docs/swagger.json';

export const swaggerConfig = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(swaggerDocument),
};
