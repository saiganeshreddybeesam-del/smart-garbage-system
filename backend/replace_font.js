const fs = require('fs');
const path = require('path');
const u = path.join(__dirname, '../frontend/user.html');
const p = path.join(__dirname, '../frontend/private.html');

[u, p].forEach(file => {
    let c = fs.readFileSync(file, 'utf8');
    
    // Replace the Google Fonts link 
    c = c.replace(/href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]+"/g, 'href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"');
    
    // Replace explicit CSS declarations
    c = c.replace(/'DM Sans'/g, "'Inter'");
    c = c.replace(/'Syne'/g, "'Inter'");
    c = c.replace(/'DM Mono'/g, "'Space Mono'"); // if applicable
    
    fs.writeFileSync(file, c);
});

console.log('Typography updated successfully.');
