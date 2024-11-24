import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';

import * as FastapiDbTestuseEcr from '../lib';

// example test. To run these tests, uncomment this file along with the
// example resource in lib/rails-ecr-stack.ts
test('ECR Repository Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new FastapiDbTestuseEcr.FastapiDbTestuseEcrStack(app, 'MyTestStack');
  // THEN
  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::ECR::Repository', 1);
  template.hasResourceProperties('AWS::ECR::Repository', {
    RepositoryName: 'fastapi-db-testuse-app',
  });
});
