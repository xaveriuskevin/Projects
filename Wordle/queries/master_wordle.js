'use strict'

exports.getWordle = (db, values) =>
  new Promise((resolve, reject) => {
    db.model("master_wordle")
      .findOne({
        where: {
          article_id: values,
        },
        attributes: ["id", "article_id", "theme_1", "word", "theme_2", "word_2",],
      })
      .then((data) => {
        resolve(data);
      })
      .catch(reject);
  });