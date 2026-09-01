import dataSource from '../data-source';
import { seedCategories } from './seed-categories';
import { seedServices } from './seed-services';

async function run() {
  await dataSource.initialize();
  await seedCategories(dataSource);
  await seedServices(dataSource);
  await dataSource.destroy();
  console.log('Seeding complete');
}

run().catch((err) => {
  console.error('Seed failed', err);
  process.exit(1);
});