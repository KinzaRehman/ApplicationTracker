const mongoose = require('mongoose')

module.exports = function(app, passport, db, ObjectId) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =changed 

app.get('/profile', isLoggedIn, async (req, res) => {
    try {
        const applications = await db.collection('applications')
            .find({ userId: req.user._id })
            .toArray()

        res.render('profile.ejs', {
            user: req.user,
            applications: applications
        })

    } catch (err) {
        console.log(err)
        res.status(500).send('Error loading applications')
    }
})



    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

// message board routes ===============================================================

    //replace savage auths messaging route with applications to get the forum input 
app.post('/applications', isLoggedIn, async (req, res) => {
     try {
        await db.collection('applications').insertOne({
            type: req.body.type,
            userId: req.user._id,
            company: req.body.company,
            position: req.body.position,
            status: req.body.status,
            dateApplied: req.body.dateApplied,
            jobLink: req.body.jobLink,
            notes: req.body.notes || ''
        })

        console.log('Application saved')
        res.redirect('/profile')

    } catch (err) {
        console.log(err)
        res.status(500).send('Error saving application')
    }
})



//put or updating rout for the tracker content 
//Update the put function so it allows user to update their forums...
//creating the update functionali
//using savage as a baseline 

    app.put('/messages', (req, res) => {
      db.collection('messages')
      .findOneAndUpdate({_id:new ObjectId(req.body.id)}, {
        $set: {
          thumbUp:(req.body.thumbUp ? req.body.thumbUp+1 : req.body.thumbDown-1)
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })



//replace savage auth with this to target our applications instead of the lines 


app.delete('/deleteapplication', isLoggedIn, async (req, res) => {
    try {
        const result = await db.collection('applications').findOneAndDelete({
            _id: new mongoose.Types.ObjectId(req.body.id),
            userId: new mongoose.Types.ObjectId(req.user._id.toString())
        })

        if (!result) {
            return res.status(404).send('Application not found')
        }

        console.log('deleted job')
        res.send('Job application deleted, its no longer being tracked!')

    } catch (err) {
        console.log(err)
        res.status(500).send('Error, check line 103-121')
    }
})



// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}


