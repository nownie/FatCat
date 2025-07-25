const fs = require('fs');
const { execSync } = require('child_process');

const filePath = './index.html';
// This regular expression looks for the placeholder OR "Last Updated:" followed by any characters.
const placeholderRegex = /(<!-- LAST_UPDATED -->|Last Updated: .*)/;

try {
    // Get the latest commit time
    //const gitCommitTime = execSync('git log -1 --format=%aI').toString().trim();
    //const gitCommitTime = new Date().toISOString().toString().trim();
    const formattedDate = new Date().toLocaleString();
    const newContent = `Last Updated: ${formattedDate}</div>`;

    // Read the file
    let fileContent = fs.readFileSync(filePath, 'utf8');

    // Replace the content using the regular expression
    if (placeholderRegex.test(fileContent)) {
        fileContent = fileContent.replace(placeholderRegex, newContent);
        fs.writeFileSync(filePath, fileContent, 'utf8');
        console.log(`Successfully updated timestamp in ${filePath}`);
    } else {
        console.warn('Could not find the placeholder or previous timestamp to update.');
    }

} catch (error) {
    console.error('Error updating timestamp:', error.message);
}
