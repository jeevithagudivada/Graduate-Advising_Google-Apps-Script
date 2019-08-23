function getScriptUrl() {
 var url = ScriptApp.getService().getUrl();
 return url;
}

function doGet(e) {
  //Logger.log( Utilities.jsonStringify(e) );
  Logger.log(e.parameter.page);
  var pgToLoad = e.parameter.page;

  if (!e.parameter.page) {
    Logger.log('!e.parameter.page')
    // When no specific page requested, return "home page"
    return HtmlService.createTemplateFromFile('home').evaluate().setTitle("ECS Advising")
       .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  }
  Logger.log('there is something for the page');
  // else, use page parameter to pick an html file from the script
  return HtmlService.createTemplateFromFile(pgToLoad).evaluate().setTitle("ECS Advising")
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function doPost(e)
{
  
  if (!e.parameter.page) {
    
  var template = HtmlService.createTemplateFromFile('ThankYou');
  var htmlForm = template.evaluate().setSandboxMode(HtmlService.SandboxMode.NATIVE);
  return htmlForm;
  }
  
  else
  {
    var pgToLoad = e.parameter.page;
    return HtmlService.createTemplateFromFile(pgToLoad).evaluate().setSandboxMode(HtmlService.SandboxMode.NATIVE);
  }
}

  function linkingnew(page)
{
 
 
  Logger.log("returning new fule");
  var html = HtmlService.createTemplateFromFile(page).evaluate()
      .setSandboxMode(HtmlService.SandboxMode.NATIVE).getContent();
  return html;
}
function include(filename) {
 
   return HtmlService.createTemplateFromFile(filename).evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).getContent();
 
}


function include(filename) {
  return HtmlService.createTemplateFromFile(filename)
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .getContent();
 }

function getRandom(){
  return (new Date().getTime()).toString(36);
}

function addData(data){
  Logger.log(data);
  var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1YxqsbWWJtcwamcyyPLzuaijgUrYVHufAgyQq-TN2RtM/edit#gid=0");
  var sheet = ss.getSheetByName('waiverstatus');
  var user = Session.getActiveUser().getEmail();
  var createdDate = Date();
  var newId = getRandom();
  var holder = [data.formdate, data.sname, data.mail, data.cwid, data.course, data.decision, data.feedback, data.coursedate, data.university, data.grade, data.phone, createdDate, newId, user];
  sheet.appendRow(holder);
  sendAnEmail(holder);
  //feedbackDoc(holder);
  return {
      'trackingid': newId
       , 'status': true
       , 'added': holder
  }
  
}

function sendAnEmail(holder) {
            var emailAddress = holder[2] || Session.getActiveUser().getEmail();
            var message = '<h3>Thank you '+holder[1]+' for submitting your Articulation Request for course-'+holder[4]+'</h3>, <br><h1> Your Waiver has been '+holder[5]+'.</h1>';
            var docinfo = DriveApp.getFileById('12o2eWjjEY7Kedt12oZ1D0dW6kiPvOa0nqTlYceH2968');
            var blob = docinfo.getAs('application/pdf');
            MailApp.sendEmail(emailAddress, "Waiver Decision CWID#"+holder[3],'', {
                  htmlBody: message
                , name: 'Articulation Request'
                , attachments: [blob]
            });
        }

/*function feedbackDoc(holder){
   clearFeedback();
   var doc = DocumentApp.openById('12o2eWjjEY7Kedt12oZ1D0dW6kiPvOa0nqTlYceH2968');
   var body = doc.getBody();
   var header = body.insertParagraph(0, "Feedback");
   header.setHeading(DocumentApp.ParagraphHeading.HEADING1);

  var section = body.appendParagraph("Notes : "+ holder[6]);
  section.setHeading(DocumentApp.ParagraphHeading.HEADING2);
  
}*/


function clearFeedback(){
 var doc = DocumentApp.openById('12o2eWjjEY7Kedt12oZ1D0dW6kiPvOa0nqTlYceH2968');
 var body = doc.getBody();
 body.clear();  
}


