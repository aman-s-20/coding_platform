const axios = require('axios');

exports.createTestCase = async (req, res) => {
    try {
        // Define access parameters
        const accessToken = '02f392029a3560f37f8a63346b8e3433';
        const endpoint = '80d5eddb.problems.sphere-engine.com';


        // Extract data from the request body
        const { problemId } = req.params;
        const {  input, output, judgeId, timeLimit } = req.body;
        const testcaseData = {
            input,
            output,
            judgeId,
            timeLimit,
        }

        // Send request
        axios.post(`https://${endpoint}/api/v4/problems/${problemId}/testcases?access_token=${accessToken}`, testcaseData)
            .then(response => {
                if (response.status === 201) {
                    const responseData = response.data;
                    res.status(201).json(responseData); // Send the response data to the client
                } else if (response.status === 401) {
                    res.status(401).json({ error: 'Invalid access token' });
                } else if (response.status === 403) {
                    res.status(403).json({ error: 'Access denied' });
                } else if (response.status === 404) {
                    res.status(404).json({ error: 'Problem does not exist' });
                } else if (response.status === 400) {
                    const body = response.data;

                    res.status(400).json({ error: `Error code: ${body.error_code}, details available in the message: ${body.message}` });
                } else {
                    res.status(response.status).json({ error: 'An error occurred' });
                }
            })
            .catch(error => {
                console.log('Connection problem:', error.message);
                res.status(500).json({ error: 'Connection problem' });
            })

    } catch (error) {
        console.log('Connection problem:', error.message);
        res.status(500).json({ error: 'Connection problem' });
    }
};
