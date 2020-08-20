const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');
mongoose.connect("mongodb://localhost:27017/rest_blog_app", {useNewUrlParser:true})
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"))
const port = process.env.port||3000;

const blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now()}
})
const Blog = mongoose.model("Blog",blogSchema);
app.get('/',(req,res)=>{
    res.redirect("/blogs");
})
app.get('/blogs',(req,res)=>{
    Blog.find({},(err,blogs)=>{
        if(err){
            console.log("error");
        
        }
        else{
            res.render("index",{blogs,blogs});
        }
    })
});
//NEW ROUTE

app.get("/blogs/new",(req,res)=>{
    res.render("new");
})

//create route

app.post("/blogs",(req,res)=>{
    //create blog
    //req.body.blog.body = req.expressSanitizer(req.body.blog.body);
    Blog.create(req.body.blog,(err,newBlog)=>{
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    })
})
//SHOW ROUTES

app.get("/blogs/:id",(req,res)=>{
  Blog.findById(req.params.id,(err,foundBlog)=>{
      if(err){
          res.redirect("/blogs");

      }else{
          res.render("show",{blog:foundBlog})
      }
  })
})
//EDIT ROUTE

app.get("/blogs/:id/edit",(req,res)=>{
    Blog.findById(req.params.id,(err,foundBlog)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog:foundBlog})
        }
    })
    
});

//UPDATE ROUTE

app.put("/blogs/:id",(req,res)=>{
    //req.body.blog.body = req.expressSanitizer(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog,(err,updatedBlog)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    })
})

//DELETE ROUTE

app.delete("/blogs/:id",(req,res)=>{
    //destroy blog

    Blog.findByIdAndRemove(req.params.id,(err)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    })
})





//ROUTES
/*Blog.create({
    title:"Test Blog",
    image:"https://images.unsplash.com/photo-1590634332992-b8b4a4b7ae47?ixlib=rb-1.2.1&auto=format&fit=crop&w=433&q=80",
    body:"Hello this is a blog post"
})*/

app.listen(port,()=>{
    console.log('RESTful blog has started');
})
