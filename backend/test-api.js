const testMessage = "Hello Ora!";

fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: testMessage })
})
.then(response => response.json())
.then(data => {
    console.log('✅ SUCCESS! Ora responded:');
    console.log(data.reply);
    console.log('\nTimestamp:', data.timestamp);
})
.catch(error => {
    console.error('❌ ERROR:', error.message);
});
