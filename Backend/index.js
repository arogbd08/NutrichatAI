const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { Groq } = require("groq-sdk");

require("dotenv").config({ path: "./.env" });

const app = express();
const port = 3002;

// CORS Configuration
const corsOptions = {
  origin: "*",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

// MongoDB Connection
async function connectToMongo(db_url) {
  try {
    await mongoose.connect(db_url);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

const uri = "mongodb+srv://username:F1ngeringurmum@food.y5j33.mongodb.net/Sample_nutrition?retryWrites=true&w=majority&appName=Food";
connectToMongo(uri);

// Groq API Configuration
const groq = new Groq({ apiKey: "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" });



const indrSchema = new mongoose.Schema({
  ingr: { type: String, required: true }, // Ingredient name
  id: { type: Number, required: true }, // Unique ID
  "cal/g": { type: Number, required: true }, // Calories per gram
  "fat(g)": { type: Number, required: true }, // Fat in grams
  "carb(g)": { type: Number, required: true }, // Carbs in grams
  "protein(g)": { type: Number, required: true } // Protein in grams
}, { collection: "Ingredients" });

const Ingredient = mongoose.model("Ingredients", indrSchema);

module.exports = Ingredient;




// API endpoint to fetch all protein data
app.get("/api/ingredient", async (req, res) => {
  try {
    const ingredients = await Ingredient.find(); // Fetch all documents from the `protien` collection
    res.json(ingredients); // Return the fetched data as JSON
  } catch (err) {
    console.error("Error fetching ingredient data:", err);
    res.status(500).json({ error: "Failed to fetch ingredient data" });
  }
});


const mealSchema = new mongoose.Schema({
  meal_name: { type: String, required: true }, // Ingredient name
  id: { type: Number, required: true }, // Unique ID
  "total_cal": { type: Number, required: true }, // Calories per gram
  "total_fat": { type: Number, required: true }, // Fat in grams
  "total_carb": { type: Number, required: true }, // Carbs in grams
  "total_protein": { type: Number, required: true } // Protein in grams
}, { collection: "Meals" });

const Meal = mongoose.model("Meals", mealSchema);

module.exports = Meal;





const meal_indrSchema = new mongoose.Schema({
  meal_id: {
    type: mongoose.Schema.Types.String,
    ref: 'Meals',
    required: true,
  },
  ingredient_id: {
    type: mongoose.Schema.Types.Number,
    ref: 'Ingredients',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
}, { collection: "Meal_Ingredients" });

const Meal_Ingredient = mongoose.model("Meal_Ingredients", meal_indrSchema);

module.exports = Meal_Ingredient;

app.get("/api/meals_with_ingredients", async (req, res) => {
  try {
    const meals = await Meal.find().lean();

    const mealDetails = await Promise.all(
      meals.map(async (meal) => {
        const mealIngredients = await Meal_Ingredient.find({ meal_id: meal._id }).lean(); // meal_id is ObjectId

        const ingredientsWithDetails = await Promise.all(
          mealIngredients.map(async (mealIng) => {
            const ingredient = await Ingredient.findOne({ id: mealIng.ingredient_id }).lean(); // Fix here 🔥
            if (!ingredient) return null;

            return {
              name: ingredient.ingr,
              quantity: mealIng.quantity,
              calories: (ingredient["cal/g"] * mealIng.quantity).toFixed(2),
              protein: (ingredient["protein(g)"] * mealIng.quantity).toFixed(2),
              fat: (ingredient["fat(g)"] * mealIng.quantity).toFixed(2),
              carbs: (ingredient["carb(g)"] * mealIng.quantity).toFixed(2),
            };
          })
        );

        return {
          meal_id: meal._id.toString(),
          meal_name: meal.meal_name,
          total_calories: meal.total_cal.toFixed(2),
          total_protein: meal.total_protein.toFixed(2),
          total_fat: meal.total_fat.toFixed(2),
          total_carbs: meal.total_carb.toFixed(2),
          ingredients: ingredientsWithDetails.filter((ing) => ing !== null), // Filter nulls
        };
      })
    );

    console.log(mealDetails);
    res.json(mealDetails);
  } catch (err) {
    console.error("Error fetching meals with ingredients:", err);
    res.status(500).json({ error: "Failed to fetch meal details" });
  }
});



// MongoDB Query Execution Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    console.log("User message:", message);

    const ingredients = await Ingredient.find().lean();
    if (ingredients.length === 0) {
      return res.status(500).json({ error: "No ingredients found in the database." });
    }

    const ingredientList = ingredients.slice(0, 100).map(ingr => ({
      name: ingr.ingr,
      id: ingr.id,
      calories: ingr["cal/g"],
      protein: ingr["protein(g)"],
      fat: ingr["fat(g)"],
      carbs: ingr["carb(g)"],
    }));
    

    // Prompt for the AI to understand MongoDB commands with a focus on the 'sales' collection

    const prompt = `
    
The user wants to generate a meal idea based on available ingredients. 
Use the provided ingredient list to create a meal that meets their calorie and macro needs.

**Instructions:**
1. Generate a meal name.
2. Select 2-5 ingredients from the list that best match the user's request.
3. Assign realistic quantities (grams) to each ingredient.
4. Calculate total calories, protein, fat, and carbs.
5. Structure the response as valid JSON.

**Ingredient List:** ${JSON.stringify(ingredientList, null, 2)}

**User Request:** "${message}"

**Response Format:**
{
  "taskMessage": "<confirmation message>",
  "databaseChanges": {
    "command": "insertOne",
    "collection": "Meals",
    "query": {
      "meal_name": "<Generated Meal Name>",
      "total_cal": <Total Calories>,
      "total_fat": <Total Fat>,
      "total_carb": <Total Carbs>,
      "total_protein": <Total Protein>
    }
  },
  "databaseChanges2": [
    {
      "command": "insertOne",
      "collection": "Meal_Ingredients",
      "query": {
        "meal_id": "<Meal ObjectId>",
        "ingredient_id": "<Ingredient ObjectId>",
        "quantity": <Quantity in grams>
      }
    },
    ...
  ]
}
Please ensure:
- The task completion message is very brief.
- The JSON string is properly formatted so it can be converted into a JSON object without issues.

The structure of the response should look as follows (note: the JSON is represented as a string):

Ensure the JSON string is well-formed and can be directly parsed by \JSON.parse()\. Do not include any additional information beyond the specified structure.

ensure the content starts and ends with {} nothing else
`;

    // Generate the response using Groq
    const aiResponse = await groq.chat.completions.create({
      messages: [
        { role: "system", content: prompt}, 
      ],
      model: "llama-3.3-70b-versatile",
    });

    const fullreply = aiResponse.choices[0]?.message?.content || "No content returned.";
    console.log("AI reply:", fullreply);

    // Parse AI reply and execute the MongoDB command
    const parsedCommand = JSON.parse(fullreply.trim());   
    console.log(parsedCommand);
    console.log(parsedCommand.taskMessage);
    const reply = parsedCommand.taskMessage;

    console.log(reply);

    
    const { command, collection, query, options } = parsedCommand.databaseChanges;
  


    const collectionInstance = mongoose.connection.collection(collection);
    let dbResult;

    switch (command) {
      case "insertOne":
        dbResult = await collectionInstance.insertOne(query || {});
        break;
      case "insertMany":
        dbResult = await collectionInstance.insertMany(query || []);
        break;
      case "updateOne":
        dbResult = await collectionInstance.updateOne(query.filter, { $set: query.update }, options || {});
        break;
      case "updateMany":
        dbResult = await collectionInstance.updateMany(query.filter, { $set: query.update }, options || {});
        break;
      case "deleteOne":
        dbResult = await collectionInstance.deleteOne(query || {});
        break;
      case "deleteMany":
        dbResult = await collectionInstance.deleteMany(query || {});
        break;
      case "none":
        return res.status(400).json({ error: "Unsupported command" });
    }

    if (parsedCommand.databaseChanges2 && Array.isArray(parsedCommand.databaseChanges2)) {
        const mealIngredientsCollection = mongoose.connection.collection("Meal_Ingredients");

        for (const change of parsedCommand.databaseChanges2) {
            await mealIngredientsCollection.insertOne(change.query);
        }

        console.log("Meal_Ingredients records inserted successfully.");
    }



    console.log(dbResult);




    // Send the operation result back to the user
    return res.json({reply});
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
