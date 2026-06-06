# Running The Project

## Local Development

Use Node 22 from Laragon. The global Node 24 installation caused Nuxt/dev-server issues in this project.

```powershell
cd D:\comma
$env:PATH = "C:\laragon\bin\nodejs\node-v22;$env:PATH"
npm run dev -- --host 0.0.0.0 --port 3000
```

Open:

```text
http://localhost:3000
```

## Backend

The backend project is stored at:

```text
D:\laragon\www\comma
```

Local backend database:

```text
database: comma
username: root
password: empty
```

Imported site dump:

```text
C:\Users\ahmed\Downloads\u267168793_commarealestat.sql
```

Import command used:

```powershell
& "C:\laragon\bin\mysql\mysql-5.7.44-winx64\bin\mysql.exe" -uroot --default-character-set=utf8mb4 comma < "C:\Users\ahmed\Downloads\u267168793_commarealestat.sql"
```

After changing backend `.env`, clear Laravel config cache:

```powershell
cd D:\laragon\www\comma
php artisan optimize:clear
```

## Working Versions

These versions are known to work together:

```text
node: v22.12.0
nuxt: 3.21.7
nuxi: 3.35.2
@nuxtjs/i18n: 9.5.6
```

## Notes

- Do not run this project with Node 24 unless the dependency set is updated and retested.
- Do not redirect Nuxt dev logs into files inside `D:\comma`; Nuxt watches the project folder and can rebuild repeatedly.
- If the browser shows a white page, check DevTools Console first. The previous root cause was an incompatible `@nuxtjs/i18n` version importing a missing `unhead` export.
- Google Analytics/Ads fetch failures in local dev are not the app startup issue.
