var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../server");
var db = require("../models");
var expect = chai.expect;

// Setting up the chai http plugin
chai.use(chaiHttp);

var request;

describe("GET /api/ingredients", function() {
  // Before each test begins, create a new request server for testing
  // & delete all examples from the db
  beforeEach(function() {
    request = chai.request(server);
    return db.sequelize.sync({ force: true });
  });

  it("should find all ingredients", function(done) {
    // Add some examples to the db to test with

    db.User.bulkCreate([
      {
        firstName: "Joe",
        lastName: "Smith",
        username: "jsmith123",
        email: "test@test.com",
        role: "QA",
        password:
          "$2a$10$8prPhAzPKIm2FzPBlFC2ROkFnJGRZnQGGWbi2a6yMIbjKNmKDfaHi",
        createdAt: "2019-01-30 19:46:18",
        updatedAt: "2019-01-30 19:46:18"
      }
    ]).then(() => {
      db.Ingredients.bulkCreate([
        {
          name: "Chicken",
          protein: 2,
          // MeasurementID: null,
          calories: 215,
          fat: 15,
          UserId: 1,
          createdAt: "2019-01-30 19:46:18",
          updatedAt: "2019-01-30 19:46:18"
        },
        {
          name: "Rice",
          protein: 1,
          // MeasurementID: 1,
          calories: 20,
          fat: 7,
          UserId: 1,
          createdAt: "2019-01-30 19:46:18",
          updatedAt: "2019-01-30 19:46:18"
        }
      ]).then(function() {
        // Request the route that returns all examples
        request.get("/api/ingredients").end(function(err, res) {
          var responseStatus = res.status;
          var responseBody = res.body;

          // Run assertions on the response

          expect(err).to.be.null;

          expect(responseStatus).to.equal(200);

          expect(responseBody)
            .to.be.an("array")
            .that.has.lengthOf(2);

          expect(responseBody[0])
            .to.be.an("object")
            .that.includes({ name: "Chicken", fat: 15 });

          expect(responseBody[1])
            .to.be.an("object")
            .that.includes({ name: "Rice", fat: 7 });

          // The `done` function is used to end any asynchronous tests
          done();
        });
      });
    });
  });
});
