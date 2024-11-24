import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecr from 'aws-cdk-lib/aws-ecr';

export class FastapiDbTestuseEcrStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    const repository = new ecr.Repository(this, 'FastapiDbTestuseAppRepository', {
      repositoryName: 'fastapi-db-testuse-app',
    });

    new cdk.CfnOutput(this, 'RepositoryURI', {
      value: repository.repositoryUri,
      description: 'The URI of the ECR repository',
    });
  }
}
