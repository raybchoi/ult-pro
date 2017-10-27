// // console.log('getAllUsers.js file loaded');
// // $(document).on('turbolinks:load', function(){
// //
// //   $(function(){
// //     var jeremy = decodeURI("J%C3%A9r%C3%A9my") // Jérémy
// //     var tags = ["Jacob","Isabella","Ethan","Emma","Michael","Olivia","Alexander","Sophia","William","Ava","Joshua","Emily","Daniel","Madison","Jayden","Abigail","Noah","Chloe","你好","你你你", jeremy];
// //     $('#editable').atwho({
// //       at: "#",
// //       data: tags,
// //       limit: 200,
// //       callbacks: {
// //         afterMatchFailed: function(at, el) {
// //           // 32 is spacebar
// //           if (at == '#') {
// //             tags.push(el.text().trim().slice(1));
// //             this.model.save(tags);
// //             this.insert(el.text().trim());
// //             return false;
// //           }
// //         }
// //       }
// //     });
// //   });
// //
// // });
//
// $(document).on('turbolinks:load', function(){
//     var config = {
//         at: '@',
//         limit: 50,
//         data: ['Ram', 'Shayam', 'Rohan', 'Sohan', 'Hello'],
//         callbacks: {
//             before_insert: function (template) {
//                 return atWhoBeforeInsertCallback(template);
//             }
//         }
//     };
//
//     // helper functions
//     function getFormattedVariableName(name) {
//       var span_id = Math.random().toString(36).substring(2, 10);
//       return '<span id="' + span_id + '" class="var">' + name + '</span>'
//     }
//     function atWhoBeforeInsertCallback(value, is_new_one) {
//       var that = this;
//       return value.replace(/<span id='\w+'>.(.+)<\/span>/g, function(_, m){
//         if(is_new_one) {
//           m = m + '(...)';
//         }
//         return getFormattedVariableName(m);
//       });
//     }
//
//     $('#question').atwho(config);
// });
