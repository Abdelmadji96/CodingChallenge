var { Text } = require("../models/text");
var {
  openConnection,
  closeConnection,
  is_connected,
} = require("../helpers/database.js");
const ObjectId = require("mongodb").ObjectId;

function addText(req, res) {
  openConnection();

  let text = new Text();
  text.content = req.body.content;
  text.language = req.body.language;

  text
    .save()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(300).json(err);
    });

  if (is_connected) closeConnection();
}

function getAlltext(req, res) {
  openConnection();

  Text.find({}, (err, texts) => {
    if (err || texts == null) {
      res.status(300).json({
        message: "List of texts is empty",
      });
    } else {
      res.status(200).json(texts);
    }
  });

  if (is_connected) closeConnection();
}

function getAllTextWithLang(req, res) {
  const lng = req.swagger.params["lng"].value;

  openConnection();

  Text.find({ language: lng }, (err, texts) => {
    if (err || texts == null) {
      res.status(300).json({
        message: "List of texts is empty",
      });
    } else {
      res.status(200).json(texts);
    }
  });

  if (is_connected) closeConnection();
}

async function getTextsLangPagination(req, res) {
  const page = req.swagger.params["page"].value;
  const limit = req.swagger.params["limit"].value;
  const lng = req.swagger.params["lng"].value;

  openConnection();

  const count = await Text.find({ language: lng }).count();
  const texts = await Text.find({ language: lng })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();
  res.status(200).json({
    texts,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  });

  if (is_connected) closeConnection();
}
async function getTextsPagination(req, res) {
  const page = req.swagger.params["page"].value;
  const limit = req.swagger.params["limit"].value;

  openConnection();

  const count = await Text.find({}).count();
  const texts = await Text.find({})
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();
  res.status(200).json({
    texts,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  });

  if (is_connected) closeConnection();
}
function setText(req, res) {
  const id = req.swagger.params["textId"].value;
  const content = req.body.content;
  const language = req.body.language;

  openConnection();

  Text.findById(id, (err, text) => {
    if (err) {
      res.status(300).json(err);
    } else if (text == null) {
      res.status(404).json({
        message: "text not found",
      });
    } else {
      text.content = content;
      text.language = language;
      text
        .save()
        .then((result) => {
          res.status(200).json(result);
        })
        .catch((err) => {
          res.status(300).json(err);
        });
    }
  });

  if (is_connected) closeConnection();
}
function deleteText(req, res) {
  const id = req.swagger.params["textId"].value;

  openConnection();

  Text.findById(id, (err, text) => {
    if (err) {
      res.status(300).json(err);
    } else if (text == null) {
      res.status(404).json({
        message: "Text not found",
      });
    } else {
      Text.deleteOne({ _id: id }).exec();
      res.status(200).json({
        message: "Text deleted",
      });
    }
  });

  if (is_connected) closeConnection();
}

function countWord(req, res) {
  const id = req.swagger.params["textId"].value;
  const language = req.swagger.params["language"].value;
  const new_id = new ObjectId(id);

  openConnection();

  Text.findOne({ _id: new_id, language: language }, (err, text) => {
    if (err) {
      res.status(300).json(err);
    } else if (text == null) {
      res.status(404).json({
        message: "Text not found",
      });
    } else {
      const countWord = text.content.split(" ").length;
      res.status(200).json({ countWord: countWord });
    }
  });

  if (is_connected) closeConnection();
}

function mostOccurrent(req, res) {
  openConnection();

  Text.find({}, (err, texts) => {
    if (err || texts == null) {
      res.status(300).json({
        message: "List of texts is empty",
      });
    } else {
      var max = 0,
        maxChar = "";
      texts.map((text) => {
        text.content.split("").forEach(function (char) {
          if (text.content.split(char).length > max) {
            max = text.content.split(char).length;
            maxChar = char;
          }
        });
      });

      res.status(200).json({ mostOccurrent: maxChar });
    }
  });

  if (is_connected) closeConnection();
}

function searchText(req, res) {
  const query = req.swagger.params["search"].value;

  openConnection();

  Text.find(
    {
      $or: [
        { content: { $regex: query, $options: "$i" } },
        { language: { $regex: query, $options: "$i" } },
      ],
    },
    (err, texts) => {
      if (err) {
        res.status(300).json(err);
      } else {
        if (texts.length == 0) {
          res.status(200).json({
            message: "List of texts is empty",
          });
        } else {
          res.status(200).json(texts);
        }
      }
    }
  );

  if (is_connected) closeConnection();
}

module.exports = {
  addText,
  getAlltext,
  getAllTextWithLang,
  getTextsLangPagination,
  getTextsPagination,
  setText,
  deleteText,
  countWord,
  mostOccurrent,
  searchText,
};
