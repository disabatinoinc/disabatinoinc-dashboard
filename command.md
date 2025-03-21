```docker build -t disabatinoinc-dashboard .```

```docker run -d -p 3010:3010 --name disabatinoinc-dashboard-container --env-file .env.local disabatinoinc-dashboard```