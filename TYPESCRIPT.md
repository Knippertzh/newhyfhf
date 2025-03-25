# Running TypeScript Files in This Project

This project uses TypeScript with ESM (ECMAScript Modules). To run TypeScript files directly, you have several options:

## Option 1: Using the npm script (Recommended)

The package.json has been configured with a `ts` script that makes it easy to run TypeScript files:

```bash
npm run ts <path-to-typescript-file>
```

Example:
```bash
npm run ts scripts/add-jane-smith.ts
```

## Option 2: Using the helper scripts

There are several helper scripts in the `scripts` directory that can be used to run TypeScript files:

### Using run-ts.js

```bash
node scripts/run-ts.js <path-to-typescript-file>
```

Example:
```bash
node scripts/run-ts.js scripts/add-jane-smith.ts
```

### Using run-script.js

```bash
node scripts/run-script.js <path-to-typescript-file>
```

## Option 3: Using Node.js directly

You can also run TypeScript files directly with Node.js using the ts-node loader:

```bash
node --loader ts-node/esm <path-to-typescript-file>
```

Example:
```bash
node --loader ts-node/esm scripts/add-jane-smith.ts
```

## Troubleshooting

If you encounter the error `Unknown file extension ".ts"`, it means that Node.js doesn't know how to handle TypeScript files directly. Use one of the methods above to run TypeScript files.

## Prisma Seed Script

The Prisma seed script has been updated to use the correct configuration. You can run it with:

```bash
npm run seed
```

Or directly with Prisma:

```bash
npx prisma db seed
```