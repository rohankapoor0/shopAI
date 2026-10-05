// Creates the template.yaml tables in a local/in-memory DynamoDB and seeds them on first run.
// Used by local.mjs (DynamoDB Local) and azure.mjs (dynalite). Call after the AWS_* env is set.
import { CreateTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';

export const setupTables = async () => {
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
  if (created) await import('./seed.mjs');
};
