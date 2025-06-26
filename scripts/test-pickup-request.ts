async function testPickupRequest() {
  try {
    console.log('Testing pickup request creation...');
    
    // First login to get user data
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'huxley.scott@example.com',
        password: 'whoareyoupotter'
      })
    });
    
    const loginData = await loginResponse.json();
    
    if (!loginResponse.ok) {
      console.log('❌ Login failed:', loginData.message);
      return;
    }
    
    console.log('✅ Login successful');
    const user = loginData.user;
    
    // Now test pickup request creation
    const pickupData = {
      residentId: user.id,
      location: "123 Test Street, Nairobi, Kenya",
      latitude: "-1.2921",
      longitude: "36.8219",
      wasteTypes: ["organic", "plastic"],
      estimatedWeight: "5.5",
      scheduledTime: new Date().toISOString(),
      notes: "Test pickup request"
    };
    
    console.log('Creating pickup request with data:', pickupData);
    
    const pickupResponse = await fetch('http://localhost:3001/api/pickup-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pickupData)
    });
    
    const pickupResult = await pickupResponse.json();
    
    if (pickupResponse.ok) {
      console.log('✅ Pickup request created successfully!');
      console.log('Pickup request:', {
        id: pickupResult.id,
        location: pickupResult.location,
        wasteTypes: pickupResult.wasteTypes,
        estimatedWeight: pickupResult.estimatedWeight,
        status: pickupResult.status
      });
    } else {
      console.log('❌ Pickup request failed:', pickupResult.message);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testPickupRequest();