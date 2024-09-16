const mongoose = require('mongoose');
const dotenv = require("dotenv");
const express = require("express");
const methodOverride = require("method-override"); // new
const morgan = require("morgan")

// APP + configuration
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); // new
app.use(morgan("dev")); //new

mongoose.connect(process.env.MONGODB_URI); // opens connection to MongoDB

// mongoose connection event listener
mongoose.connection.on ("connected",() => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
})

mongoose.connection.on("error",(err)=>{
    console.log(err);
});

// IMPORT mongoose models
const player = require("./models/nba");
// console.log(nba)


app.set("view engine","ejs")


// Routes


 // App.Get ROUTE

 // landing pages - the Home Page
app.get("/",(req,res)=> {
    res.render("team")
});


app.get("/nbas/new",(req,res)=>{
    res.render("nbas/new");
});

app.get('/nbas',async (req,res)=>{
    try {
      const allPlayers = await player.find()
    res.render("nbas/team", {player: allPlayers})
    } catch(err){
    console.log(err)
    res.redirect('/')
    }
    })
    
    app.get("/nbas/:playerId", async (req, res) => {
        const foundPlayer = await player.findById(req.params.playerId);
        res.render("nbas/show.ejs", { player: foundPlayer });
      });

      app.get("/nbas/:playerId/edit", async (req, res) => {
        const foundPlayer = await player.findById(req.params.playerId);
        res.render("nbas/edit.ejs", {
          player:foundPlayer,
        });
      });

      // APP POST ROUTE

      app.post("/nbas", async (req, res) => {
        if (req.body.isAPlayer === "on") {
          req.body.isAPlayer = true;
        } else {
          req.body.isAPlayer = false;
        }
        await player.create(req.body);
        res.redirect("/nbas"); // redirect to team.ejs
      });
      

      app.post("/nbas", async (req,res) => {

        if (req.body.isAPlayer) {
            req.body.isAPlayer = true;
        } else {
            req.body.isAPlayer = false;
        }
        try {
            const createdPlayer = await player.create(req.body)
            res.redirect('/nbas/new?status=success')
        } catch(err){
            res.status(400).json({error: err.message})
        }
      })

      // APP. DELETE ROUTE

      app.delete("/nbas/:playerId", async (req, res) => {
        await player.findByIdAndDelete(req.params.playerId);
        res.redirect("/nbas");
      });

      // APP PUT
      app.put("/nbas/:playerId", async (req, res) => {
        // Handles the 'isAPlayer' data
        if (req.body.isAPlayer === "on") {
          req.body.isAPlayer = true;
        } else {
          req.body.isAPlayer = false;
        }
       // update the players in the database
        await player.findByIdAndUpdate(req.params.playerId, req.body);
        res.redirect(`/nbas/${req.params.playerId}`);
});

// server
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
  
