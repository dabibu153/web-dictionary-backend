const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const { oneWord } = require("./mongoDBschema.js");

router.get("/getMongoData", async (req, res) => {});

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
  let category = [];
  jsonData.results[0].lexicalEntries.map((textType) => {
    let defAndEg = [];

    let temp = 0;

    if (textType.entries[0].senses.length > 3) {
      temp = 3;
    } else {
      temp = textType.entries[0].senses.length();
    }

    for (let i = 0; i <= temp; i++) {
      tempObject = {
        def: textType.entries[0].senses[i].definitions[0],
        eg: textType.entries[0].senses[i].examples[0].text,
      };
      defAndEg.push(tempObject);
    }

    let textDataBlock = {
      type: textType.lexicalCategory.id,
      defAndEg: defAndEg,
    };
    category.push(textDataBlock);
  });

  const finalWordObject = {
    name: jsonData.results[0].id,
    origin: jsonData.results[0].lexicalEntries[0].entries[0].etymologies[0],
    category: category,
  };
  res.send(finalWordObject);
});

module.exports = router;