function uploadFileToGoogleDrive(data, file, name, email) {
  
  try {
    
    var dropbox = "Advising Files";
    var folder, folders = DriveApp.getFoldersByName(dropbox);
    
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(dropbox);
    }
    
var contentType = data.substring(5,data.indexOf(';')),
        bytes = Utilities.base64Decode(data.substr(data.indexOf('base64,')+7)),
        blob = Utilities.newBlob(bytes, contentType, file),
        file = folder.createFolder([email, name].join(" ")).createFile(blob); 
    
    return "OK";   
  } catch (f) {
    return f.toString();
  }
  
}



function retrievaldata(c)
{
    var data = [];
    
    var cwid = parseInt(c);
    var url = "https://docs.google.com/spreadsheets/d/1oXSsMVwus9HO86w8cm5AhtDullDZHkl085pPUvJAyN4/edit#gid=0";
      
    var Sheet = SpreadsheetApp.openByUrl(url);
    var worksheet = Sheet.getSheetByName("StudyPlan");
  
    var dataRange = worksheet.getDataRange();
    var values = dataRange.getValues();
    var valuesList = [];
   Logger.log(values.length);
    for (var j = 1; j < values.length; j++) {
   Logger.log(j);
      if (values[j][0] === cwid) {
        Logger.log("Success");
         for(var i=0; i<values[j].length; i++) {
           if(i==1)
           {
             if(values[j][i]=="")
               valuesList.push("");
             
             else
               valuesList.push(Utilities.formatDate(values[j][i], "GMT", "MM/dd/yyyy"));
           }
           else if(i==74)
           {
             valuesList.push(Utilities.formatDate(values[j][i], "GMT", "MMM/YYYY"));
           }
           else{
             valuesList.push(values[j][i]);}
           Logger.log(values[j][i])
         }
        Logger.log(valuesList);
        return JSON.stringify(valuesList);
      } 
      
  }  
  return null;
}


function retrievalarticulationdata(c)
{
    var data = [];
    var flag1 = false;
    var flag2 = false;
    Logger.log("Called me!!!");
    var cwid = parseInt(c);
    var url = "https://docs.google.com/spreadsheets/d/1YxqsbWWJtcwamcyyPLzuaijgUrYVHufAgyQq-TN2RtM/edit#gid=0";
      
    var Sheet = SpreadsheetApp.openByUrl(url);
    var worksheet = Sheet.getSheetByName("waiverstatus");
  
    var dataRange = worksheet.getDataRange();
    var values = dataRange.getValues();
     var valuesList = ["Rejected","Rejected"];
   
  for (var j = 1; j < values.length; j++) {
    
      if (values[j][3] === cwid && values[j][4] === "CPSC 440") {
        
        if(values[j][5] === "Approved" )
            valuesList[0]="Approved";
        
        flag1 = true;
      }
       else if (values[j][3] === cwid && values[j][4] === "CPSC 462") {
          
        if(values[j][5] === "Approved" )
            valuesList[1]="Approved";
        flag2= true;
      }
      
       
      
    
  } 
  
  Logger.log(valuesList);
  return valuesList;
}



