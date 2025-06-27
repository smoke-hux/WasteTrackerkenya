import { db } from "../server/db";
import { environmentalInfoLibrary, InfoCategory, InfoDifficulty } from "../shared/schema";

const environmentalInfoData = [
  // Beginner Level (Level 1-2)
  {
    category: InfoCategory.RECYCLING,
    title: "The Basics of Recycling in Kenya",
    content: "Kenya produces over 22,000 tons of waste daily, with only 8% being recycled. Recycling one plastic bottle saves enough energy to power a light bulb for 3 hours. In Nairobi alone, proper recycling could reduce waste by 60% and create thousands of jobs.",
    difficulty: InfoDifficulty.BEGINNER,
    unlockLevel: 1,
    imageUrl: "/images/recycling-basics.jpg",
    sources: ["Kenya National Bureau of Statistics", "UNEP Kenya Report 2023"],
  },
  {
    category: InfoCategory.CLIMATE,
    title: "How Waste Affects Kenya's Climate",
    content: "Landfills produce methane, a greenhouse gas 25 times more potent than CO2. Kenya's main landfill, Dandora, releases 8,000 tons of CO2 equivalent annually. By recycling organic waste through composting, we can reduce these emissions by 50%.",
    difficulty: InfoDifficulty.BEGINNER,
    unlockLevel: 1,
    imageUrl: "/images/climate-waste.jpg",
    sources: ["Kenya Climate Change Report 2022", "Dandora Environmental Impact Study"],
  },
  {
    category: InfoCategory.POLLUTION,
    title: "Plastic Pollution in the Indian Ocean",
    content: "Every minute, Kenya contributes to the 8 million tons of plastic entering our oceans annually. Plastic waste from Kenyan rivers like Nairobi River flows into the Indian Ocean, affecting marine life. Sea turtles mistake plastic bags for jellyfish, leading to fatal consequences.",
    difficulty: InfoDifficulty.BEGINNER,
    unlockLevel: 2,
    imageUrl: "/images/ocean-plastic.jpg",
    sources: ["Kenya Marine & Fisheries Research Institute", "Indian Ocean Commission Report"],
  },
  {
    category: InfoCategory.WILDLIFE,
    title: "Protecting Kenya's Wildlife Through Waste Management",
    content: "Improper waste disposal threatens Kenya's iconic wildlife. Elephants in Tsavo have been found with plastic in their stomachs. Lions in Nairobi National Park are affected by water contamination from nearby waste sites. Proper waste management protects over 40 national parks.",
    difficulty: InfoDifficulty.BEGINNER,
    unlockLevel: 2,
    imageUrl: "/images/wildlife-protection.jpg",
    sources: ["Kenya Wildlife Service", "Wildlife Conservation Society Kenya"],
  },

  // Intermediate Level (Level 3-4)
  {
    category: InfoCategory.RECYCLING,
    title: "Advanced Recycling: E-Waste and Precious Metals",
    content: "Kenya generates 50,000 tons of e-waste annually. One smartphone contains gold, silver, copper, and rare earth elements worth $2. Proper e-waste recycling can recover 95% of these materials. The Weee Centre in Nairobi processes 2,000 tons yearly, creating green jobs and reducing mining demand.",
    difficulty: InfoDifficulty.INTERMEDIATE,
    unlockLevel: 3,
    imageUrl: "/images/e-waste-recycling.jpg",
    sources: ["Kenya Association of Manufacturers", "Weee Centre Kenya"],
  },
  {
    category: InfoCategory.CONSERVATION,
    title: "Circular Economy: Kenya's Green Revolution",
    content: "A circular economy could add KSh 3.5 trillion to Kenya's GDP by 2030. Companies like Eco-Post Kenya turn plastic waste into fence posts, preventing 500 tons of plastic from reaching landfills monthly. Bio-gas from organic waste powers 10,000 households in rural Kenya.",
    difficulty: InfoDifficulty.INTERMEDIATE,
    unlockLevel: 3,
    imageUrl: "/images/circular-economy.jpg",
    sources: ["Kenya Circular Economy Network", "Vision 2030 Progress Report"],
  },
  {
    category: InfoCategory.CLIMATE,
    title: "Carbon Sequestration Through Waste-to-Energy",
    content: "Kenya's waste-to-energy potential could generate 50MW of electricity while reducing emissions by 2 million tons CO2 annually. Biogas from organic waste is carbon-neutral and provides clean cooking fuel for 2 million households, reducing deforestation pressure.",
    difficulty: InfoDifficulty.INTERMEDIATE,
    unlockLevel: 4,
    imageUrl: "/images/waste-to-energy.jpg",
    sources: ["Kenya Electricity Generating Company", "Ministry of Energy Kenya"],
  },
  {
    category: InfoCategory.POLLUTION,
    title: "Microplastics: The Hidden Threat in Kenya",
    content: "Lake Victoria contains 83% microplastic contamination, affecting fish that feed 30 million people. Microplastics enter the food chain through tilapia and other fish. Single-use plastics break down into particles smaller than 5mm, persisting for centuries in water bodies.",
    difficulty: InfoDifficulty.INTERMEDIATE,
    unlockLevel: 4,
    imageUrl: "/images/microplastics.jpg",
    sources: ["Lake Victoria Basin Research", "Kenya Marine Research Institute"],
  },

  // Advanced Level (Level 5+)
  {
    category: InfoCategory.CLIMATE,
    title: "Kenya's Role in Global Climate Action",
    content: "Kenya's waste sector accounts for 8% of national greenhouse gas emissions. By achieving 100% waste recycling, Kenya could reduce emissions by 12 million tons CO2 annually - equivalent to removing 3 million cars from roads. This positions Kenya as a climate leader in Africa.",
    difficulty: InfoDifficulty.ADVANCED,
    unlockLevel: 5,
    imageUrl: "/images/climate-leadership.jpg",
    sources: ["Kenya Climate Change Action Plan", "UNFCCC Kenya NDC Report"],
  },
  {
    category: InfoCategory.CONSERVATION,
    title: "Ecosystem Services: The Economic Value of Clean Environment",
    content: "Kenya's ecosystems provide services worth KSh 7.6 trillion annually - 70% of GDP. Proper waste management preserves watersheds providing water to 50 million people. Coastal cleanup prevents tourism losses of KSh 400 billion, supporting 2 million jobs.",
    difficulty: InfoDifficulty.ADVANCED,
    unlockLevel: 5,
    imageUrl: "/images/ecosystem-services.jpg",
    sources: ["Kenya Natural Capital Accounting", "Tourism Research Institute"],
  },
  {
    category: InfoCategory.WILDLIFE,
    title: "Biodiversity Hotspots: Protecting Kenya's Unique Species",
    content: "Kenya hosts 5% of global biodiversity on 0.4% of Earth's surface. Waste pollution threatens 359 endemic species found nowhere else. The Eastern Arc Mountains harbor species that could provide medical breakthroughs, but plastic pollution threatens their habitat.",
    difficulty: InfoDifficulty.ADVANCED,
    unlockLevel: 6,
    imageUrl: "/images/biodiversity-hotspots.jpg",
    sources: ["Kenya Biodiversity Strategy", "World Wildlife Fund Kenya"],
  },
  {
    category: InfoCategory.RECYCLING,
    title: "Nanotechnology in Waste Management",
    content: "Kenyan researchers are developing nano-catalysts that can break down plastic waste into fuel in 2 hours instead of 450 years. This technology could process 1 million tons of plastic waste annually, creating 50,000 liters of fuel daily while cleaning the environment.",
    difficulty: InfoDifficulty.ADVANCED,
    unlockLevel: 6,
    imageUrl: "/images/nanotechnology.jpg",
    sources: ["University of Nairobi Research", "Kenya Innovation Agency"],
  },
];

async function seedEnvironmentalData() {
  try {
    console.log("Seeding environmental information data...");
    
    // Clear existing data
    await db.delete(environmentalInfoLibrary);
    
    // Insert new data
    for (const info of environmentalInfoData) {
      await db.insert(environmentalInfoLibrary).values(info);
    }
    
    console.log(`Successfully seeded ${environmentalInfoData.length} environmental information entries`);
  } catch (error) {
    console.error("Error seeding environmental data:", error);
    process.exit(1);
  }
}

// Run the seeding function
if (require.main === module) {
  seedEnvironmentalData()
    .then(() => {
      console.log("Environmental data seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}

export { seedEnvironmentalData };