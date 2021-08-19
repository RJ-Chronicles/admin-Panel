const express= require('express');
const app = express();

const {pool} = require('./dbConfig')
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const body_parser = require('body-parser');
const path = require('path');
const multer = require('multer')
const initializePassport = require("./passportConfig");
//const query_data = require('./query_data');


app.use(express.static(path.join(__dirname, 'public')))
initializePassport(passport);

const PORT =    process.env.PORT || 4000;

app.set("view engine","ejs");
app.use(express.urlencoded({extended:false}));

app.use(
    session({
        secret : 'secret',

        resave : false,

        saveUninitialized : false
    })
);
app.use(passport.initialize());
app.use(passport.session())
app.use(flash())


app.get('/',(req,res) => {
    res.render('index')
});

app.get("/users/register",checkAuthenticated, (req, res) => {
    res.render("register");
});

app.get("/users/login", checkAuthenticated, (req, res) => {
    res.render("login");
});




app.get("/users/dashboard", checkNotAuthenticated,  (req, res) => {
        pool.query(
            `select vendor_id ,name, service_name, service_description, profile_image from vendor where status ='pending'`,
            (err,results) =>{
                if(err)
                    throw err;
                if(results.rows.length> 0){
                    const mydata = results.rows; 
                    console.log(mydata); 
                    res.render("dashboard",{ user : req.user.username,page : mydata});   
                }else{
                    res.render("dashboard",{ user : req.user.username});  
                }
            }
        );

});

app.get("/users/logout", (req, res) =>{
    req.logOut();
    req.flash('success_msg', " You have logged out");
    res.redirect('/users/login');
});


//------------------------------------------Dashboard Operations-----------------------
app.get("/users/dashboard/details/:value",checkNotAuthenticated,(req, res,next) =>{
    console.log("parameter is : " + req.params.value);
    
    const vid=req.params.value;
    pool.query(
        `select v.vendor_id, v.name, v.mobile, v.service_name, v.service_description, v.profile_image,
        v.creation_date, v.opening_time, v.closing_time, a.address_1, a.address_2, a.pincode,
        a.city, a.state,v.status from vendor v inner join vendor_address a on v.address_id = a.vendor_add_id where v.vendor_id =$1`,[vid],
        (err, results) =>{
            if(err)
             throw err;
             if(results.rows.length > 0){
                 console.log(results.rows)
                 const data = results.rows[0];
 
                 res.render('details',{data : data})
             }
             
        }
    )
})



 app.get("/users/dashboard/pending",checkNotAuthenticated, (req, res) =>{
    pool.query(
        `select vendor_id ,name, service_name, service_description, profile_image from vendor where status ='pending'`,
        (err,results) =>{
            if(err)
                throw err;
            if(results.rows.length> 0){
                const mydata = results.rows; 
                console.log(mydata); 
                res.render("dashboard",{ user : req.user.username,page : mydata});   
            }else{
                res.render("dashboard",{ user : req.user.username});  
            }
        }
    );
    // res.render('pending');
 })
 app.get("/users/dashboard/approved",checkNotAuthenticated, (req, res) =>{
    pool.query(
        `select vendor_id ,name, service_name, service_description, profile_image from vendor where status ='Approved'`,
        (err,results) =>{
            if(err)
                throw err;
            if(results.rows.length> 0){
                const mydata = results.rows; 
                console.log(mydata); 
                res.render("dashboard",{ user : req.user.username,page : mydata});   
            }else{
                res.render("dashboard",{ user : req.user.username});  
            }
        }
    );

})

app.get("/users/dashboard/reject",checkNotAuthenticated, (req, res) =>{
    pool.query(
        `select vendor_id ,name, service_name, service_description, profile_image from vendor where status ='Rejected'`,
        (err,results) =>{
            if(err)
                throw err;
            if(results.rows.length> 0){
                const mydata = results.rows; 
                console.log(mydata); 
                res.render("dashboard",{ user : req.user.username,page : mydata});   
            }else{
                const mydata = results.rows; 
                res.render("dashboard",{ user : req.user.username, page: mydata});  
            }
        }
    );
   // res.render('reject');
})

