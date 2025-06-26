import { insertPickupRequestSchema } from '@shared/schema';

async function debugPickup() {
  const pickupData = {
    residentId: 2,
    location: "123 Test Street, Nairobi, Kenya",
    latitude: "-1.2921",
    longitude: "36.8219",
    wasteTypes: ["organic", "plastic"],
    estimatedWeight: "5.5",
    scheduledTime: new Date(),
    notes: "Test pickup request"
  };
  
  try {
    console.log('Testing schema validation...');
    const result = insertPickupRequestSchema.parse(pickupData);
    console.log('✅ Schema validation passed:', result);
  } catch (error) {
    console.error('❌ Schema validation failed:', error);
  }
}

debugPickup();