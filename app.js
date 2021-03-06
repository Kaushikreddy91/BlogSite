var bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    express    = require("express"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    app = express();

mongoose.connect("mongodb://localhost/blogapp", {useNewUrlParser: true , useUnifiedTopology: true});
mongoose.connection
    .once('open',() => console.log('database connected'))
    .on('error',(error) =>{
        console.log("YOUR ERROR",error);
    });

app.set("view engine", "ejs");     //FOR NOT KEEPING .EJS AT END OF EVERY FILE
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(expressSanitizer());

var blogSchema = new mongoose.Schema({
    title: String,
    image: "String",
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

//RESTFUL ROUTES

app.get("/",function(req, res){
    res.redirect("/blogs");
})

//INDEX ROUTE

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("error");
        }else{
            res.render("index", {blogs: blogs});
        }
    });
});

//NEW ROUTE

app.get("/blogs/new", function(req,res){
    res.render("new");
});

//CREATE

app.post("/blogs",  function(req ,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    });
});

// SHOW ROUTE

app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundblog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show", {blog: foundblog});
        }
    });
});

// EDIT ROUTE

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit", {blog: foundBlog});
        }
    });
});

//UPDATE ROUTE

app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE ROUTE

app.delete("/blogs/:id",function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});

app.listen( 3000 , function(){
    console.log("server is running");
});
