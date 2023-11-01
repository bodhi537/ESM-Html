
(function(){
	//Define application module and set dependencies
	var sharepointmodule = angular.module('trainingWebsite', ['ngSanitize']);

	//Controller
	sharepointmodule.controller('tableController',  function($scope, $http) {
      
 //Check for MOC members
        var nameoflist = "SharepointTraining";
        var traininglistbaseurl = "https://ishareteam1.na.xom.com/sites/INFSPTComz/moc/MOCToolkits/";
      	var sharepointTrainingurl = traininglistbaseurl + "/_api/web/lists/getbytitle('" + nameoflist+ "')/items";
		$http({
			url: sharepointTrainingurl,
			method: "GET",
			headers: { "Accept": "application/json; odata=verbose" }
		 }).then(function mySucces(response) {
             
          var data = response.data.d.results;
          $scope.table = response.data.d.results; 
         console.log(data)
            }, function error(response)  {
           //console.log(response);
		});    
              
    //$scope.tableHead="From Sharepoint";  
               
	});  
})();


//Check for MOC members
var nameoflist = "SharepointTraining";
var traininglistbaseurl = "https://ishareteam1.na.xom.com/sites/INFSPTComz/moc/MOCToolkits/";
var sharepointTrainingurl = traininglistbaseurl + "/_api/web/lists/getbytitle('" + nameoflist + "')/items";
$http({
    url: sharepointTrainingurl,
    method: "GET",
    headers: { "Accept": "application/json; odata=verbose" }
}).then(function mySucces(response) {

    var data = response.data.d.results;
    $scope.table = response.data.d.results;
    console.log(data)
}, function error(response) {
    //console.log(response);
});

        //$scope.tableHead="From Sharepoint";  
