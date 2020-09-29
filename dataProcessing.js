const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const { oneWord } = require("./mongoDBschema.js");

router.get("/getMongoData", async (req, res) => {
  const briefData = await oneWord.find(
    {},
    { name: 1, category: { type: 1, defAndEg: { $slice: 1 } } }
  );
  const correctArray = briefData.reverse();
  res.send(correctArray);
});

router.post("/deleteMongoData", async (req, res) => {
  console.log(req.body.word);
  const result = await oneWord.deleteOne({ name: req.body.word });
  console.log(result);

  const briefData = await oneWord.find(
    {},
    { name: 1, category: { type: 1, defAndEg: { $slice: 1 } } }
  );
  const correctArray = briefData.reverse();
  res.send(correctArray);
});

router.post("/getDetails", async (req, res) => {
  const wordDetails = await oneWord.findOne({ name: req.body.word });
  res.send(wordDetails);
});

router.post("/searchOxford", async (req, res) => {
  console.log(req.body.searchKeyWord);
  const rootForm = await fetch(
    `https://od-api.oxforddictionaries.com/api/v2/lemmas/en-us/${req.body.searchKeyWord}`,
    {
      method: "GET",
      headers: {
        app_id: "fd907da5",
        app_key: "5904376a3306a62c2c1d968070b50f8e",
      },
    }
  );
  const jsonRootForm = await rootForm.json();
  const finalRoot = await jsonRootForm.results[0].lexicalEntries[0]
    .inflectionOf[0].id;

  const apiResult = await fetch(
    `https://od-api.oxforddictionaries.com/api/v2/entries/en-us/${finalRoot}?fields=etymologies,definitions,examples`,
    {
      method: "GET",
      headers: {
        app_id: "fd907da5",
        app_key: "5904376a3306a62c2c1d968070b50f8e",
      },
    }
  );

  const jsonData = await apiResult.json();
  let origin = "nil";
  if (jsonData.results[0].lexicalEntries[0].entries[0].etymologies) {
    origin = jsonData.results[0].lexicalEntries[0].entries[0].etymologies[0];
  } else {
    origin = "nil";
  }

  let category = [];

  jsonData.results[0].lexicalEntries.map((categoryType) => {
    let defAndEg = [];

    categoryType.entries[0].senses.map((defEg) => {
      let example = "nil";
      if (defEg.examples) {
        example = defEg.examples[0].text;
      } else {
        example = "nil";
      }

      const tempObj = {
        def: defEg.definitions[0],
        eg: example,
      };
      defAndEg.push(tempObj);
    });

    categoryObject = {
      type: categoryType.lexicalCategory.id,
      defAndEg: defAndEg,
    };

    category.push(categoryObject);
  });

  const finalWordObject = {
    name: jsonData.id,
    origin: origin,
    category: category,
  };
  res.send(finalWordObject);

  const oldWord = await oneWord.findOne({ name: finalWordObject.name });

  if (oldWord) {
    console.log("word already exists");
  } else {
    const newWord = new oneWord({
      name: finalWordObject.name,
      origin: finalWordObject.origin,
      category: finalWordObject.category,
    });
    await newWord.save();
  }
});

module.exports = router;
