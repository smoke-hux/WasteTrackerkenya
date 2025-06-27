import { AuthService } from "../server/auth";

async function createAdmin() {
  try {
    const admin = await AuthService.registerUser({
      email: "admin@wastetracker.com",
      password: "admin123",
      fullName: "System Administrator",
      phone: "+254700000000",
      location: "Nairobi, Kenya",
      role: "admin"
    });
    
    console.log("Admin user created successfully:");
    console.log(`Email: ${admin.email}`);
    console.log(`Name: ${admin.fullName}`);
    console.log(`Role: ${admin.role}`);
    console.log("\nYou can now log in with:");
    console.log("Email: admin@wastetracker.com");
    console.log("Password: admin123");
  } catch (error) {
    console.error("Failed to create admin user:", error);
  }
}

createAdmin();