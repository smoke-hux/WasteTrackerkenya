async function testLogin() {
  try {
    console.log('Testing login with Huxley Scott credentials...');
    
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'huxley.scott@example.com',
        password: 'whoareyoupotter'
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('User data:', {
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.fullName,
        role: data.user.role
      });
    } else {
      console.log('❌ Login failed:', data.message);
    }
    
  } catch (error) {
    console.error('❌ Login test error:', error);
  }
}

testLogin();