/*

function onSubmit(data)
{
     Logger.log("inside submittttt!!");
     var url = "https://docs.google.com/spreadsheets/d/1u6Fi9Nibg5Yq97igl8TtlFADLf_ywVA4npEv08TXTbA/edit#gid=0";
  
  
      
    var Sheet = SpreadsheetApp.openByUrl(url);
    var worksheet = Sheet.getSheetByName("StudyPlan");
    
    //worksheet.appendRow([data.cwid,data.firstname,data.lastname,data.email,data.course1Number,data.course1Name]);  
    worksheet.appendRow([data.cwid,data.firstname,data.lastname,data.email,data.course1Subject,data.course1Number,data.course1Name,data.course2Subject,data.course2Number,data.course2Name,data.course3Subject,data.course3Number,data.course3Name,data.course4Subject,data.course4Number,data.course4Name,data.course5Subject,data.course5Number,data.course5Name,data.course6Subject,data.course6Number,data.course6Name,data.course7Subject,data.course7Number,data.course7Name,data.course8Subject,data.course8Number,data.course8Name,data.course9Subject,data.course9Number,data.course9Name,data.course10Subject,data.course10Number,data.course10Name]);
  
}*/
function onSubmit(data)
{
    Logger.log("Inside the submitting!!!!!!!!!!!!!!!!!!!!!!!!!1");
     var url = "https://docs.google.com/spreadsheets/d/1oXSsMVwus9HO86w8cm5AhtDullDZHkl085pPUvJAyN4/edit#gid=0";
  Logger.log(data.mon);
    var cwid = parseInt(data.cwid);
    var flag = "false";
    var Sheet = SpreadsheetApp.openByUrl(url);
    var worksheet = Sheet.getSheetByName("StudyPlan");
    var dataRange = worksheet.getDataRange();
    var values = dataRange.getValues();
    var valuesList = [];
    for (var j = 1; j < values.length; j++) {
   
      if (values[j][0] === cwid) {
        flag = "true";
        worksheet.deleteRow(j+1);
        worksheet.appendRow([data.cwid,data.ewpdate,data.firstname,data.lastname,data.email,data.course1Name,data.course1Number,data.course1Grade,data.course1Semester,data.comment1,data.course2Name,data.course2Number,data.course2Grade,data.course2Semester,data.comment2,data.course3Name,data.course3Number,data.course3Grade,data.course3Semester,data.comment3,data.course4Name,data.course4Number,data.course4Grade,data.course4Semester,data.comment4,data.course5Name,data.course5Number,data.course5Grade,data.course5Semester,data.comment5,data.course6Name,data.course6Number,data.course6Grade,data.course6Semester,data.comment6,data.course7Name,data.course7Number,data.course7Grade,data.course7Semester,data.comment7,data.course8Name,data.course8Number,data.course8Grade,data.course8Semester,data.comment8,data.course9Name,data.course9Number,data.course9Grade,data.course9Semester,data.comment9,data.course10Name,data.course10Number,data.course10Grade,data.course10Semester,data.comment10,data.Check1,data.Check2,data.Check3,data.Check4,data.Check5,data.Check6,data.Check7,data.Check8,data.Check9,data.Check10,data.Check11,data.Check12,data.Check13,data.Check14,data.Check15,data.Check16,data.Check17,data.Check18,data.from,data.mon,data.undermajor,data.ewpcourse1Name,data.ewpcourse1Number,data.ewpcourse1Grade,data.ewpcourse1Semester,data.ewpcomment1]);
        
        break;
         
      }}
  if(flag === "false"){
   
    //worksheet.appendRow([data.cwid,data.firstname,data.lastname,data.email,data.course1Number,data.course1Name]);  
       worksheet.appendRow([data.cwid,data.ewpdate,data.firstname,data.lastname,data.email,data.course1Name,data.course1Number,data.course1Grade,data.course1Semester,data.comment1,data.course2Name,data.course2Number,data.course2Grade,data.course2Semester,data.comment2,data.course3Name,data.course3Number,data.course3Grade,data.course3Semester,data.comment3,data.course4Name,data.course4Number,data.course4Grade,data.course4Semester,data.comment4,data.course5Name,data.course5Number,data.course5Grade,data.course5Semester,data.comment5,data.course6Name,data.course6Number,data.course6Grade,data.course6Semester,data.comment6,data.course7Name,data.course7Number,data.course7Grade,data.course7Semester,data.comment7,data.course8Name,data.course8Number,data.course8Grade,data.course8Semester,data.comment8,data.course9Name,data.course9Number,data.course9Grade,data.course9Semester,data.comment9,data.course10Name,data.course10Number,data.course10Grade,data.course10Semester,data.comment10,data.Check1,data.Check2,data.Check3,data.Check4,data.Check5,data.Check6,data.Check7,data.Check8,data.Check9,data.Check10,data.Check11,data.Check12,data.Check13,data.Check14,data.Check15,data.Check16,data.Check17,data.Check18,data.from,data.mon,data.undermajor,data.ewpcourse1Name,data.ewpcourse1Number,data.ewpcourse1Grade,data.ewpcourse1Semester,data.ewpcomment1]);
          
  
  }
        var subject = 'Summary of the study plan';
        message = "<b>";
        var message = 'Dear '+ data.firstname + ' ' + data.lastname+ ',\n';
        message += "</b><br>";
       
        message += 'Follwoing is the summary of the study plan\n\n';
        message += "<table style='width:50%;  border: 1px solid black;  border-collapse: collapse;'>";
        message += "<tr style='border: 1px solid black;  border-collapse: collapse;'>";
        message += "<th style='border: 1px solid black;  border-collapse: collapse;'> Course Name</th>";
        message += "<th style='border: 1px solid black;  border-collapse: collapse;'> Course ID</th>";
        message += "<th style='border: 1px solid black;  border-collapse: collapse;'> Semester</th>";
        message += "<th style='border: 1px solid black;  border-collapse: collapse;'> Comments</th>";
        message += "</tr>";
     
        message += "<tr style='border: 1px solid black;  border-collapse: collapse;'>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.course1Name + "</td>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.course1Number + "</td>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.course1Semester + "</td>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.comment1 + "</td>";
        message += "</tr>";
        
        message += "<tr style='border: 1px solid black;  border-collapse: collapse;'>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.course2Name + "</td>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.course2Number + "</td>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.course2Semester + "</td>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.comment2 + "</td>";
        message += "</tr>";
   
         message += "<tr style='border: 1px solid black;  border-collapse: collapse;'>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.course3Name + "</td>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.course3Number + "</td>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.course3Semester + "</td>";
          message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.comment3 + "</td>";
        message += "</tr>";
  
         message += "<tr style='border: 1px solid black;  border-collapse: collapse;'>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.course4Name + "</td>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.course4Number + "</td>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.course4Semester + "</td>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.comment4 + "</td>";
        message += "</tr>";
  
         message += "<tr style='border: 1px solid black;  border-collapse: collapse;'>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.course5Name + "</td>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.course5Number + "</td>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.course5Semester + "</td>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.comment5 + "</td>";
        message += "</tr>";
         
         message += "<tr style='border: 1px solid black;  border-collapse: collapse;'>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.course6Name + "</td>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.course6Number + "</td>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.course6Semester + "</td>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.comment6 + "</td>";
        message += "</tr>";
        
        message += "<tr style='border: 1px solid black;  border-collapse: collapse;'>";
  message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.course7Name + "</td>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.course7Number + "</td>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.course7Semester + "</td>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.comment7 + "</td>";
        message += "</tr>";
   
         message += "<tr style='border: 1px solid black;  border-collapse: collapse;'>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.course8Name + "</td>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.course8Number + "</td>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.course8Semester + "</td>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.comment8 + "</td>";
        message += "</tr>";
  
         message += "<tr style='border: 1px solid black;  border-collapse: collapse;'>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.course9Name + "</td>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.course9Number + "</td>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.course9Semester + "</td>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.comment9 + "</td>";
        message += "</tr>";
  
         message += "<tr style='border: 1px solid black;  border-collapse: collapse;'>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.course10Name + "</td>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.course10Number + "</td>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.course10Semester + "</td>";
        message += "<td style='border: 1px solid black;  border-collapse: collapse;'>" + data.comment10 + "</td>";
        message += "</tr>";
        message += "</tr>";
  message += "</table>";
  //MailApp.sendEmail( data.email, subject,message);
 
  
  MailApp.sendEmail({
    to: data.email,
    subject: subject,
    htmlBody: message
  });
 
}