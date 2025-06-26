import { AuthService } from '../server/auth';

async function debugLogin() {
  try {
    console.log('Testing AuthService directly...');
    
    // Test if user exists
    const user = await AuthService.getUserById(2);
    console.log('User found:', user);
    
    // Test login
    const loginResult = await AuthService.loginUser({
      email: 'huxley.scott@example.com',
      password: 'whoareyoupotter'
    });
    
    console.log('✅ Login successful:', loginResult);
    
  } catch (error) {
    console.error('❌ Login error:', error);
  }
}

debugLogin();