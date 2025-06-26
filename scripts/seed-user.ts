import { AuthService } from '../server/auth';

async function seedUser() {
  try {
    console.log('Creating Huxley Scott user profile...');
    
    const user = await AuthService.registerUser({
      email: 'huxley.scott@example.com',
      password: 'whoareyoupotter',
      fullName: 'Huxley Scott',
      phone: '+254712345678',
      location: 'Nairobi, Kenya',
      role: 'resident'
    });
    
    console.log('✅ User created successfully:', {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    });
    
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      console.log('ℹ️  User already exists in database');
    } else {
      console.error('❌ Error creating user:', error);
    }
  }
}

seedUser();