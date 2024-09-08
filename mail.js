// const express = require('express');
// const bodyParser = require('body-parser');
// const path = require('path');
// const https = require('https');

// const app = express();

// // Set up middleware to parse JSON data
// app.use(bodyParser.json());

// // Serve static files (but not HTML files directly)
// app.use('/css', express.static(path.join(__dirname,  'css')));
// app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
// app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// // Serve indexa.html on the root route
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname,  'indexa.html'));
// });

// app.post('/', (req, res) => {
//     const firstName = req.body.firstName
//     const lastName = req.body.lastName;
//     const email = req.body.email;
//     console.log(firstName, lastName, email);
//     const apikey ="b87fa839c08fe303d1a52313f14e25b2-us13";
//     const listId = "11c4c56ce4"; 
//     const url ="https://us13.api.mailchimp.com/3.0/lists/11c4c56ce4";
//     const options = 
//     {
//         method: "POST",
//         auth: "pdk:b87fa839c08fe303d1a52313f14e25b2-us13"
//     }
//     const data = {
//         members: [
//             {
//                 email_address: email,
//                 status: "subscribed",
//                 merge_fields: {
//                     FNAME: firstName,
//                     LNAME: lastName
//                 }
//             }
//         ]
//     }
//     const jsonData = JSON.stringify(data);
    
//     const request = https.request(url, options, (response) => {
//         response.on("data", (data) => {
//             console.log(JSON.parse(data));
//         })
//         response.on("end", () => {
//             if (response.statusCode === 200) {
//                 // Successful response from Mailchimp
//                 res.json({ message: 'Subscription successful', firstName, lastName });
//             } else {
//                 // Failed response from Mailchimp
//                 res.status(response.statusCode).json({ message: 'Subscription failed' });
//             }
//         });
//     })
//     request.write(jsonData);
//     request.end();
//     console.log(firstName,lastName,email);
// });

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });



const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname)));

// Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'indexa.html'));
});

app.post('/', (req, res) => {
    const { firstName, lastName, email } = req.body;

    if (!firstName || !lastName || !email) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const apiKey = 'b87fa839c08fe303d1a52313f14e25b2-us13';
    const listId = '11c4c56ce4';
    const url = `https://us13.api.mailchimp.com/3.0/lists/${listId}`;
    
    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ],
        update_existing: true
    };
    
    const jsonData = JSON.stringify(data);
    
    const options = {
        method: 'POST',
        auth: `anystring:${apiKey}`
    };

    const request = https.request(url, options, (response) => {
        if (response.statusCode === 200) {
            res.json({ message: 'Subscription successful!' });
        } else {
            res.status(response.statusCode).json({ message: 'Subscription failed. Please try again.' });
        }
    });

    request.on('error', (error) => {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    });

    request.write(jsonData);
    request.end();
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

