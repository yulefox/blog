const express = require('express');
const bodyParser = require('body-parser');
const simpleGit = require('simple-git');

const app = express();
app.use(bodyParser.json());

const REPO_DIR = '/app';
const BRANCH_NAME = 'main'; // or your specific branch

function log_info(message) {
  const timestamp = new Date().toISOString(); // 获取 ISO 格式的时间戳
  console.log(`[${timestamp}] ${message}`);
}

function log_error(message) {
  const timestamp = new Date().toISOString(); // 获取 ISO 格式的时间戳
  console.error(`[${timestamp}] ${message}`);
}

app.post('/', (req, res) => {
  const payload = req.body;

  if (payload.ref === `refs/heads/${BRANCH_NAME}`) {
    log_info(`Received push on ${BRANCH_NAME}, starting deployment...`);

    const git = simpleGit(REPO_DIR);

    git.pull('origin', BRANCH_NAME, (err, update) => {
      if (err) {
        log_error('Failed to pull repository:', err);
        return res.status(500).send('Deployment failed');
      }

      if (update && update.summary.changes) {
        log_info('Repository updated, building...');

        // Run your build commands here
        const exec = require('child_process').exec;
        exec('yarn docs:build', { cwd: REPO_DIR }, (err, stdout, stderr) => {
          if (err) {
            log_error('Build failed:', stderr);
            return res.status(500).send('Build failed');
          }

          log_info('Build success:', stdout);
          res.send('Deployed successfully');
        });
      } else {
        log_info('No changes in repository');
        res.send('No changes');
      }
    });
  }
});

app.listen(3030, () => {
  log_info('Webhook listener running on port 3030');
});
