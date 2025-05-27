import { INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

const initializeSwagger = (app: INestApplication, reflector: Reflector) => {
  // Swagger Config
  const config = new DocumentBuilder()
    .setTitle('Sample App API')
    .setDescription('API documentation for Sample NestJS project')
    .setVersion('1.0')
    .addCookieAuth('sessionId', {
      type: 'apiKey',
      scheme: 'cookie',
      in: 'cookie',
      name: 'sessionId',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey, methodKey) => methodKey,
    extraModels: [],
  });

  const theme = new SwaggerTheme();
  const options = {
    explorer: true,
    customSiteTitle: 'Sample App API Documentation',
    customfavIcon: '',
    swaggerOptions: {
      persistAuthorization: true,
      filter: true,
      showRequestDuration: true,
    },
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DRACULA) +
  `
    .opblock-tag.no-desc span {
      font-size: 1.25em !important;
      font-weight: 600;
    }
    .opblock-summary-description {
      font-size: 1.1em !important;
      font-style: italic;
    }
  `,
  };

  SwaggerModule.setup('api/docs', app, document, options);
};

export default initializeSwagger;
