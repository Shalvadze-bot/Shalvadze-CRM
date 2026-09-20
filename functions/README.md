# SHALVADZE CRM read-only data function

`crmSnapshot` verifies a Firebase ID token for `taha@shalvadze.com`, reads the private CRM Google Sheet and the private `SHALVADZE_MARKETING_COMMERCIAL_CALENDAR_MASTER.xlsx` through server-side Google credentials, and returns one normalized application snapshot.

Before deployment:

1. Grant the deployed Firebase Functions runtime service account read-only access to both private Drive files.
2. Set `CRM_ALLOWED_ORIGINS` to the exact production origin and any approved local development origins.
3. Deploy with `firebase deploy --only functions:crmSnapshot`.

The function performs no writes to either source.
