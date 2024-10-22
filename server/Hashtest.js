const bcrypt = require('bcryptjs');

// Password you're testing
const testPassword = 'pd123'; 
// Copy the stored hash from your MongoDB logs here
const storedHash = '$2a$10$p96qDxujl38piGpdWmj83uB19r2jqRulX7rV3qGvW5.rLEmZ5MrN.'; 

// Log the test password and hash for debugging
console.log('Test Password:', testPassword);
console.log('Stored Hash:', storedHash);

// Compare the password with the stored hash
bcrypt.compare(testPassword, storedHash)
  .then(isMatch => {
    console.log('Password Match (Manual Test):', isMatch); // Should print true if matched
  })
  .catch(err => {
    console.error('Error during comparison:', err);
  });
