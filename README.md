# Next.js sample app deployed with CDK

## Badges

[![CodeQL](https://github.com/simonespa/next-cdk-sample-app/actions/workflows/codeql.yml/badge.svg?branch=main&event=push)](https://github.com/simonespa/next-cdk-sample-app/actions/workflows/codeql.yml)
[![ESLint](https://github.com/simonespa/next-cdk-sample-app/actions/workflows/eslint.yml/badge.svg?branch=main&event=push)](https://github.com/simonespa/next-cdk-sample-app/actions/workflows/eslint.yml)
[![Dependency Review](https://github.com/simonespa/next-cdk-sample-app/actions/workflows/dependency-review.yml/badge.svg?branch=main&event=push)](https://github.com/simonespa/next-cdk-sample-app/actions/workflows/dependency-review.yml)

## CDK

- [Getting started with the AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html)
- [Working with the AWS CDK in TypeScript](https://docs.aws.amazon.com/cdk/v2/guide/work-with-cdk-typescript.html)
- [AWS CDK Toolkit (cdk command)](https://docs.aws.amazon.com/cdk/v2/guide/cli.html)
- [Bootstrapping](https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html)
- [Runtime context](https://docs.aws.amazon.com/cdk/v2/guide/context.html)
- [Construct Hub](https://constructs.dev/search?q=&cdk=aws-cdk&cdkver=2&sort=downloadsDesc&offset=0)
- [CDK Examples](https://github.com/aws-samples/aws-cdk-examples)

## CodeBuild

- https://docs.aws.amazon.com/codebuild/latest/userguide/welcome.html

## Infrastructure


### Bootstrap

It creates a CloudFormation template and the "StagingBucket" S3 bucket.

cdk-hnb659fds-assets-563806041421-eu-west-1

The `cdk bootstrap` command requires the following permissions.


1. Deploy with no permissions and I get the following error

- `cloudformation:DescribeStacks`

```
current credentials could not be used to assume 'arn:aws:iam::<ACCOUNT_ID>:role/cdk-hnb659fds-deploy-role-<ACCOUNT_ID>-<REGION>' but are for the right account proceeding anyway

Building assets failed: Error: Building Assets Failed: AccessDenied: User: arn:aws:sts::<ACCOUNT_ID>:assumed-role/<ROLE>/aws-sdk-js-1668183222121 is not authorized to perform: cloudformation:DescribeStacks on resource: arn:aws:cloudformation:eu-west-1:<ACCOUNT_ID>:stack/CDKToolkit/* because no identity-based policy allows the cloudformation:DescribeStacks action
```

2. Once added the "DescribeStacks" permission, I get the following error

```
current credentials could not be used to assume 'arn:aws:iam::563806041421:role/cdk-hnb659fds-deploy-role-563806041421-eu-west-1', but are for the right account. Proceeding anyway.
Could not read SSM parameter /cdk-bootstrap/hnb659fds/version: User: arn:aws:sts::563806041421:assumed-role/developer/aws-sdk-js-1668183972251 is not authorized to perform: ssm:GetParameter on resource: arn:aws:ssm:eu-west-1:563806041421:parameter/cdk-bootstrap/hnb659fds/version because no identity-based policy allows the ssm:GetParameter action

Building assets failed: Error: Building Assets Failed: Error: AppStack: This CDK deployment requires bootstrap stack version '6', found an older version. Please run 'cdk bootstrap'.
```

3. When I run the bootstrap process I get the following error

- `cloudformation:CreateChangeSet`

```
Using default execution policy of 'arn:aws:iam::aws:policy/AdministratorAccess'. Pass '--cloudformation-execution-policies' to customize.

Environment aws://563806041421/eu-west-1 failed bootstrapping: AccessDenied: User: arn:aws:sts::563806041421:assumed-role/developer/aws-sdk-js-1668184202144 is not authorized to perform: cloudformation:CreateChangeSet on resource: arn:aws:cloudformation:eu-west-1:563806041421:stack/CDKToolkit/* because no identity-based policy allows the cloudformation:CreateChangeSet action
```

4. I try bootstrap again

- `cloudformation:DescribeChangeSet`

```
Using default execution policy of 'arn:aws:iam::aws:policy/AdministratorAccess'. Pass '--cloudformation-execution-policies' to customize.

Environment aws://563806041421/eu-west-1 failed bootstrapping: AccessDenied: User: arn:aws:sts::563806041421:assumed-role/developer/aws-sdk-js-1668184780571 is not authorized to perform: cloudformation:DescribeChangeSet on resource: arn:aws:cloudformation:eu-west-1:563806041421:stack/CDKToolkit/89589a80-61df-11ed-8cad-062449d767df because no identity-based policy allows the cloudformation:DescribeChangeSet action
```

5. I try bootstrap again and it gets stuck. So I run it in with a verbose flag and I get the following error

```
[17:15:26] [AWS cloudformation 200 0.11s 0 retries] describeStacks({ StackName: 'CDKToolkit' })
[17:15:26] Stack CDKToolkit has an ongoing operation in progress and is not stable (REVIEW_IN_PROGRESS (User Initiated))
```

Have to remove the stack and try again

```
aws cloudformation delete-stack --stack-name CDKToolkit
```

6. I try the bootstrap process again, and this time I get the following error:

- `cloudformation:ExecuteChangeSet`

```

[18:37:27] Call failed: executeChangeSet({"StackName":"CDKToolkit","ChangeSetName":"cdk-deploy-change-set","ClientRequestToken":"exec5848bbcc-15a2-4d59-a836-6655630d3986"}) => User: arn:aws:sts::563806041421:assumed-role/developer/aws-sdk-js-1668191821899 is not authorized to perform: cloudformation:ExecuteChangeSet on resource: arn:aws:cloudformation:eu-west-1:563806041421:stack/CDKToolkit/e113e990-61ef-11ed-8f55-02046e1c0861 because no identity-based policy allows the cloudformation:ExecuteChangeSet action (code=AccessDenied)

 ❌  Environment aws://563806041421/eu-west-1 failed bootstrapping: AccessDenied: User: arn:aws:sts::563806041421:assumed-role/developer/aws-sdk-js-1668191821899 is not authorized to perform: cloudformation:ExecuteChangeSet on resource: arn:aws:cloudformation:eu-west-1:563806041421:stack/CDKToolkit/e113e990-61ef-11ed-8f55-02046e1c0861 because no identity-based policy allows the cloudformation:ExecuteChangeSet action
```

7. Finally the stack lands on CloudFormation and starts creating resources, but it failed creation. This happened because the "FilePublishingRole" resource failed to be created due to a missing "iam:GetRole" permission.

- `iam:GetRole`
- `s3:CreateBucket`

```
API: iam:GetRole User: arn:aws:sts::563806041421:assumed-role/developer/aws-sdk-js-1668192707168 is not authorized to perform: iam:GetRole on resource: role cdk-hnb659fds-file-publishing-role-563806041421-eu-west-1 because no identity-based policy allows the iam:GetRole action,

API: iam:GetRole User: arn:aws:sts::563806041421:assumed-role/developer/aws-sdk-js-1668192707168 is not authorized to perform: iam:GetRole on resource: role cdk-hnb659fds-lookup-role-563806041421-eu-west-1 because no identity-based policy allows the iam:GetRole action,

API: iam:GetRole User: arn:aws:sts::563806041421:assumed-role/developer/aws-sdk-js-1668192707168 is not authorized to perform: iam:GetRole on resource: role cdk-hnb659fds-image-publishing-role-563806041421-eu-west-1 because no identity-based policy allows the iam:GetRole action,

API: iam:GetRole User: arn:aws:sts::563806041421:assumed-role/developer/aws-sdk-js-1668192707168 is not authorized to perform: iam:GetRole on resource: role cdk-hnb659fds-cfn-exec-role-563806041421-eu-west-1 because no identity-based policy allows the iam:GetRole action,

API: s3:CreateBucket Access Denied
```

8. Another try

- `iam:CreateRole`
- `ssm:PutParameter`
- `ecr:CreateRepository`

```
- CloudFormationExecutionRole
iam:CreateRole on resource: arn:aws:iam::563806041421:role/cdk-hnb659fds-cfn-exec-role-563806041421-eu-west-1

- FilePublishingRole
iam:CreateRole on resource: arn:aws:iam::563806041421:role/cdk-hnb659fds-file-publishing-role-563806041421-eu-west-1

- ImagePublishingRole
iam:CreateRole on resource: arn:aws:iam::563806041421:role/cdk-hnb659fds-image-publishing-role-563806041421-eu-west-1

- CdkBootstrapVersion
ssm:PutParameter on resource: arn:aws:ssm:eu-west-1:563806041421:parameter/cdk-bootstrap/hnb659fds/version

- ContainerAssetsRepository
ecr:CreateRepository on resource: arn:aws:ecr:eu-west-1:563806041421:repository/cdk-hnb659fds-container-assets-563806041421-eu-west-1
```

9. Among the errors when creating the resources of the CF stack, you get some misleading

```
18:16:01 | CREATE_FAILED        | AWS::S3::Bucket       | StagingBucket
API: s3:SetBucketEncryption Access Denied

18:51:00 | CREATE_FAILED        | AWS::S3::Bucket       | StagingBucket
API: s3:PutPublicAccessBlock Access Denied
```

But these actions don't exist. We should use
* `s3:PutEncryptionConfiguration` instead of `s3:SetBucketEncryption`
* `s3:PutBucketPublicAccessBlock` instead of `s3:PutPublicAccessBlock`

10. Once added all permission required, the stack is created. It seems there are no errors, but by looking into the events, you'll spot the following error messages for each resource ID

```
Did not have IAM permissions to process tags on AWS::IAM::Role resource.
- LookupRole
- ImagePublishingRole
- FilePublishingRole
- DeploymentActionRole
```

Must add "iam:TagRole" to the following resources
- arn:aws:iam::563806041421:role/cdk-*-deploy-role-563806041421-*"
- arn:aws:iam::563806041421:role/cdk-*-lookup-role-563806041421-*"
- arn:aws:iam::563806041421:role/cdk-*-file-publishing-role-563806041421-*"
- arn:aws:iam::563806041421:role/cdk-*-image-publishing-role-563806041421-*"

```
Failed to check if policy already exists due to lack of getRolePolicy permission, you might be overriding or adopting an existing policy on this Role
- LookupRole
- FilePublishingRoleDefaultPolicy
- DeploymentActionRole
- ImagePublishingRoleDefaultPolicy
```

Must add "iam:GetRolePolicy" to the following resources
- arn:aws:iam::563806041421:role/cdk-*-deploy-role-563806041421-*
- arn:aws:iam::563806041421:role/cdk-*-lookup-role-563806041421-*
- arn:aws:iam::563806041421:role/cdk-*-file-publishing-role-563806041421-*
- arn:aws:iam::563806041421:role/cdk-*-image-publishing-role-563806041421-*

```
Failed to check if S3 Bucket Policy already exists due to lack of describe permission, you might be overriding or adopting an existing policy on this Bucket
- StagingBucketPolicy
```

Must add "s3:GetBucketPolicy" to the "arn:aws:s3:::cdk-*-assets-563806041421-*" staging bucket

### Deploy

The `cdk deploy` command requires the following permissions:

The `cloudformation:DescribeStacks` on the stack resources and `ssm:GetParameter` on the SSM parameter are the first 3 permission that you encounter, and they are explicitly reported as error by the command.

After these permission, you get some warning

```
current credentials could not be used to assume 'arn:aws:iam::563806041421:role/cdk-hnb659fds-deploy-role-563806041421-eu-west-1', but are for the right account. Proceeding anyway.
```

you have a feeling that something isn't right, but CDK continues anyway. Then you get

```
current credentials could not be used to assume 'arn:aws:iam::563806041421:role/cdk-hnb659fds-lookup-role-563806041421-eu-west-1', but are for the right account. Proceeding anyway.
(To get rid of this warning, please upgrade to bootstrap version >= 8)
```

again, a warning but not very clear about the details of the issue.

At this point I had to use the `--verbose` flag to spot the following:

```
Assuming role failed: User: arn:aws:sts::563806041421:assumed-role/developer/aws-sdk-js-1668724137996 is not authorized to perform: sts:AssumeRole on resource: arn:aws:iam::563806041421:role/cdk-hnb659fds-deploy-role-563806041421-eu-west-1
```

```
Assuming role failed: User: arn:aws:sts::563806041421:assumed-role/developer/aws-sdk-js-1668724137996 is not authorized to perform: sts:AssumeRole on resource: arn:aws:iam::563806041421:role/cdk-hnb659fds-lookup-role-563806041421-eu-west-1
```
