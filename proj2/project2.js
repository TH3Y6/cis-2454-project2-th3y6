const express = require('express');
const fs = require('fs');
const path = require('path');
const { json } = require('stream/consumers');
const app = express();

app.use(express.json());

const jsonPath = path.join(__dirname, "recipes.json");

//module to help get recipes from json
const readRecipes = () => {
    try {
      const recipe = fs.readFileSync(jsonPath, "utf8");
      return JSON.parse(recipe);
    } 
    catch (error) {
      console.log("Error reading " + jsonPath);
    }
}

//module to help write recipes to the json
const writeRecipes = (recipes) => {
  try {
    fs.writeFileSync(jsonPath, JSON.stringify(recipes, null, 2), "utf8");
  }
  catch (error) {
    console/log("Error writing " + jsonPath);
  }
}

//get method includes filter to get recipe by name
app.get("/recipes", (req, res) => {
  const recipes = readRecipes();
  const { name } = req.query;

  //filter to get recipe by name
  if (name) {
    const recipeDetails = recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(name.toLowerCase())
    );
    return res.json(recipeDetails);
  }
    res.json(recipes);
});

//post method to add new recipe
app.post("/recipes", (req, res) => {
  const recipes = readRecipes();
  const newRecipe = req.body;

  //id system to make crud operations easier (creates ID for json)
  const newID = recipes.length > 0 ? Math.max(...recipes.map(r =>r.id)) + 1 : 1;
  newRecipe.id = newID;

  recipes.push(newRecipe);
  writeRecipes(recipes);
});

//put method to update a recipe
app.put("/recipes/:id", (req, res) => {
  const recipes = readRecipes();
  const { id } = req.params;
  const recipeIndex = recipes.findIndex(recipe => recipe.id === id);

  recipes[recipeIndex] = { ...recipes[recipeIndex], ...req.body};
  writeRecipes(recipes);
  res.json(recipes[recipeIndex]);
});

//delete method to delete a recipe
app.delete("/recipes/:id", (req, res) =>{
  let recipes = readRecipes();
  const { id } = req.params;
  const initialRecipeLength = recipes.length;

  recipes = recipes.filter(recipe => recipe.id !== id);

  writeRecipes(recipes);
});

//test to see if things worked 
 app.get("/", (req, res) => {
     res.send("Hello use /recipes");
});


app.listen(5150, () => {
  console.log("Server running on http://localhost:5150");
});