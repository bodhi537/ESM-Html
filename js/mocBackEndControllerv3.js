
(function(){
	var app = angular.module('mocWebsite', ['ngSanitize','angular.filter']);
    
	app.controller('mocController',  function($scope, $http) { 
    var projectName = $(".projectName").val();
    var projectLink = $(".projectLink").val();
    var projectGate = $(".projectGate").val();
    var projectScope = $(".projectScope").val();
    var baseUrl = "https://ishareteam1.na.xom.com";    
    var siteUrl = "https://ishareteam1.na.xom.com/sites/INFSPTComz/moc/MOCToolkits/";   
    var authenticationUrl = siteUrl + "/_api/contextinfo";
    var requestList = "Requests";
    var projectlist = "MOCProjects";
    var url =  siteUrl + "/_api/web/lists/getbytitle('"+ requestList +"')/items";
    var mocProjectsList =  siteUrl + "/_api/web/lists/getbytitle('"+ projectlist +"')/items";
    var mocLeadList = "MocLeads";
    var mocLeadUrl = siteUrl + "/_api/web/lists/getbytitle('"+ mocLeadList +"')/items";
    var userNames = [];
    var projectNames = [];
    var userData = []; 
    var AssignedMOCProjects = 0;
    var TimeWritingMOCProjects = 0;
    var openMOCProjects = 0;
    var droppedMOCProjects = 0;
    var uploadedMOCPlans = 0;
    var NotuploadedMOCPlans = 0;
    var projectImpactless100 = 0;
    var projectImpact1000 = 0; 
    var projectImpact1000plus = 0; 
    var projectImpact100to1000 = 0;
    var numberOfGuides=0; 
    var numberOfEmail=0;
    var numberOfVideo=0;
    var numberOfITArticle=0;
    var numberOfSurveys=0;
    var pregate = 0;
    var gate1 = 0;
    var gate2 = 0;
    var gate3 = 0;


    $http({
			url:"https://ticket/api/user" ,
			method: "GET",
			headers: { 
                "Accept": "application/json; odata=verbose",
                "Access-Control-Allow-Origin":"*"
         }
		 }).then(function mySuccess(response) { 
        var userInfoEmail = $scope.userInfoEmail = response.data.Email_Address;
        var userFirstName = $scope.userFirstName = response.data.First_Name;
        var userLastName = $scope.userLastName = response.data.Last_Name;
        var userFullName = $scope.userFullName = response.data.Full_Name;
        angular.element(".welocmepicdiv").show();
        $scope.welcomeName = response.data.First_Name;
        $scope.userEmail = userInfoEmail;
        authenticateMocLead (mocLeadList);  
     $(".open-map").click(function () { 
        $("#roadmap").show();
        $(".close-map").click(function () {
            $("#roadmap").hide();
        });
    });

    $(".analyzeproject").click(function () {
         console.log($scope.testdate,$scope.ProjectDescription,$scope.ProjectStartDate,$scope.ProjectEndDate);
        if (!$scope.projectName || !$scope.projectScope || !$scope.projectGate) {         
            submitError();
            } else {
                 var fieldItems = ({
                "ProjectName":$scope.projectName,
                "ProjectScope":$scope.projectScope,
                "ProjectLink":$scope.projectLink,
                "ProjectDescription":$scope.projectDescription,
                "ProjectStartDate":$scope.projectStartDate,
                "ProjectEndDate":$scope.projectend,
                "projectGate":$scope.projectGate
                 });
                 console.log(fieldItems);
                 loadAndPost($scope.projectName,$scope.projectLink,$scope.projectGate,$scope.projectScope,fieldItems.ProjectDescription,fieldItems.ProjectStartDate,fieldItems.ProjectEndDate,url);
            }
    });


   
    function submitError() {
        var projectName = $(".projectName").css("border-color", "red");
        var projectGate = $(".projectGate").css("border-color", "red");
        var projectScope = $(".projectScope").css("border-color", "red");
        alert("You left some fields empty");
    }


    function loadAndPost(projectName,projectLink,projectGate,projectScope,projectDescription,projectStartDate,projectEndDate,url) {

        $(".em-c-text-passage--small").hide();
        $(".em-c-loader").show();
        setTimeout(function () {
            $(".em-c-loader").hide();
            $(".moc-plan-image").show();
            $(".letsmeetyourproject").html("Thank you for your submission, We will be in contact with you soon");
        }, 2000)
      authenticateSP (authenticationUrl,url).then(function(response){   
      postToSp (response,projectName,projectLink,projectGate,projectScope,projectDescription,projectStartDate,projectEndDate,url);  
      });
    }

    $scope.AddProject = function (projectName,projectLink,projectGate,projectScope,projectDescription,projectStartDate,projectend,timewriting) {
        console.log("Add project clieked");
        $(".em-c-text-passage--small").hide();
        $(".em-c-loader").show();
        setTimeout(function () {
            $(".em-c-loader").hide();
            $(".moc-plan-image").show();
            $(".letsmeetyourproject").html("Thank you for your submission, We will be in contact with you soon");
        }, 2000)
      authenticateSP (authenticationUrl,url).then(function(response){   
      runFunctionToAddAProject (response,projectName,projectLink,projectGate,projectScope,projectDescription,projectStartDate,projectend,timewriting);  
      });
    }


    function noMOCRequired() {    
            $(".em-c-text-passage--small").hide();
            $(".em-c-loader").show();
            setTimeout(function () {
                $(".em-c-loader").hide();
                $(".letsmeetyourproject").html("No MOC Plan is required for your project");
            }, 2000);
    }

  $(".get-started").click(function () {
        $("#projectAnalysisModal").show();
        $(".em-c-modal__close-btn").click(function () {
        $("#projectAnalysisModal").hide();
        });
    });



function authenticateSP (authenticationUrl,url){
       var getData = $http({
			 url: authenticationUrl,
             method: "POST",
             headers: { "Accept": "application/json; odata=verbose",
             "Access-Control-Allow-Origin":"*"
             }
		 }).then(function mySuccess(response) { 
           return response;
         });
     return getData;
  };


  //BUTTON Click FOR ASSIGN REQUEST
	 $scope.runAssignRequest = function (rID,Uri,userInfoEmail){
		authenticateSP (authenticationUrl,url).then(function(response){  
				 AssignRequest(response,rID,Uri,userInfoEmail);         
		  });		  
	}  	

 $scope.closeAssignRequest = function (rID,Uri,userInfoEmail){
		authenticateSP (authenticationUrl,url).then(function(response){  
				 CloseRequest(response,rID,Uri,userInfoEmail);         
		  });		  
	} 

 $scope.deleteProject = function (rID,Uri){
     console.log("Delete");
		authenticateSP (authenticationUrl,url).then(function(response){  
				 DeleteProjectFromList(response,rID,Uri);         
		  });		  
	} 

    $scope.manageProject = function (){
		  $scope.showManageArea = true;
          $scope.showManageButton = false;
	} 

    $scope.openAssignRequest = function (rID,Uri,userInfoEmail){
		authenticateSP (authenticationUrl,url).then(function(response){  
				 OpenRequest(response,rID,Uri,userInfoEmail);         
		  });		  
	}  	
 	

    //***************************************************** ASSIGN A REQUEST TO MYSELF **********************************************************
	 function AssignRequest(response,RequestID,Uri,userInfoEmail){	
	  // console.log("AssignRequest is now running..." + RequestID + "Full_name: " + $scope.userFirstName);   					   
	  	     $http({ 
                    url:siteUrl + "_api/web/lists/getbytitle('"+ requestList +"')/getItemById(" + RequestID + ")",
                    method: "PATCH",
					data: JSON.stringify({__metadata: {'uri': Uri,'type': 'SP.Data.'+ requestList +'ListItem' },
                    MocTeamMemberAssigned : $scope.userFirstName +" " + $scope.userLastName,			
			        Status: 'Assigned',
                    MocLeadEmail: userInfoEmail          
					}),
                    headers: {
                    "accept": "application/json;odata=verbose",
                    "X-RequestDigest": response.data.d.GetContextWebInformation.FormDigestValue,
                    "content-Type": "application/json;odata=verbose",
                    "Access-Control-Allow-Origin":"*",
                    "X-HTTP-Method": "PATCH",
                    "If-Match": "*"}
		       }).then(function mySuccess(response) {
                   //alert("Assigned to you"); 
                  location.reload();
             });
	};

 //***************************************************** CLOSE REQUEST **********************************************************
	 function CloseRequest(response,RequestID,Uri,userInfoEmail){	
	  // console.log("AssignRequest is now running..." + RequestID + "Full_name: " + $scope.userFirstName);   					   
	  	     $http({ 
                    url:siteUrl + "_api/web/lists/getbytitle('"+ requestList +"')/getItemById(" + RequestID + ")",
                    method: "PATCH",
					data: JSON.stringify({__metadata: {'uri': Uri,'type': 'SP.Data.'+ requestList +'ListItem' },
                    ClosedBy: $scope.userFirstName +" " + $scope.userLastName,			
			        Status: 'Closed',
                    MocLeadEmail: userInfoEmail          
					}),
                    headers: {
                    "accept": "application/json;odata=verbose",
                    "X-RequestDigest": response.data.d.GetContextWebInformation.FormDigestValue,
                    "content-Type": "application/json;odata=verbose",
                    "Access-Control-Allow-Origin":"*",
                    "X-HTTP-Method": "PATCH",
                    "If-Match": "*"}
		       }).then(function mySuccess(response) {
                   //alert("Assigned to you"); 
                  location.reload();
             });
	};

	 function DeleteProjectFromList(response,RequestID,Uri){						   
	  	     $http({ 
                    url:siteUrl + "_api/web/lists/getbytitle('"+ requestList +"')/getItemById(" + RequestID + ")",
                    method: "DELETE",
					data: JSON.stringify({__metadata: {'uri': Uri,'type': 'SP.Data.'+ requestList +'ListItem' }
					}),
                    headers: {
                    "accept": "application/json;odata=verbose",
                    "X-RequestDigest": response.data.d.GetContextWebInformation.FormDigestValue,
                    "content-Type": "application/json;odata=verbose",
                    "X-HTTP-Method": "DELETE",
                    "If-Match": "*"}
		       }).then(function mySuccess(response) {
                  location.reload();
             });
	};

 //***************************************************** OPEN REQUEST **********************************************************
	 function OpenRequest(response,RequestID,Uri,userInfoEmail){	
	  // console.log("AssignRequest is now running..." + RequestID + "Full_name: " + $scope.userFirstName);   					   
	  	     $http({ 
                    url:siteUrl + "_api/web/lists/getbytitle('"+ requestList +"')/getItemById(" + RequestID + ")",
                    method: "PATCH",
					data: JSON.stringify({__metadata: {'uri': Uri,'type': 'SP.Data.'+ requestList +'ListItem' },
                    ClosedBy: $scope.userFirstName +" " + $scope.userLastName,			
			        Status: 'Open',
                    MocLeadEmail: userInfoEmail          
					}),
                    headers: {
                    "accept": "application/json;odata=verbose",
                    "X-RequestDigest": response.data.d.GetContextWebInformation.FormDigestValue,
                    "content-Type": "application/json;odata=verbose",
                    "X-HTTP-Method": "PATCH",
                    "If-Match": "*"}
		       }).then(function mySuccess(response) {
                   //alert("Assigned to you"); 
                  location.reload();
             });
	};

//(response,projectName,projectLink,projectGate,projectScope,projectDescription,projectStartDate,projectEndDate,url)
  function postToSp (response,projectName,projectLink,projectGate,projectScope,ProjectDescription,ProjectStartDate,ProjectEndDate,url){          
   $http({
			 url:url,
             method: "POST",
             data: JSON.stringify({__metadata: { 'type': 'SP.Data.'+ requestList +'ListItem' },
              "Title": projectName,
              "Category":projectLink,
              "Gate":projectGate, 
              "peopleImpacted":projectScope,
              "projectDescription":ProjectDescription,
              "ProjectStartDate":ProjectStartDate,
              "ProjectEndDate":ProjectEndDate,
              "projectCreatedBy":$scope.welcomeName + " "+  userLastName,
              "Status":"Open"}),
             headers: { "Accept": "application/json; odata=verbose",
              "content-Type": "application/json;odata=verbose",
              "X-RequestDigest": response.data.d.GetContextWebInformation.FormDigestValue
             }
		 }).then(function mySuccess(response) { 
            console.log("Posted"); 
            var body = "<p> The project: "+ projectName+ " has been submitted on the MOC web application</p>";
            var recipient = userInfoEmail;
            var contactperson = userInfoEmail;
            var mocAssignees = "erzsebet.atzel@exxonmobil.com";
            var mocAdvisor = "bard.fossen@exxonmobil.com";
            var mocDeveloper = "davies.c.iyiegbu@exxonmobil.com";
            //var mocTest = "ali.bayramli@exxonmobil.com";
            var subject = projectName + " has been submitted on the MOC Portal";
            SendMail(recipient, subject, body, contactperson);
            SendMail(mocAssignees, subject, body, contactperson);
            SendMail(mocAdvisor, subject, body, contactperson);
            SendMail(mocDeveloper, subject, body, contactperson);
            //SendMail(mocTest, subject, body, contactperson);
           return response;
         },function error(response){
                console.log("there is a problem");
                console.log(response);
         });
  }

   function runFunctionToAddAProject (response,projectName,projectLink,projectGate,projectScope,ProjectDescription,ProjectStartDate,ProjectEndDate,url){          
   $http({
			 url:mocProjectsList,
             method: "POST",
             data: JSON.stringify({__metadata: { 'type': 'SP.Data.'+ projectlist +'ListItem' },
              "Title": projectName,
              "Category":projectLink,
              "Gate":projectGate, 
              "peopleImpacted":projectScope,
              "projectDescription":ProjectDescription,
              "ProjectStartDate":ProjectStartDate,
              "ProjectEndDate":ProjectEndDate,
              "projectCreatedBy":$scope.welcomeName + " "+  userLastName,
              "Status":"ASSIGNED"}),
             headers: { "Accept": "application/json; odata=verbose",
              "content-Type": "application/json;odata=verbose",
              "X-RequestDigest": response.data.d.GetContextWebInformation.FormDigestValue
             }
		 }).then(function mySuccess(response) { 
            console.log("Email sent"); 
            var body = "<p> Your project: "+ projectName+ " has been added on the MOC web application, you can edit your project by clicking on the edit button.</p>";
            var recipient = userInfoEmail;
            var subject = projectName + " has been submitted on the MOC Portal";
            SendMail(recipient, subject, body);
           return response;
         },function error(response){
                console.log("there is a problem");
                console.log(response);
         });
  }; 


function authenticateMocLead (mocLeadList){
    $http({
			 url:mocLeadUrl,
             method: "GET",
             headers: { "Accept": "application/json; odata=verbose",
              "content-Type": "application/json;odata=verbose",
             }
		 }).then(function mySuccess(response) { 
           var mocLeads = $scope.mocLeads = response.data.d.results;
           for (var x=0; x<mocLeads.length; x++){
               var allMocLeads = mocLeads[x];
             if (userInfoEmail == allMocLeads.Email){
                //console.log(allMocLeads.Email);
                $scope.showMocTools = true;
             } else {
                 //console.log("You are not an MOC Team Member");
             } 
           } //end loop  
         });    
}


$scope.showProjectDetails = function (project){
  $("#detailsModal").show(); 
  $(".JIPDescription").html(project.projectDescription);
  $(".JIPStartDate").html(project.ProjectStartDate); 
  $(".JIPEndDate").html(project.ProjectEndDate); 
};

$scope.closeDetailsModal = function (){
$("#detailsModal").hide();
//location.reload();
};

$scope.logProprties = function(prop){
		console.log(prop);
	}
    
$scope.countCommunication = function(communicationProperties,Title){
   var count = 0;
    for (var i = 0; i < array.length; i++) {
        if (array[i] === Title) {
            count++;
        }
    }
    return count;
   }


$scope.createLink = function (actualLink,communicationName,surveyLink,creatorEmail,mocLead,communicationType,notificationLimit){
$scope.linkCreated = true;
console.log(surveyLink);
  authenticateSP (authenticationUrl,url).then(function(response){   
     postLinkToList(response,'MocCommunicationsMetrics',communicationName,mocLead,surveyLink,'Created',actualLink,communicationType,creatorEmail);
  });
};


 function postLinkToList(response,listName,communicationName,mocLead,surveyLink,Clicked,actualLink,communicationType,creatorEmail){	
				   
	  	     $http({ 
                    url:siteUrl + "_api/web/lists/getbytitle('"+ listName +"')/items",
                    method: "POST",
					data: JSON.stringify({__metadata: {'type': 'SP.Data.'+ listName +'ListItem' },
                    Title : communicationName,
                    CommunicationName:communicationName,
                    UserName:mocLead,
                    MocLead:mocLead,
                    surveyLink:surveyLink,
                    Clicked:Clicked,
                    numberOfHits:"0",
                    communicationLink:actualLink,
                    communicationType:communicationType,
                    creatorEmail:creatorEmail          
					}),
                    headers: {
                    "accept": "application/json;odata=verbose",
                    "X-RequestDigest": response.data.d.GetContextWebInformation.FormDigestValue,
                    "content-Type": "application/json;odata=verbose"}
		       }).then(function mySuccess(response) {
                  console.log(response.data.d.ID +"Name: "+ response.data.d.CommunicationName); //If Item created OK? Then fire another function to get the ID of the last item ordered by create date
                  $scope.finalLink = "https://spsharing1.exxonmobil.com/sites/ITOPMOC/WebApplications/CANV3.0/index.html#!/communication/" + response.data.d.ID;
                  //statusText"Created"
                 //getLastCreatedLinkAndShowToUser(listName, creatorEmail);
             });
	};

  /**********************************************************************************************************************************************************
	 * CUSTOM EMAILS SECTION																													    		  *
	 * THIS SESSION CONTAINS DEFINITIONS FOR SENDING CUSTOM EMAILS																		      				  *	 **********************************************************************************************************************************************************/	
		function SendMail(recipient, subject, body, pmemail){
		 //console.log("SendMail is running..." + recipient);
		 
		  var requestData;	  
		  var mailURL = "https://apigateway.na.xom.com:4443/apps-tech-ais/smtp/v1/api/email";
		   requestData = {
			  "Subject": subject,
			  "Body": {
				"ContentType": "text/html",
				"Content": "<font face='calibri'> <br /> </b>" + body + "<br /><a href='https://spsharing1.exxonmobil.com/sites/ITOPMOC/WebApplications/MocApp/projectrequests.html'> View Submission</a>"+"<br /><br /> Contact Email: "+ pmemail +"<br /><br /> Sent from, <br /> <b>MOC Web App</b> </font>"
			  },
			  "From": "ITOP-MOC-Web-App@exxonmobil.com",
			  "ToRecipients": [ recipient ]
		   };	
		   var config = {
					 headers: {
					 "Content-Type": "application/json; odata=verbose",
					 "Accept": "application/json; odata=verbose",
					 "client_id" : "3d229316128c49ae97933cdf1f523026",
					 "client_secret" : "55504C040f8948908B021Ac3DC3d65da"
			   }			  
			};	
			 $http.post (mailURL, JSON.stringify(requestData), config).then(function (data) {
				   $scope.submitSuccess=true;	
			 },function(error){
				   console.log("failed", error);
				   $scope.submitError=true;
			 });	
		}

 }); //End Tickets Api


function getLastCreatedLinkAndShowToUser(listName, Email){
		var ColumnName = "creatorEmail";
        var ValueName = Email;
		var filterbyColumn = "$filter=" + ColumnName + " eq '" + ValueName + "'";

		   $http ({
				 url: siteUrl +  "_api/web/lists/getbytitle('" + listName + "')/items?$orderby=Created desc&$top=2000",
				 method: "GET",
				 headers: {
				 "Content-Type": "application/json; odata=verbose",
				 "Accept": "application/json; odata=verbose"
				 }
		  }).success(function (response) {	
            $scope.linkID = response.d.results[0].ID;
             $scope.finalLink = "I ran to this place without issues";
            console.log("The current link ID is: "+ $scope.linkID);	  
		  }).error(function (err) {
			 console.log('Could not retrieve list items', err);
		  });	
	}






    /******************************GET A LIST OF RECORDS BASED ON COLUMNNAME AND ITS VALUE **********************************/
	$scope.GetDataByCriteria = function(ListName, ColumnName, ValueName){
		console.log("Get Data By Criteria for the list name updateddd: " + ListName);
		var filterbyColumn = "$filter=" + ColumnName + " eq '" + ValueName + "'";

		   $http ({
				 url: siteUrl +  "_api/web/lists/getbytitle('" + ListName + "')/items?$orderby=Created desc&$top=2000",
				 method: "GET",
				 headers: {
				 "Content-Type": "application/json; odata=verbose",
				 "Accept": "application/json; odata=verbose",
                 "Access-Control-Allow-Origin":"*"
				 }
		  }).success(function (response) {	
             $scope.showManageButton = true; 		  
			  if (response.d.results.length >= 1){
				  if(ListName == "Requests") {
			 $scope.RequestsByStatus = response.d.results;
             for (var x = 0; x<$scope.RequestsByStatus.length; x++){
               projectNames.push($scope.RequestsByStatus[x].Title)
               if($scope.RequestsByStatus[x].MocTeamMemberAssigned){
                   var returnData = isUserExistsInList($scope.RequestsByStatus[x].MocTeamMemberAssigned, userNames);
                   var isExist = returnData.isExist;
                   var indexx = returnData.index;
                   if(isExist){
                       var lastCount = userData[indexx];
                       lastCount +=1;
                       userData[indexx] = lastCount;
                   }
                   else{
                       
                        userNames.push($scope.RequestsByStatus[x].MocTeamMemberAssigned);
                        userData.push(1);
                   }
                
               }
               switch ($scope.RequestsByStatus[x].peopleImpacted) {
                        case "100 - 1000":
                            projectImpact100to1000++
                            break;
                        case "1000+":
                          projectImpact1000plus++;
                            break;
                        case "<100 ":
                            projectImpactless100++;
                        break;
                    }

                    //Gate
                       switch ($scope.RequestsByStatus[x].Gate) {
                        case "Pregate":
                            pregate++
                            break;
                        case "Gate 1":
                          gate1++;
                            break;
                        case "Gate 2":
                            gate2++;
                        break;
                        case "Gate 3":
                            gate3++;
                        break;
                    }
                      }	//End loop	
                createHighestSubmissionChart(userNames,userData);
                projectsSubmitted(projectNames,userData);
                createChartRequestStatus(projectImpactless100,projectImpact1000plus,projectImpact100to1000);
                createGateChart(pregate,gate1,gate2,gate3);

				  } else if(ListName == "MOCProjects") {
					$scope.MOCProjects = response.d.results;
                    for (var x = 0; x<$scope.MOCProjects.length; x++){
                    switch ($scope.MOCProjects[x].Status) {
                        case "Assigned":
                            AssignedMOCProjects++
                            break;
                        case "Closed":
                          droppedMOCProjects++;
                            break;
                        case "Open":
                            openMOCProjects++;

                            break;
                    }      
                    }	//End loop

                    CreateCharts ();
				  } else if(ListName == "MocCommunicationsMetrics"){
					$scope.communicationProperties = response.d.results;
                    for (var x = 0; x<$scope.communicationProperties.length; x++){
                    //Communication Type Data    
                    switch ($scope.communicationProperties[x].communicationType) {
                        case "Guide":
                            numberOfGuides++
                            break;
                        case "Email":
                          numberOfEmail++;
                            break;
                        case "Video":
                            numberOfVideo++;
                        break;
                        case "ITArticle":
                            numberOfITArticle++;
                            break;
                        case "Survey":
                            numberOfSurveys++;
                            break;
                    }
             
                    }	//End loop
        createBarChartforCommunications(numberOfGuides,numberOfEmail,numberOfVideo,numberOfITArticle,numberOfSurveys);
                   						  
				  }		
				  else {
					$scope.FeedbacksByStatus = response.d.results;							  
				  }				  
			  }			  
		  }).error(function (err) {
			 console.log('Could not retrieve list items', err);
		  });	
	}
 

function CreateCharts (UploadedMocPlans,AssignedProjects,DroppedProjects,UnAssignedProjects) {
    if (document.getElementById("pie-chart-sum") != null) {
        new Chart(document.getElementById("pie-chart-sum"), {
            type: 'pie',
            data: {
                labels: ["ASSIGNED PROJECTS","UNASSIGNED","DROPPED", "UPLOADED MOC PLANS"],
                datasets: [{
                    label: "Number of dossiers",
                    backgroundColor: ["#00A3E0", "#002F6C","#A6192E","#F2AC33"],
                    data: [AssignedMOCProjects,1,droppedMOCProjects,1]
                }]
            },
            options: {
                legend: {
                    labels: {
                        fontSize: 18
                    }
                },
                title: {
                    display: true,
                    fontSize: 24,
                    text: 'PROJECTS STATUS'
                }
            }
        });  
    }

   }

function createBarChartforCommunications(numberOfGuides,numberOfEmail,numberOfVideo,numberOfITArticle,numberOfSurveys){
     if (document.getElementById("bar-chart") != null) {
    new Chart(document.getElementById("bar-chart"), {
     type: 'bar',
     data: {
       labels: ["Guides", "Email", "Video", "IT Article", "Surveys"],
       datasets: [
         {
           label: "Number of deliverables",
           backgroundColor: ["#00A3E0", "#002F6C","#00A14D","#ED8B00","#BD2F7F"],
           data: [numberOfGuides,numberOfEmail,numberOfVideo,numberOfITArticle,numberOfSurveys]
         }
       ]
     },
     options: {
       legend: { display: false },
       title: {
         display: true,
         text: 'DELIVERABLE TYPE',
         fontSize: 24
       },

       scales: {
             yAxes: [{
                 ticks: {
                     beginAtZero:true
                 }
             }]
         }

     }


 });
 }
}

function isUserExistsInList(username, listNames){
                   for(var i = 0; i < listNames.length; i++){
                       if(listNames[i] === username){

                           return {"isExist": true, "index": i};
                       }
                   }
                   return {"isExist": false, "index": 0};
               }
             
function createHighestSubmissionChart(userNames,userData){
    console.log(userData);//user
     if (document.getElementById("highest-user-bar-chart") != null) {
    new Chart(document.getElementById("highest-user-bar-chart"), {
     type: 'bar',
     data: {
       labels: userNames,
       datasets: [
         {
           label: "Number of Requests Assigned",
           backgroundColor: ["#00A3E0", "#002F6C","#00A14D","#ED8B00","#BD2F7F"],
           data: userData
         }
       ]
     },
     options: {
       legend: { display: false },
       title: {
         display: true,
         text: 'ASSIGNED PROJECT REQUESTS',
         fontSize: 24
       },

       scales: {
             yAxes: [{
                 ticks: {
                     beginAtZero:true
                 }
             }]
         }

     }


 });
 }
}

function projectsSubmitted(projectNames,userData){
if (document.getElementById("projects-submitted-pie-chart") != null) {
        new Chart(document.getElementById("projects-submitted-pie-chart"), {
            type: 'pie',
            data: {
                labels: projectNames,
                datasets: [{
                    label: "projects",
                    backgroundColor: ["#007096", "#F05822","#00A14D","#00ACA8"],
                    data: userData
                }]
            },
            options: {
                legend: {
                    labels: {
                        fontSize: 18
                    }
                },
                title: {
                    display: true,
                    fontSize: 24,
                    text: 'PROJECTS SUBMITTED'
                }
            }
        });  
    }
}

function createChartRequestStatus(projectImpactless100,projectImpact1000plus,projectImpact100to1000){
    console.log(projectImpactless100,projectImpact1000plus,projectImpact100to1000);
 if (document.getElementById("people-impacted-bar-chart") != null) {
    new Chart(document.getElementById("people-impacted-bar-chart"), {
     type: 'bar',
     data: {
       labels: ["<100", "100-1000", "1000+"],
       datasets: [
         {
           label: "Number of projects",
           backgroundColor: ["#00A3E0", "#002F6C","#00A14D","#ED8B00","#BD2F7F"],
           data: [projectImpactless100,projectImpact100to1000,projectImpact1000plus]
         }
       ]
     },
     options: {
       legend: { display: false },
       title: {
         display: true,
         text: 'PEOPLE IMPACT',
         fontSize: 24
       },

       scales: {
             yAxes: [{
                 ticks: {
                     beginAtZero:true
                 }
             }]
         }

     }


 });
 }

}

function createGateChart(pregate,gate1,gate2,gate3){
if (document.getElementById("gate-pie-chart-sum") != null) {
        new Chart(document.getElementById("gate-pie-chart-sum"), {
            type: 'pie',
            data: {
                labels: ["PREGATE","GATE 1","GATE 2", "GATE 3"],
                datasets: [{
                    label: "Number of gates",
                    backgroundColor: ["#007096", "#F05822","#00A14D","#00ACA8"],
                    data: [pregate,gate1,gate2,gate3]
                }]
            },
            options: {
                legend: {
                    labels: {
                        fontSize: 18
                    }
                },
                title: {
                    display: true,
                    fontSize: 24,
                    text: 'PROJECT BY GATES'
                }
            }
        });  
    }
};
   $scope.expiration = function(submissionDate){
        var tm = submissionDate;
        var actualDate = tm.substring(0,10)
        var todayActualDate = JSON.stringify(new Date());
        todayActualDate = todayActualDate.substring(1,11)
        var millisecondsPerDay = 1000 * 60 * 60 * 24;
        function dateDiffInDays(date1, date2) {
            var utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
            var utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
            return Math.floor((utc2 - utc1) / millisecondsPerDay);
        }
        var createdDate = new Date(actualDate);//debug ("2018-01-01")
        var todayDate = new Date(todayActualDate);
        var difference = dateDiffInDays(createdDate, todayDate);
         if (difference >=30){
            var availbleForAssign = true;   
         }  else {
            var availbleForAssign = false;
         }
           return  availbleForAssign;
      } 

       $scope.daysLeft = function(submissionDate){
       
        var tm = submissionDate;
        var actualDate = tm.substring(0,10)
        var todayActualDate = JSON.stringify(new Date());
        todayActualDate = todayActualDate.substring(1,11)
        var millisecondsPerDay = 1000 * 60 * 60 * 24;
        function dateDiffInDays(date1, date2) {
            var utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
            var utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
            return Math.floor((utc2 - utc1) / millisecondsPerDay);
        }
        var createdDate = new Date(actualDate);//debug ("2018-01-01")
        var todayDate = new Date(todayActualDate);
        var difference = dateDiffInDays(createdDate, todayDate);
        return  difference;
      }  
	});

     app.directive('copyToClipboard', function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                elem.click(function () {
                    if (attrs.copyToClipboard) {
                        var $temp_input = $("<input>");
                        $("body").append($temp_input);
                        $temp_input.val(attrs.copyToClipboard).select();
                        document.execCommand("copy");
                        $temp_input.remove();
                    }
                });
            }
        };
    });
})();