app.get("/users/dashboard/Sent_Back",checkNotAuthenticated, (req, res) =>{
    pool.query(
        `select vendor_id ,name, service_name, service_description, profile_image from vendor where status ='Sent Back'`,
        (err,results) =>{
            if(err)
                throw err;
            if(results.rows.length> 0){
                const mydata = results.rows; 
                console.log(mydata); 
                res.render("dashboard",{ user : req.user.username,page : mydata});   
            }else{
                const mydata = results.rows;
                res.render("dashboard",{ user : req.user.username, page: mydata});  
            }
        }
    );
})

app.get("/users/dashboard/pendingImage",checkNotAuthenticated,(req,res) =>{
    res.render('pending');
})

//-----------------------------------------------------Button Operation like Approved reject, pending etc---------------
app.get("/users/dashboard/status/approve/:id", (req, res) =>{
    console.log("Requested id : " ,req.params.id);
    const vid =req.params.id; 
    pool.query(
        `update vendor set status = 'Approved' where vendor_id = $1`,[vid],
        (err,results) =>{
            if(err)
                throw err;
            if(results.rows.length> 0){
                console.log("record updated suceesfully");
                res.redirect("/users/dashboard/approved");
            }
               
        }

    )


})
app.get("/users/dashboard/status/reject/:id", (req, res) =>{
    console.log("Requested id : " ,req.params.id);
    const vid =req.params.id; 
    pool.query(
        `update vendor set status = 'Rejected' where vendor_id = $1`,[vid],
        (err,results) =>{
            if(err)
                throw err;
            if(results.rows.length> 0)
                console.log("record updated suceesfully");
        }

    )
    
})
app.get("/users/dashboard/status/sent_back/:id", (req, res) =>{
    console.log("Requested id : " ,req.params.id);
    const vid =req.params.id; 
    pool.query(
        `update vendor set status = 'Sent Back' where vendor_id = $1`,[vid],
        (err,results) =>{
            if(err)
                throw err;
            if(results.rows.length> 0)
                console.log("record updated suceesfully");
        }

    )
    
})

//-----------------------------Register new user--------------------
app.post('/users/register', async(req, res) =>{
    let {name, email,password,password2} = req.body;
    console.log({name,
        password,
        email,
        password2});
        let errors = [];
        if(password.length < 6){
            errors.push({message:"password should be at least 6 characters"});
        }
        if(password != password2){
            errors.push({message:"Password do not match"});
        }
        if(errors.length > 0){
            res.render('register',{errors});
        }else{
            let hashPassword = await bcrypt.hash(password,10);
            pool.query(
                `SELECT * FROM admin WHERE email = $1`,
                [email],
                
                (err,results) =>{
                    if(err)
                    throw err;
                    
                    
                    if(results.rows.length > 0){
                        console.log("Email already Registered...!");
                        res.render('register')
                    }else{
                        pool.query(
                            `INSERT INTO admin (username,email,password) values($1,$2,$3) RETURNING id,password`,
                            [name,email,hashPassword],
                            (err,results) =>{
                                if(err)
                                    throw err;
                                console.log(results.rows);
                                console.log("you are now regstered");
                                req.flash('success_msg',"you are now regstered");
                                res.redirect("/users/login");
                            }
                        )
                        console.log("this will not print at all")
                        console.log(results.rows);
                    }
                }
                
            );
            console.log(hashPassword);
        }
});


//-oooooo-----------------------------image upload-----------------
var fs = require('fs')
var storage = multer.diskStorage({
    destination: function(req, file, callback){
        var path = './public/Assets/images';
        if(!fs.existsSync(path)){
            fs.mkdirSync(path);
        }
        callback(null, path)
    },
    filename : function(req, file, callback){
       // fs.renameSync('renamed file',file.originalname);
        console.log(file.originalname);
        callback(null,file.originalname);
    }
});

var upload = multer({storage: storage}).array('files',5);
app.post('/users/upload' ,(req, res,next) =>{
    upload(req, res, function(err){
        if(err)
            return res.send("Something wrong");
        else
            return res.send("Uploaded")
    })

})


//----------------------------Log In here---------------------------
app.post('/users/login', 
    passport.authenticate('local',{
        successRedirect : "/users/dashboard",
        failureRedirect : "/users/login",
})
);

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect("/users/dashboard");
    }
    next();
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/users/login");
  }



app.listen(PORT, () =>{
    console.log("Server running on port " + PORT);
})
