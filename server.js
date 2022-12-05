/* A3- Solution
 https://infinite-caverns-60557.herokuapp.com/ 
 
 Super! implemented the routes and filters successfully with correct result and display.

images were handeld fine.

Well done!

Cheers

Sunny
 */


const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const bodyParser = require("body-parser");
const fs = require("fs");

const data_service = require("./data-service.js");

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));

// call this function after the http server starts listening
function onHttpStart(){
    console.log("Express http server listening on: " + HTTP_PORT);
}

//A3- define storage destination
// multer: for form with file upload 
const storage = multer.diskStorage({
     destination: "./public/images/uploaded",
     filename: function(req, file, cb){
         cb(null, Date.now()+ path.extname(file.originalname));
     }
});
var upload = multer({storage:storage});

// body-parser: for form without file upload
app.use(bodyParser.urlencoded({extended:true}));

//set up default route
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get("/about", (req,res)=>{
    res.sendFile(path.join(__dirname,"/views/about.html"));
});

//adding more routes
/*  A2 - 
app.get("/employees", (req,res)=>{
    data_service.getAllEmployees().then((data)=>{
        res.json(data);
    }).catch((err)=>{
        console.log(err);
    });
});
- A2 modified in A3, below */
//A3- part 4
app.get("/employees", (req,res)=>{
   
    if (req.query.status)
        {
            data_service.getEmployeesByStatus(req.query.status).then((data)=>{
                res.json(data);
            }).catch((reason)=>{
                res.json({message:reason});
            });
        }
    else if (req.query.department)
            {
                data_service.getEmployeesByDepartment(req.query.department).then((data)=>{
                    res.json(data);
                }).catch((reason)=>res.json({message:reason}));
            }
    
    else if (req.query.manager)
        {
            data_service.getEmployeesByManager(req.query.manager).then((data)=>{
                res.json(data);
            }).catch((reason)=>res.json({message:reason}));
        }
    else {
        data_service.getAllEmployees().then((data)=>{
            res.json(data);
        }).catch((err)=>{
            res.json({message: err});
        });  
    }// if no query, response all employees
    }); // end of: app.get("/employees", (req,res)=>{

app.get("/employee/:empNum",(req,res)=>{
    data_service.getEmployeeByNum(req.params.empNum).then((data)=>{
        res.json(data);
    }).catch((reason)=>res.json({message:reason}));
})

app.get("/managers",(req,res)=>{
    data_service.getManagers().then((data)=>{
        res.json(data);
    }).catch((err)=>{
        console.log(err);
    });
});

app.get("/departments",(req,res)=>{
    data_service.getDepartments().then((data)=>{
        res.json(data);
    }).catch((err)=>{
        console.log(err);
    });
});

/* A3 new routes - beginning */
app.get("/employees/add",(req,res)=>{
    //res.send("add employees");
    res.sendFile(path.join(__dirname,"/views/addEmployee.html"));
});

app.get("/images/add", (req,res)=>{
    //res.send("images");
    res.sendFile(path.join(__dirname,"/views/addImage.html"));
});

app.get("/images",(req,res)=>{
    fs.readdir("./public/images/uploaded", function(err,items){
        res.json({images:items});
    });
});

app.post("/images/add",upload.single("imageFile"), (req,res)=>{
    res.redirect("/images");
 });

app.post("/employees/add", (req,res)=>{
     data_service.addEmployee(req.body).then(()=>{
        res.redirect("/employees");
     });
 });

/*** A3 end ****/

app.use((req,res)=>{
    res.status(404).send("Page Not Found");
});

data_service.initialize().then(()=>{
    //listen on HTTP_PORT
    app.listen(HTTP_PORT, onHttpStart);
}).catch(()=>{
    console.log("Cannot open files.");
});