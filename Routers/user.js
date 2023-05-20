const express = require('express');
const app = express.Router();
const User = require('../Database/userModel');

function isValidUUID(id)
{
    const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    return regexExp.test(id)
}

app.get('/api/users', async (req, res) => {
    try {
        const userData = await User.find();
        return res.status(200).json(userData.map(({ id, username, hobbies }) => ({ id, username, hobbies })));
    }
    catch (err) {
        return res.status(500).json({ error: 'server error' });
    }
});

app.get('/api/users/:userid', async (req, res) => {
    try {
        const userid = req.params.userid;
        if (!userid || !isValidUUID(userid)) {
            return res.status(404).json({ error: 'userid is invalid' });
        }

        const userData = await User.find({ id: userid });
        if (userData.length === 0) {
            return res.status(404).json({ message: `user do not exist with userid = ${userid}` });
        }
        else {
            return res.status(200).json({ id: userData[0].id, username: userData[0].username, hobbies: userData[0].hobbies });
        }
    }
    catch (err) {
        return res.status(500).json({ error: 'server error' });
    }
});


app.post('/api/users', async (req, res) => {
    try {
        if (!req.body.username || req.body.username === "" || !req.body.age) {
            return res.status(404).json({ error: 'username and age is required' });
        }
        else if (isNaN(req.body.age) || req.body.age <= 0) {
            return res.status(404).json({ error: 'age should be a positive number' });
        }
        else if (req.body.hobbies && Array.isArray(req.body.hobbies) == false) {
            return res.status(404).json({ error: 'hobbies should be an array' });
        }
        else {
            const newuser = new User({
                username: req.body.username,
                age: req.body.age,
                hobbies: (req.body.hobbies ? req.body.hobbies : [])
            });
            const result = await newuser.save();
            res.status(201).json({ id: result.id, username: result.username, hobbies: result.hobbies });
        }
    }
    catch (err) {
        return res.status(500).json({ error: 'server error' });
    }
});

app.put('/api/users/:userid', async (req, res) => {
    try {
        const userid = req.params.userid;
        if (!userid || !isValidUUID(userid)) {
            return res.status(404).json({ error: 'userid is invalid' });
        }
        if (!req.body.username || req.body.username === "" || !req.body.age) {
            return res.status(404).json({ error: 'username and age is required' });
        }
        else if (isNaN(req.body.age) || req.body.age <= 0) {
            return res.status(404).json({ error: 'age should be a positive number' });
        }
        else if (req.body.hobbies && Array.isArray(req.body.hobbies) == false) {
            return res.status(404).json({ error: 'hobbies should be an array' });
        }
        else {
            const result = await User.findOneAndUpdate({ id: userid }, {
                username: req.body.username,
                age: req.body.age,
                hobbies: (req.body.hobbies ? req.body.hobbies : [])
            }, {
                new: true
            });
            if (!result) {
                return res.status(404).json({ message: `user do not exist with userid = ${userid}` });
            }
            else {
                return res.status(200).json({ id: result.id, username: result.username, age: result.age, hobbies: result.hobbies });
            }
        }
    }
    catch (err) {
        return res.status(500).json({ error: 'server error' });
    }
});


app.delete('/api/users/:userid', async (req, res) => {
    try {
        const userid = req.params.userid;
        if (!userid || !isValidUUID(userid)) {
            return res.status(404).json({ error: 'userid is invalid' });
        }
        const result = await User.findOneAndRemove({ id: userid });
        console.log(result);
        if (result === null) {
            return res.status(404).json({message: `user do not exist with userid = ${userid}`});
        }
        else {
            return res.status(200).json({ message: 'sucessfully deleted'});
        }
    }
    catch (err) {
        return res.status(500).json({ error: 'server error' });
    }
});

module.exports = app;