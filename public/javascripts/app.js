var app = angular.module('angularjsNodejsTutorial', []);
app.controller('loginController', function($scope, $http) {
  $scope.verifyLogin = function() {
    // To check in the console if the variables are correctly storing the input:
    // console.log($scope.username, $scope.password);

    var request = $http({
      url: '/login',
      method: "POST",
      data: {
        'username': $scope.username,
        'password': $scope.password
      }
    })

    request.success(function(response) {
      // success
      console.log(response);
      if (response.result === "success") {
        // After you've written the INSERT query in routes/index.js, uncomment the following line
        // window.location.href = "http://localhost:8081/dashboard"
      }
    });
    request.error(function(err) {
      // failed
      console.log("error: ", err);
    });

  };
});


app.controller('parEduPopulateController', function($scope, $cacheFactory, $http) {
  $scope.getScore = function () {
  $scope.headingVisbility = {'visibility': 'visible'};
  $scope.score = [];
  var requestScore = $http({
      url: '/postStateEdu',
      cache: true,
      method: "POST",
      data: {
        'state': $scope.selectedName1,
        'parental_education': $scope.selectedName
      }
    })

  requestScore.success(function(response) {
      var log = [];
      angular.forEach(response.row, function(value, key) {
        $scope.score.push({'natAvg': parseInt(value.average,10), 'Total': value.Total, 'ERW': value.ERW, 'Math': value.Math});
      },log);
    });

    requestScore.error(function(err) {
      // failed
      console.log("parEdu Score retrieval error: ", err);
    });
  }


  //states population
  $scope.states = [];
  $scope.populateStates = function() {
    $scope.headingVisbility = {'visibility': 'hidden'};
    var request_popState = $http({
      cache: true,
      url: '/fillStates',
      method: "GET"
    })
    request_popState.success(function(response) {
        var log = [];
        angular.forEach(response.row, function(value, key) {
          $scope.states.push(value.state);
        },log);

    });

    request_popState.error(function(err) {
      // failed
      console.log("populate state error: ", err);
    });

  }

  //par Edu population
  $scope.parEdu = [];
  $scope.state = [];
  $scope.populateParEdu = function() {
    var request_pop = $http({
      url: '/predictByEdu',
      cache: true,
      method: "GET"
    })
    request_pop.success(function(response) {
      var log = [];
      var notStr = "No Response"
      angular.forEach(response.row, function(value, key) {
        if(!(value.parental_education === notStr)) {
          $scope.parEdu.push(value.parental_education);
        }
      },log);
    });

    request_pop.error(function(err) {
      // failed
      console.log("populate par edu id error: ", err);
    });
  }

  $scope.populateParEdu();
  $scope.populateStates();
});

app.controller('incomeRaceController', function($scope, $http) {

  //states population
  $scope.states = [];
  $scope.populateStates = function() {
    var request_popState = $http({
      cache: true,
      url: '/fillStates',
      method: "GET"
    })
    request_popState.success(function(response) {
        var log = [];
        angular.forEach(response.row, function(value, key) {
          $scope.states.push(value.state);
        },log);

    });

    request_popState.error(function(err) {
      // failed
      console.log("populate state error: ", err);
    });
    $scope.headingVisbility = {'visibility': 'hidden'};
  }

  $scope.incSplit = function(string, index) {
    var array = string.split('-');
    return array[index];
}

  $scope.getScore = function () {
  $scope.headingVisbility = {'visibility': 'visible'};
  $scope.score = [];
  var requestScore = $http({
      url: '/postRaceInc',
      method: "POST",
      data: {
        'race': $scope.selectedRace,
        'income_low_range': $scope.incSplit($scope.selectedIncome, 0),
        'state': $scope.selectedState
      }
    })

  requestScore.success(function(response) {
      var log = [];
      angular.forEach(response.row, function(value, key) {
        var avg;
        console.log(value.total_from_race);
        if(value.total_from_race == 0 || value.total_from_income == 0 || value.total_from_race === null
          || value.total_from_income === null) {
          avg = "not enough data for given race/income for given state";
        }
        else {
          avg = (value.total_from_race + value.total_from_income)/2;
        }
        $scope.score.push({'total_from_race': value.total_from_race, 'ERW_from_race':value.ERW_from_race,'Math_from_race':value.Math_from_race,'total_from_income':value.total_from_income,'ERW_from_income':value.ERW_from_income, 'Math_from_income':value.Math_from_income, 'avg_total': avg});
      },log);
    });

    requestScore.error(function(err) {
      // failed
      console.log("Income Race Score retrieval error: ", err);
    });
  }

  // Angular function
  $scope.popIncome = function() {
    $scope.incomePop = [];
    var request_income_pop = $http({
      url: '/populateIncome',
      cache: true,
      method: "GET"
    })
    request_income_pop.success(function(response) {
      var log = [];
      var notStr = "No Response"
      angular.forEach(response.row, function(value, key) {
          var up_value;
          if(value.low_range === 200000) {
            up_value = "Max";
          }
          else {
            up_value = value.up_range;
          }
          $scope.incomePop.push(value.low_range + "-" + up_value);

      },log);
    });

    request_income_pop.error(function(err) {
      // failed
      console.log("populate income error: ", err);
    });

  };

  $scope.popRace = function() {
    $scope.racePop = [];
    var request_race_pop = $http({
      url: '/fillRace',
      cache: true,
      method: "GET"
    })
    request_race_pop.success(function(response) {
      var log = [];
      var notStr = "No Response"
      angular.forEach(response.row, function(value, key) {
        if(value.race !== notStr) {
          $scope.racePop.push(value.race);
        }
      },log);
    });

    request_race_pop.error(function(err) {
      // failed
      console.log("populate race error: ", err);
    });

  };
  $scope.popIncome();
  $scope.populateStates();
  $scope.popRace();
});


