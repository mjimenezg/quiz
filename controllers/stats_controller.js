var models = require('../models/models.js');

exports.stats = function(req,res){
   var s = { npre: 0, ncom: 0, media: 0, npresin: 0, nprecon: 0}
   models.Quiz.count().then(function (cuenta){
     if (cuenta) {s.npre = cuenta; }
     models.Comment.count().then(function (cuenta){
       if (cuenta) {s.ncom = cuenta; }
       // consulta para obtener el numero de preguntas con comentario:
       // SELECT count(DISTINCT(`QuizId`)) AS `count` FROM `Comments` AS `Comment`;
       models.Comment.aggregate('QuizId', 'count', {distinct: true} ).then(function(cuenta){
         if (cuenta) {s.nprecon = cuenta};
         // calcular la media de comentarios por pregunta
         s.media = ((s.npre==0)?0:s.ncom / s.npre).toFixed(2);
         s.npresin = s.npre - s.nprecon;
         console.log('Estadisticas: ', s)
         res.render('stats', {s: s, errors: [] });
       });
     });
   });
};
