#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import S3BucketStack from '../src/S3BucketStack';
import LambdaStack from '../src/LambdaStack';

const app = new cdk.App();
new S3BucketStack(app, 'S3BucketStack');cdk 
new LambdaStack(app, 'LambdaStack');
