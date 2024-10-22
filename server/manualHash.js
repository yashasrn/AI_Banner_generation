const bcrypt = require('bcryptjs');

const password = 'a123'; // The password you used for signup
const storedHash = '$2a$10$rh2LFoOnLVahYbfmwSld/.WFlvUdrpmly1OYFzyqJLY/QzAisX43G'; // The stored hash from the database

// Hash the password
bcrypt.compare(password, storedHash, (err, isMatch) => {
    if (err) {
        console.error('Error comparing passwords:', err);
        return;
    }
    console.log('Password Match (Manual Test):', isMatch); // Should return true if the hashes match
});
