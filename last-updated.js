const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const scriptPath = path.join(__dirname, 'script.js');

try {
    // Get the last commit date from Git
    const gitCommitTime = execSync(`git log -1 --format="%aI" -- ${scriptPath}`).toString().trim(); // Using %aI for ISO 8601 format

    // Read the content of script.js
    let scriptContent = fs.readFileSync(scriptPath, 'utf8');

    // Replace the placeholder with the actual Git commit time
    // Ensure the placeholder in script.js matches this regex
    const oldString = /const gitCommitTime = ".*";/;
    const newString = `const gitCommitTime = "${gitCommitTime}";`;

    if (scriptContent.match(oldString)) {
        scriptContent = scriptContent.replace(oldString, newString);
        fs.writeFileSync(scriptPath, scriptContent, 'utf8');
        console.log(`Successfully updated script.js with Git commit time: ${gitCommitTime}`);
    } else {
        console.warn('Placeholder for gitCommitTime not found in script.js. Please ensure it exists as: const gitCommitTime = "PLACEHOLDER";');
    }

} catch (error) {
    console.error('Error updating Git commit time:', error.message);
    console.error('Please ensure Git is installed and accessible, and you are in a Git repository.');
}
