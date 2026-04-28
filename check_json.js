const fs = require('fs');
const data = JSON.parse(fs.readFileSync('/migrated_prompt_history/prompt_2026-01-18T11:35:30.041Z.json', 'utf8'));
const file = data[0].payload.files[0];
const parsed = JSON.parse(file);
console.log("MimeType:", parsed.type);
console.log("Base64 length:", parsed.data.length);
fs.writeFileSync('test.pdf', Buffer.from(parsed.data, 'base64'));
console.log("test.pdf created!");
