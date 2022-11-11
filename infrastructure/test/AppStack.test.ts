import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import AppStack from '../src/AppStack';

// example test. To run these tests, uncomment this file along with the
// example resource in src/infrastructure-stack.ts
test('Code Pipeline Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new AppStack(app, 'AppStack');
  // THEN
  const template = Template.fromStack(stack);

  // template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
  //   "UpdateReplacePolicy": "Retain",
  //   "DeletionPolicy": "Retain"
  // });
});
