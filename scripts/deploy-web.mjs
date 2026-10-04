// Builds the website and publishes it to the stack's S3 bucket behind CloudFront.
// Run from the repo root with AWS credentials (e.g. AWS_PROFILE=shopai): npm run deploy:web
import { execFileSync } from 'node:child_process';

const stack = process.env.STACK_NAME || 'shopai';
const region = process.env.AWS_REGION || 'ap-south-1';
const aws = (...args) => execFileSync('aws', [...args, '--region', region], { stdio: ['ignore', 'pipe', 'inherit'] }).toString();

const outputs = Object.fromEntries(
  JSON.parse(aws('cloudformation', 'describe-stacks', '--stack-name', stack, '--query', 'Stacks[0].Outputs', '--output', 'json'))
    .map(o => [o.OutputKey, o.OutputValue])
);
if (!outputs.SiteBucketName) {
  console.error(`Stack "${stack}" has no website outputs yet. Run "sam build && sam deploy" in backend/ first.`);
  process.exit(1);
}

// Variables already in the environment win over .env.local, so the build always points at this stack's API
execFileSync('npm', ['run', 'build'], { stdio: 'inherit', shell: true, env: { ...process.env, VITE_API_BASE_URL: outputs.ApiUrl } });

const bucket = `s3://${outputs.SiteBucketName}`;
// Hashed assets never change, so they cache for a year; index.html is re-checked on every visit
aws('s3', 'sync', 'dist', bucket, '--delete', '--exclude', 'index.html', '--cache-control', 'public,max-age=31536000,immutable');
aws('s3', 'cp', 'dist/index.html', `${bucket}/index.html`, '--cache-control', 'no-cache');
// Only present when the stack runs with CloudFrontEnabled=true (S3 website hosting has no cache to clear)
if (outputs.SiteDistributionId) aws('cloudfront', 'create-invalidation', '--distribution-id', outputs.SiteDistributionId, '--paths', '/*');

console.log(`\nPublished. Open ${outputs.SiteUrl} (new files can take a minute to show).`);
