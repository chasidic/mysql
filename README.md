# Example

```typescript
import { MySQL } from '@chasidic/mysql';

const mysql = new MySQL({
  user: 'root',
  password: '1234',
  host: 'localhost',
  database: 'ubimo'
});

mysql.run(async function (db) {
  await db.generateTs('generated/');
});
```