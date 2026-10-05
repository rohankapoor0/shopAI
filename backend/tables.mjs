// Creates the template.yaml tables in DynamoDB Local (local.mjs) or dynalite (azure.mjs).
// Call after the AWS_* env is set. Resolves to true when at least one table was new (i.e. needs data).
import { CreateTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';

export const createTables = async () => {
  const client = new DynamoDBClient({});
  let created = false;
  for (const [name, key] of [['users', 'email'], ['stores', 'id'], ['products', 'id'], ['orders', 'id'], ['returns', 'id']]) {
    try {
      await client.send(new CreateTableCommand({
        TableName: `${process.env.TABLE_PREFIX}-${name}`,
        BillingMode: 'PAY_PER_REQUEST',
        AttributeDefinitions: [{ AttributeName: key, AttributeType: 'S' }],
        KeySchema: [{ AttributeName: key, KeyType: 'HASH' }]
      }));
      created = true;
    } catch (err) {
      if (err.name !== 'ResourceInUseException') throw err;
    }
  }
  return created;
};
