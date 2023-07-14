const { request } = require('express');
const Question = require('../models/Question');
const sphereEngineAPI = require('../services/sphereEngineAPI');
const axios = require('axios');

exports.submitSolution = async (req, res) => {
  try {
    // Define access parameters
    const accessToken = '02f392029a3560f37f8a63346b8e3433';
    const endpoint = '80d5eddb.problems.sphere-engine.com';
    const { problemId } = req.params;
    const { compilerId, source } = req.body;
    // Define request parameters
    const submissionData = {
      problemId: problemId,
      compilerId: compilerId,
      source: source
    };

    // Send request
    const response = await axios.post(`https://${endpoint}/api/v4/submissions?access_token=${accessToken}`, submissionData);

    // Process response
    if (response.status === 201) {
      const submissionId = response.data.id;
      const submissionUrl = `https://${endpoint}/api/v4/submissions/${submissionId}?access_token=${accessToken}`;

      // Poll for submission status
      const checkSubmissionStatus = async () => {
        try {
          const statusResponse = await axios.get(submissionUrl);

          if (statusResponse.status === 200) {
            // console.log(statusResponse);
            const submissionStatus = statusResponse.data;

            if (submissionStatus.executing) {
              // Submission is still executing, wait for 1 second and check again
              setTimeout(checkSubmissionStatus, 1000);
            } else {
              // Submission has finished executing, send the response
              res.status(200).json(submissionStatus);
            }
          } else {
            // Error occurred while checking submission status
            res.status(500).json({ error: 'Failed to check submission status' });
          }
        } catch (error) {
          // Error occurred while checking submission status
          console.log('Connection problem:', error.message);
          res.status(500).json({ error: 'Failed to check submission status' });
        }
      };

      // Start checking submission status
      checkSubmissionStatus();
    } else {
      if (response.status === 401) {
        console.log('Invalid access token');
        res.status(401).json({ error: 'Invalid access token' });
      } else if (response.status === 402) {
        console.log('Unable to create submission');
        res.status(402).json({ error: 'Unable to create submission' });
      } else if (response.status === 400) {
        const body = response.data;
        console.log(`Error code: ${body.error_code}, details available in the message: ${body.message}`);
        res.status(400).json({ error: `Error code: ${body.error_code}, details available in the message: ${body.message}` });
      } else {
        res.status(response.status).json({ error: 'An error occurred' });
      }
    }
  } catch (error) {
    console.log('Connection problem:', error.message);
    res.status(500).json({ error: 'Connection problem' });
  }
};
