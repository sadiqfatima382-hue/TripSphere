import prisma from "../../src/config/prisma.js";

const serviceCategories = [
  {
    name: "Car Rides",
    slug: "car-rides",
    description: "Book private and shared car rides.",
    icon: "car",
  },
  {
    name: "Taxis",
    slug: "taxis",
    description: "Book taxi services for local and long-distance travel.",
    icon: "taxi",
  },
  {
    name: "Car Rentals",
    slug: "car-rentals",
    description: "Rent cars for short-term and long-term use.",
    icon: "car-rental",
  },
  {
    name: "Buses",
    slug: "buses",
    description: "Book intercity and local bus transportation.",
    icon: "bus",
  },
  {
    name: "Trains",
    slug: "trains",
    description: "Book train journeys and railway services.",
    icon: "train",
  },
  {
    name: "Flights",
    slug: "flights",
    description: "Search and book domestic and international flights.",
    icon: "plane",
  },
  {
    name: "Hotels",
    slug: "hotels",
    description: "Book hotels and accommodation.",
    icon: "hotel",
  },
  {
    name: "Apartments & Vacation Rentals",
    slug: "apartments-vacation-rentals",
    description: "Book apartments, homes, and vacation rentals.",
    icon: "apartment",
  },
  {
    name: "Airport Transfers",
    slug: "airport-transfers",
    description: "Book transportation to and from airports.",
    icon: "airport",
  },
  {
    name: "Boats & Ferries",
    slug: "boats-ferries",
    description: "Book boat and ferry transportation.",
    icon: "boat",
  },
  {
    name: "Tours & Activities",
    slug: "tours-activities",
    description: "Discover and book tours, excursions, and activities.",
    icon: "tour",
  },
  {
    name: "Events & Attractions",
    slug: "events-attractions",
    description: "Book tickets for events, attractions, and experiences.",
    icon: "event",
  },
  {
    name: "Chauffeur Services",
    slug: "chauffeur-services",
    description: "Book professional chauffeur and private driver services.",
    icon: "chauffeur",
  },
  {
    name: "Bike & Scooter Rentals",
    slug: "bike-scooter-rentals",
    description: "Rent bicycles, scooters, and other personal mobility vehicles.",
    icon: "bike",
  },
  {
    name: "Rickshaws",
    slug: "rickshaws",
    description: "Book rickshaw and local three-wheeler transportation.",
    icon: "rickshaw",
  },
];

export async function seedServiceCategories() {
  console.log("Seeding service categories...");

  for (const category of serviceCategories) {
    await prisma.serviceCategory.upsert({
      where: {
        slug: category.slug,
      },
      update: {
        name: category.name,
        description: category.description,
        icon: category.icon,
        isActive: true,
      },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        isActive: true,
      },
    });
  }

  console.log(
    `Service categories seeded successfully: ${serviceCategories.length}`
  );
}