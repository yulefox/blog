const express = require('express');
const bodyParser = require('body-parser');
const simpleGit = require('simple-git');

const app = express();
app.use(bodyParser.json());

const REPO_DIR = '/app';
const BRANCH_NAME = 'main'; // or your specific branch

app.post('/', (req, res) => {
  const payload = req.body;

  if (payload.ref === `refs/heads/${BRANCH_NAME}`) {
    console.log(`Received push on ${BRANCH_NAME}, starting deployment...`);

    const git = simpleGit(REPO_DIR);

    git.pull('origin', BRANCH_NAME, (err, update) => {
      if (err) {
        console.error('Failed to pull repository:', err);
        return res.status(500).send('Deployment failed');
      }

      if (update && update.summary.changes) {
        console.log('Repository updated, building...');

        // Run your build commands here
        const exec = require('child_process').exec;
        exec('yarn docs:build', { cwd: REPO_DIR }, (err, stdout, stderr) => {
          if (err) {
            console.error('Build failed:', stderr);
            return res.status(500).send('Build failed');
          }

          console.log('Build success:', stdout);
          res.send('Deployed successfully');
        });
      } else {
        console.log('No changes in repository');
        res.send('No changes');
      }
    });
  }
});

app.listen(3030, () => {
  console.log('Webhook listener running on port 3030');
});
