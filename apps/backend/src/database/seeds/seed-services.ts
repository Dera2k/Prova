import { DataSource } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Service } from '../../services/entities/service.entity';
import { PricingModel } from '../../common/enums/pricing-model.enum';

export async function seedServices(dataSource: DataSource) {
  const categoryRepo = dataSource.getRepository(Category);
  const serviceRepo = dataSource.getRepository(Service);

  const servicesByCategory: Record<
    string,
    {
      name: string;
      description: string;
      pricingModel: PricingModel;
      startingPrice?: number;
    }[]
  > = {
    Plumbing: [
      {
        name: 'Pipe Leak Repair',
        description: 'Fix leaking or damaged water pipes',
        pricingModel: PricingModel.QUOTE_REQUIRED,
      },
      {
        name: 'Drain Unclogging',
        description: 'Clear blocked sinks, drains, and pipes',
        pricingModel: PricingModel.STARTING_FROM,
        startingPrice: 5000,
      },
      {
        name: 'Toilet Repair',
        description: 'Repair faulty or leaking toilets',
        pricingModel: PricingModel.STARTING_FROM,
        startingPrice: 5000,
      },
      {
        name: 'Faucet Repair',
        description: 'Repair leaking or faulty taps and faucets',
        pricingModel: PricingModel.STARTING_FROM,
        startingPrice: 3500,
      },
      {
        name: 'Water Heater Repair',
        description: 'Diagnose and repair water heater problems',
        pricingModel: PricingModel.QUOTE_REQUIRED,
      },
      {
        name: 'Water Tank Installation',
        description: 'Install and connect household water tanks',
        pricingModel: PricingModel.QUOTE_REQUIRED,
      },
      {
        name: 'Borehole Plumbing',
        description: 'Install, repair, or maintain borehole plumbing connections',
        pricingModel: PricingModel.QUOTE_REQUIRED,
      },
    ],

    Electrical: [
      {
        name: 'Wiring Installation',
        description: 'Install new electrical wiring',
        pricingModel: PricingModel.QUOTE_REQUIRED,
      },
      {
        name: 'Socket Repair',
        description: 'Repair faulty electrical sockets',
        pricingModel: PricingModel.FIXED,
        startingPrice: 3000,
      },
      {
        name: 'Light Fixture Installation',
        description: 'Install or replace ceiling and wall light fixtures',
        pricingModel: PricingModel.STARTING_FROM,
        startingPrice: 4000,
      },
      {
        name: 'Electrical Fault Diagnosis',
        description: 'Identify electrical faults and power issues',
        pricingModel: PricingModel.FIXED,
        startingPrice: 5000,
      },
      {
        name: 'Ceiling Fan Installation',
        description: 'Install and wire ceiling fans',
        pricingModel: PricingModel.STARTING_FROM,
        startingPrice: 5000,
      },
      {
        name: 'Generator Repair',
        description: 'Diagnose and repair household generators',
        pricingModel: PricingModel.QUOTE_REQUIRED,
      },
      {
        name: 'Inverter Installation',
        description: 'Install and configure home inverter systems',
        pricingModel: PricingModel.QUOTE_REQUIRED,
      },
      {
        name: 'Prepaid Meter Installation',
        description: 'Install and configure prepaid electricity meters',
        pricingModel: PricingModel.QUOTE_REQUIRED,
      },
    ],

    Cleaning: [
      {
        name: 'Home Deep Clean',
        description: 'Thorough cleaning of the entire home',
        pricingModel: PricingModel.HOURLY,
        startingPrice: 2000,
      },
      {
        name: 'Regular Home Cleaning',
        description: 'Routine cleaning of living spaces',
        pricingModel: PricingModel.HOURLY,
        startingPrice: 1500,
      },
      {
        name: 'Move-In Cleaning',
        description: 'Deep clean a property before moving in',
        pricingModel: PricingModel.QUOTE_REQUIRED,
      },
      {
        name: 'Move-Out Cleaning',
        description: 'Clean a property before leaving',
        pricingModel: PricingModel.QUOTE_REQUIRED,
      },
      {
        name: 'Kitchen Cleaning',
        description: 'Deep cleaning of kitchen surfaces and appliances',
        pricingModel: PricingModel.STARTING_FROM,
        startingPrice: 5000,
      },
      {
        name: 'Bathroom Cleaning',
        description: 'Deep cleaning and sanitisation of bathrooms',
        pricingModel: PricingModel.STARTING_FROM,
        startingPrice: 4000,
      },
      {
        name: 'Post-Construction Cleaning',
        description: 'Remove dust and debris after construction or renovation',
        pricingModel: PricingModel.QUOTE_REQUIRED,
      },
      {
        name: 'Office Cleaning',
        description: 'Cleaning service for offices and workspaces',
        pricingModel: PricingModel.HOURLY,
        startingPrice: 2000,
      },
    ],

    Carpentry: [
      {
        name: 'Furniture Repair',
        description: 'Repair broken or damaged furniture',
        pricingModel: PricingModel.QUOTE_REQUIRED,
      },
      {
        name: 'Furniture Assembly',
        description: 'Assemble beds, tables, shelves, and other furniture',
        pricingModel: PricingModel.STARTING_FROM,
        startingPrice: 5000,
      },
      {
        name: 'Wardrobe Repair',
        description: 'Repair damaged wardrobes and cabinet fittings',
        pricingModel: PricingModel.QUOTE_REQUIRED,
      },
      {
        name: 'Door Repair',
        description: 'Repair damaged doors, hinges, and frames',
        pricingModel: PricingModel.STARTING_FROM,
        startingPrice: 5000,
      },
      {
        name: 'Shelf Installation',
        description: 'Install wall-mounted and freestanding shelves',
        pricingModel: PricingModel.STARTING_FROM,
        startingPrice: 4000,
      },
      {
        name: 'Custom Furniture',
        description: 'Build furniture based on custom requirements',
        pricingModel: PricingModel.QUOTE_REQUIRED,
      },
    ],

    Painting: [
      {
        name: 'Interior Painting',
        description: 'Paint interior walls and rooms',
        pricingModel: PricingModel.QUOTE_REQUIRED,
      },
      {
        name: 'Exterior Painting',
        description: 'Paint exterior walls and surfaces',
        pricingModel: PricingModel.QUOTE_REQUIRED,
      },
      {
        name: 'Room Repainting',
        description: 'Refresh the paint in a single room',
        pricingModel: PricingModel.STARTING_FROM,
        startingPrice: 15000,
      },
      {
        name: 'Wall Touch-Up',
        description: 'Repair and repaint small damaged areas',
        pricingModel: PricingModel.STARTING_FROM,
        startingPrice: 5000,
      },
      {
        name: 'Ceiling Painting',
        description: 'Paint and refresh ceiling surfaces',
        pricingModel: PricingModel.QUOTE_REQUIRED,
      },
    ],

    'AC Repair': [
      {
        name: 'AC Servicing',
        description: 'General air conditioner cleaning and maintenance',
        pricingModel: PricingModel.FIXED,
        startingPrice: 8000,
      },
      {
        name: 'AC Gas Refill',
        description: 'Refill refrigerant gas in air conditioning systems',
        pricingModel: PricingModel.STARTING_FROM,
        startingPrice: 12000,
      },
      {
        name: 'AC Installation',
        description: 'Install split and other residential air conditioners',
        pricingModel: PricingModel.QUOTE_REQUIRED,
      },
      {
        name: 'AC Repair',
        description: 'Diagnose and repair faulty air conditioners',
        pricingModel: PricingModel.QUOTE_REQUIRED,
      },
      {
        name: 'AC Leak Repair',
        description: 'Find and repair refrigerant or water leaks',
        pricingModel: PricingModel.QUOTE_REQUIRED,
      },
      {
        name: 'AC Deep Cleaning',
        description: 'Thorough cleaning of indoor and outdoor AC units',
        pricingModel: PricingModel.FIXED,
        startingPrice: 10000,
      },
    ],

    'Appliance Repair': [
      {
        name: 'Washing Machine Repair',
        description: 'Diagnose and repair faulty washing machines',
        pricingModel: PricingModel.QUOTE_REQUIRED,
      },
      {
        name: 'Refrigerator Repair',
        description: 'Repair cooling and electrical issues in refrigerators',
        pricingModel: PricingModel.QUOTE_REQUIRED,
      },
      {
        name: 'Freezer Repair',
        description: 'Diagnose and repair faulty freezers',
        pricingModel: PricingModel.QUOTE_REQUIRED,
      },
      {
        name: 'Microwave Repair',
        description: 'Repair faulty microwave ovens',
        pricingModel: PricingModel.QUOTE_REQUIRED,
      },
      {
        name: 'Dishwasher Repair',
        description: 'Diagnose and repair household dishwashers',
        pricingModel: PricingModel.QUOTE_REQUIRED,
      },
    ],

    'Generator & Power': [
      {
        name: 'Generator Servicing',
        description: 'Routine maintenance and servicing of generators',
        pricingModel: PricingModel.FIXED,
        startingPrice: 10000,
      },
      {
        name: 'Generator Repair',
        description: 'Diagnose and repair generator faults',
        pricingModel: PricingModel.QUOTE_REQUIRED,
      },
      {
        name: 'Generator Installation',
        description: 'Install and connect household generators',
        pricingModel: PricingModel.QUOTE_REQUIRED,
      },
      {
        name: 'Inverter Installation',
        description: 'Install and configure inverter power systems',
        pricingModel: PricingModel.QUOTE_REQUIRED,
      },
      {
        name: 'Solar Panel Installation',
        description: 'Install residential solar panels and systems',
        pricingModel: PricingModel.QUOTE_REQUIRED,
      },
    ],

    'Pest Control': [
      {
        name: 'General Pest Control',
        description: 'Treat common household pests',
        pricingModel: PricingModel.STARTING_FROM,
        startingPrice: 10000,
      },
      {
        name: 'Cockroach Treatment',
        description: 'Targeted treatment for cockroach infestations',
        pricingModel: PricingModel.STARTING_FROM,
        startingPrice: 8000,
      },
      {
        name: 'Bed Bug Treatment',
        description: 'Treat bedrooms and furniture for bed bug infestations',
        pricingModel: PricingModel.QUOTE_REQUIRED,
      },
      {
        name: 'Rodent Control',
        description: 'Control rats and mice in residential properties',
        pricingModel: PricingModel.QUOTE_REQUIRED,
      },
      {
        name: 'Termite Treatment',
        description: 'Inspect and treat termite infestations',
        pricingModel: PricingModel.QUOTE_REQUIRED,
      },
    ],

    'Tiling & Flooring': [
      {
        name: 'Tile Installation',
        description: 'Install floor and wall tiles',
        pricingModel: PricingModel.QUOTE_REQUIRED,
      },
      {
        name: 'Tile Repair',
        description: 'Replace cracked or damaged tiles',
        pricingModel: PricingModel.STARTING_FROM,
        startingPrice: 5000,
      },
      {
        name: 'Tile Grouting',
        description: 'Repair and refresh tile grout',
        pricingModel: PricingModel.STARTING_FROM,
        startingPrice: 5000,
      },
      {
        name: 'Floor Installation',
        description: 'Install flooring materials in residential spaces',
        pricingModel: PricingModel.QUOTE_REQUIRED,
      },
    ],

    'General Handyman': [
      {
        name: 'Picture & Mirror Hanging',
        description: 'Safely mount pictures, mirrors, and wall decor',
        pricingModel: PricingModel.FIXED,
        startingPrice: 3000,
      },
      {
        name: 'TV Wall Mounting',
        description: 'Mount televisions securely on walls',
        pricingModel: PricingModel.STARTING_FROM,
        startingPrice: 5000,
      },
      {
        name: 'Curtain Rod Installation',
        description: 'Install curtain rods and brackets',
        pricingModel: PricingModel.FIXED,
        startingPrice: 3000,
      },
      {
        name: 'Furniture Moving',
        description: 'Move and reposition furniture within a property',
        pricingModel: PricingModel.HOURLY,
        startingPrice: 3000,
      },
      {
        name: 'General Home Repairs',
        description: 'Handle small household repair and maintenance tasks',
        pricingModel: PricingModel.HOURLY,
        startingPrice: 3000,
      },
    ],
  };

  for (const [categoryName, services] of Object.entries(servicesByCategory)) {
    const category = await categoryRepo.findOne({
      where: { name: categoryName },
    });

    if (!category) continue;

    for (const service of services) {
      const existing = await serviceRepo.findOne({
        where: {
          categoryId: category.id,
          name: service.name,
        },
      });

      if (!existing) {
        await serviceRepo.save(
          serviceRepo.create({
            ...service,
            categoryId: category.id,
            startingPrice: service.startingPrice ?? null,
          }),
        );
      }
    }
  }

  console.log('Services seeded');
}