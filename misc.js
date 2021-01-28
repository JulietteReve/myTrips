//  // Remplissage de la base de donnée, une fois suffit
// router.get("/save", async function (req, res, next) {
//     // How many journeys we want
//     var count = 300;

//  // Save  ---------------------------------------------------
//   for (var i = 0; i < count; i++) {
//     departureCity = city[Math.floor(Math.random() * Math.floor(city.length))];
//     arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))];

//     if (departureCity != arrivalCity) {
//       var newUser = new journeyModel({
//         departure: departureCity,
//         arrival: arrivalCity,
//         date: date[Math.floor(Math.random() * Math.floor(date.length))],
//         departureTime: Math.floor(Math.random() * Math.floor(23)) + ":00",
//         price: Math.floor(Math.random() * Math.floor(125)) + 25,
//       });

//       await newUser.save();
//     }
//   }
//   res.render("index", { title: "Ticketac" });
// });
