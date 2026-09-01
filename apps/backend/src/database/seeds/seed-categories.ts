import { DataSource } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { CategoryFee } from '../../categories/entities/category-fee.entity';

export async function seedCategories(dataSource: DataSource) {
  const categoryRepo = dataSource.getRepository(Category);
  const feeRepo = dataSource.getRepository(CategoryFee);

  const categories = [
    { name: 'Plumbing', icon: 'water-outline', fee: 2000 },
    { name: 'Electrical', icon: 'flash-outline', fee: 2500 },
    { name: 'Cleaning', icon: 'sparkles-outline', fee: 1000 },
    { name: 'Carpentry', icon: 'hammer-outline', fee: 2000 },
    { name: 'Painting', icon: 'color-palette-outline', fee: 1500 },
    { name: 'AC Repair', icon: 'snow-outline', fee: 3000 },
  ];

  for (const c of categories) {
    let category = await categoryRepo.findOne({ where: { name: c.name } });
    if (!category) {
      category = await categoryRepo.save(categoryRepo.create({ name: c.name, icon: c.icon }));
    }

    const existingFee = await feeRepo.findOne({ where: { categoryId: category.id } });
    if (!existingFee) {
      await feeRepo.save(feeRepo.create({ categoryId: category.id, inspectionFee: c.fee }));
    }
  }

  console.log('Categories seeded');
}