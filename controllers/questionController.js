const axios = require('axios');
const Question = require('../models/Question');


exports.createQuestion = async (req, res) => {
  try {
    // Extract data from the request body
    const { name, body, masterjudgeId, typeId, interactive } = req.body;
    const problemData = {
      name,
      body,
      masterjudgeId,
      typeId,
      interactive
    };

    // Define access parameters
    const accessToken = '02f392029a3560f37f8a63346b8e3433';
    const endpoint = '80d5eddb.problems.sphere-engine.com';

    // Send request
    const response = await axios.post(`https://${endpoint}/api/v4/problems?access_token=${accessToken}`, problemData);

    if (response.status === 201) {
      const responseData = response.data;

      // Create and save new problem
      const newProblem = new Question({
        name,
        body,
        masterjudgeId,
        typeId,
        interactive,
        problemId: responseData.id
      });
      await newProblem.save();

      res.status(201).json(responseData);
    } else if (response.status === 401) {
      res.status(401).json({ error: 'Invalid access token' });
    } else if (response.status === 400) {
      const body = response.data;
      res.status(400).json({ error: `Error code: ${body.error_code}, details available in the message: ${body.message}` });
    } else {
      res.status(response.status).json({ error: 'An error occurred' });
    }
  } catch (error) {
    console.log('Error:', error.message);
    res.status(500).json({ error: 'An error occurred' });
  }
};


exports.editQuestion = async (req, res) => {
  try {
    // Define access parameters
    const accessToken = '02f392029a3560f37f8a63346b8e3433';
    const endpoint = '80d5eddb.problems.sphere-engine.com';

    // Define request parameters
    const { problemId } = req.params;
    const problemData = {
      name: req.body.name,
      body: req.body.body
    };
    // Send request
    const response = await axios.put(`https://${endpoint}/api/v4/problems/${problemId}?access_token=${accessToken}`, problemData);

    // Process response
    if (response.status === 200) {
      console.log('Problem updated');
      await Question.findOneAndUpdate({ problemId: problemId }, { name: problemData.name, body: problemData.body });
      res.status(200).json({ message: 'Problem updated' });
    } else if (response.status === 401) {
      console.log('Invalid access token');
      res.status(401).json({ error: 'Invalid access token' });
    } else if (response.status === 403) {
      console.log('Access denied');
      res.status(403).json({ error: 'Access denied' });
    } else if (response.status === 404) {
      console.log('Problem does not exist');
      res.status(404).json({ error: 'Problem does not exist' });
    } else if (response.status === 400) {
      const body = response.data;
      console.log(`Error code: ${body.error_code}, details available in the message: ${body.message}`);
      res.status(400).json({ error: `Error code: ${body.error_code}, details available in the message: ${body.message}` });
    }
  } catch (error) {
    console.log('Connection problem:', error.message);
    res.status(500).json({ error: 'Connection problem' });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    // Define access parameters
    const accessToken = '02f392029a3560f37f8a63346b8e3433';
    const endpoint = '80d5eddb.problems.sphere-engine.com';

    // Define request parameters
    const { problemId } = req.params;

    // Send request
    const response = await axios.delete(`https://${endpoint}/api/v4/problems/${problemId}?access_token=${accessToken}`);

    // Process response
    if (response.status === 200) {
      console.log('Problem deleted');
      await Question.findOneAndDelete({problemId: problemId});
      res.status(200).json({ message: 'Problem deleted' });
    } else if (response.status === 401) {
      console.log('Invalid access token');
      res.status(401).json({ error: 'Invalid access token' });
    } else if (response.status === 403) {
      console.log('Access denied');
      res.status(403).json({ error: 'Access denied' });
    } else if (response.status === 404) {
      console.log('Problem not found');
      res.status(404).json({ error: 'Problem not found' });
    }
  } catch (error) {
    console.log('Connection problem:', error.message);
    res.status(500).json({ error: 'Connection problem' });
  }
};

