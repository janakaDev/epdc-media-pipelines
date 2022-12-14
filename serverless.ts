import type { AWS } from '@serverless/typescript';
import * as dotenv from "dotenv";
dotenv.config({path: __dirname + '/.env'});

import hello from '@functions/hello';

const serverlessConfiguration: AWS = {
  service: process.env.APP_NAME,
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-dotenv-plugin'],
  provider: {
    profile: 'aws-non-prod',
    region: 'ap-south-1',
    name: 'aws',
    runtime: 'nodejs16.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: { hello },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node16',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
