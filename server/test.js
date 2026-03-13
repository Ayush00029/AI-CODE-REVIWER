fetch('http://localhost:5000/review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: 'print("hello")', language: 'python' })
})
    .then(r => r.json())
    .then(console.log)
    .catch(console.error);