/* Tejas START */

app.controller('RecommendController', function($scope, $http) {

    //states population
  $scope.states = [];
  $scope.populateStates = function() {
    $scope.Visiblity =  {'visibility': 'hidden'};
    var request_popState = $http({
      cache: true,
      url: '/fillStates',
      method: "GET"
    });

    request_popState.success(function(response) {
        var log = [];
        angular.forEach(response.row, function(value, key) {
          $scope.states.push(value.state);
        },log);

    });

    request_popState.error(function(err) {
      // failed
      console.log("populate state error: ", err);
    });

  };

  $scope.populateStates();



  $scope.GetOutColleges = function () {
    $scope.Visiblity =  {'visibility': 'visible'};
  $scope.score = [];
  var requestScore = $http({
      url: '/postOutOfState',
      cache: true,
      method: "POST",
      data: {
        'state': $scope.selectedName1,
      }
    });

  requestScore.success(function(response) {


      $scope.OutColls = response;

      $scope.OutColls = response;


    });


    requestScore.error(function(err) {
      // failed
      console.log("parEdu Score retrieval error: ", err);
    });
  }


  $scope.GetColleges = function() {
    // To check in the console if the variables are correctly storing the input:
    $scope.Visiblity = {'visibility': 'visible'};
    console.log("selectedMath is " + $scope.selectedMath);

    var Mydata = [];

    $http.get("http://localhost:8081/getSatScore/"+$scope.selectedMath+"/"+$scope.selectedERW)
           .success(function(res){
              $scope.satScores = res;

            });

};


$scope.GetHighSchoolAttain = function() {
  // To check in the console if the variables are correctly storing the input:
  $scope.Visiblity =  {'visibility': 'visible'};

  $http.get("http://localhost:8081/GetHighSchoolRaceProp/"+$scope.selectedState)
         .success(function(res){
            $scope.RaceColls = res;
            console.log("Loggin herer ", res);
          });

};




$scope.GetMeanStates = function() {
  // To check in the console if the variables are correctly storing the input:
  $scope.Visiblity =  {'visibility': 'visible'};
  $http.get("http://localhost:8081/getAboveMeanStates/"+$scope.selectedSat)
         .success(function(res){
            $scope.AboveMeanStates = res;

          });
};
});



/* Tejas END */

app.controller('parMajorPopulateController', function($scope, $cacheFactory, $http) {
  $scope.getScore = function () {
  $scope.score = [];
  var requestScore = $http({
      url: '/postStateMajor',
      cache: true,
      method: "POST",
      data: {
        'state': $scope.selectedState,
        'intended_major': $scope.intendedMajor
      }
    })

  requestScore.success(function(response) {
      var log = [];
      angular.forEach(response.row, function(value, key) {
        $scope.score.push({'natAvg': parseInt(value.average,10), 'Total': value.Total, 'ERW': value.ERW, 'Math': value.Math});
      },log);
    });

    requestScore.error(function(err) {
      // failed
      console.log("parMajor Score retrieval error: ", err);
    });
  }


  //states population
  $scope.states = [];
  $scope.populateStates = function() {
    var request_popState = $http({
      cache: true,
      url: '/fillStates',
      method: "GET"
    })
    request_popState.success(function(response) {
        var log = [];
        angular.forEach(response.row, function(value, key) {
          $scope.states.push(value.state);
        },log);

    });

    request_popState.error(function(err) {
      // failed
      console.log("populate state error: ", err);
    });

  }

  //par Major population
  $scope.parMajor = [];
  $scope.state = [];
  $scope.populateParMajor = function() {
    var request_pop = $http({
      url: '/predictByMajor',
      cache: true,
      method: "GET"
    })
    request_pop.success(function(response) {
      var log = [];
      var notStr = "No Response"
      angular.forEach(response.row, function(value, key) {
        if(!(value.intended_major === notStr)) {
          $scope.parMajor.push(value.intended_major);
        }
      },log);
    });

    request_pop.error(function(err) {
      // failed
      console.log("populate par intended_major id error: ", err);
    });
  }

  $scope.populateParMajor();
  $scope.populateStates();
});

