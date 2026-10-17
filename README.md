# Nitesh Shah Portfolio

Vite + React portfolio with working certificate PDF links.

## Certificates

The certificate PDFs are stored in `src/assets/` and imported by Vite in `src/main.jsx`. This makes the links work both locally and after deployment to Vercel.

- MongoDB: `src/assets/mongodb-connecting-nodejs-certificate.pdf`
- DAA: `src/assets/nitesh-shah-daa-certificate.pdf`

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy

Commit and push the project to the connected GitHub repository. Vercel will automatically deploy the new commit.

Do not move the certificate PDFs out of `src/assets/` unless you also update their imports in `src/main.jsx`.
