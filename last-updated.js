const fs = require('fs');
const { execSync } = require('child_process');

const filePath = './index.html';
const placeholder = '<!-- LAST_UPDATED -->';

try {
    const gitCommitTime = execSync('git log -1 --format=%aI').toString().trim();
    const formattedDate = new Date(gitCommitTime).toLocaleString();

    let fileContent = fs.readFileSync(filePath, 'utf8');
    fileContent = fileContent.replace(placeholder, `Last Updated: ${formattedDate}`);

    fs.writeFileSync(filePath, fileContent, 'utf8');

    console.log(`Successfully updated timestamp in ${filePath}`);
} catch (error) {
    console.error('Error updating timestamp:', error.message);
}