app.controller('InversePredictor', function($scope, $http) {
  //$scope.satScoresInverse = [];
  $scope.GetRaceData = function() {
    $scope.headingVisbility = {'visibility': 'visible'};
    // To check in the console if the variables are correctly storing the input:

    $http.get("http://localhost:8081/getSatScoreInverse/"+$scope.selectedSATScore)
           .success(function(res){
              $scope.satScoresInverse = res;

            });
  };

  $scope.initialize = function(){
    $scope.headingVisbility = {'visibility': 'hidden'};
  };

  $scope.initialize();
});

app.controller('parFirstLanguagePopulateController', function($scope, $cacheFactory, $http) {
  $scope.getScore = function () {
  $scope.score = [];
  var requestScore = $http({
      url: '/postStateFirstLanguage',
      cache: true,
      method: "POST",
      data: {
        'state': $scope.selectedState,
        'first_language': $scope.firstLanguage
      }
    })

  requestScore.success(function(response) {
      var log = [];
      angular.forEach(response.row, function(value, key) {
        $scope.score.push({'natAvg': parseInt(value.average,10), 'Total': value.Total, 'ERW': value.ERW, 'Math': value.Math});
      },log);
    });

    requestScore.error(function(err) {
      // failed
      console.log("parFirstLanguage Score retrieval error: ", err);
    });
  }


  //states population
  $scope.states = [];
  $scope.populateStates = function() {
    var request_popState = $http({
      cache: true,
      url: '/fillStates',
      method: "GET"
    })
    request_popState.success(function(response) {
        var log = [];
        angular.forEach(response.row, function(value, key) {
          $scope.states.push(value.state);
        },log);

    });

    request_popState.error(function(err) {
      // failed
      console.log("populate state error: ", err);
    });

  }

  //par First Language population
  $scope.parFirstLanguage = [];
  $scope.state = [];
  $scope.populateParFirstLanguage = function() {
    var request_pop = $http({
      url: '/predictByFirstLanguage',
      cache: true,
      method: "GET"
    })
    request_pop.success(function(response) {
      var log = [];
      var notStr = "No Response"
      angular.forEach(response.row, function(value, key) {
        if(!(value.first_language === notStr)) {
          $scope.parFirstLanguage.push(value.first_language);
        }
      },log);
    });

    request_pop.error(function(err) {
      // failed
      console.log("populate par first_language id error: ", err);
    });
  }

  $scope.populateParFirstLanguage();
  $scope.populateStates();
});

app.controller('degreeGoalsController', function($scope, $http) {
  //degree goals
  $scope.degGoals = [];
  $scope.populateDegGoals = function() {
    var request_popState = $http({
      cache: true,
      url: '/fillDegGoals',
      method: "GET"
    })
    request_popState.success(function(response) {
        var log = [];
        angular.forEach(response.row, function(value, key) {
          $scope.degGoals.push(value.degree_goal);
        },log);
        console.log(response.row);

    });

    request_popState.error(function(err) {
      // failed
      console.log("populate state error: ", err);
    });
  }

  //states population
  $scope.states = [];
  $scope.populateStates = function() {
    var request_popState = $http({
      cache: true,
      url: '/fillStates',
      method: "GET"
    })
    request_popState.success(function(response) {
        var log = [];
        angular.forEach(response.row, function(value, key) {
          $scope.states.push(value.state);
        },log);

    });

    request_popState.error(function(err) {
      // failed
      console.log("populate state error: ", err);
    });

  }

  $scope.score = [];
  $scope.getScore = function() {
    $scope.headingVisblity = {'visibility': 'visible'};
    var request_pop = $http({
      url: '/predictByDegGoals/' + $scope.goal + '/' + $scope.state,
      cache: true,
      method: "GET"
    })
    request_pop.success(function(response) {
      var log = [];
      var notStr = "No Response"
      angular.forEach(response.row, function(value, key) {
        if(!(value.first_language === notStr)) {
          $scope.score.push(value);
        }
      },log);
      console.log(response);
    });

    request_pop.error(function(err) {
      // failed
      console.log("populate par first_language id error: ", err);
    });
  }

  $scope.populateDegGoals();
  $scope.populateStates();
  //$scope.headingVisbility = {'visibility': 'hidden'};
});

// Template for adding a controller
/*
app.controller('dummyController', function($scope, $http) {
  // normal variables
  var dummyVar1 = 'abc';

  // Angular scope variables
  $scope.dummyVar2 = 'abc';

  // Angular function
  $scope.dummyFunction = function() {

  };
});
*/
