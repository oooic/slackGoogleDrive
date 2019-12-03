function main(){
  var scriptProperties = PropertiesService.getScriptProperties();
  var slackAccessToken = scriptProperties.getProperty("TOKEN");
  var channelsRawData=UrlFetchApp.fetch('https://slack.com/api/channels.list?exclude_archived=true&token='+slackAccessToken)
  var channelsJson = JSON.parse(channelsRawData.getContentText());
  var channels = channelsJson.channels;
  for(var i = 0; i < channels.length; ++i){
   moveFiles(channels[i].id,channels[i].name);
  }
}


function moveFiles(cid,cname){
  var scriptProperties = PropertiesService.getScriptProperties();
  var slackAccessToken = scriptProperties.getProperty("TOKEN");
  var folderId = scriptProperties.getProperty("FOLDER_ID");
  var dateUnix= parseInt(new Date() /1000) ;
  var dateS =dateUnix - 86400-3600;
  var dateE = dateUnix - 3600;
  var filesRawData=UrlFetchApp.fetch('https://slack.com/api/files.list?token='+slackAccessToken+'&channel='+cid+'&count=200&ts_from='+dateS+'&ts_to='+dateE);
  var filesJson = JSON.parse(filesRawData.getContentText());
  var files = filesJson.files;
  
  var rootFolder = DriveApp.getFolderById(folderId);
    // ユーザ名の入ったフォルダに移動
  var targetFolder = rootFolder.getFoldersByName(cname);
    // 対象フォルダがない場合は新しく作成
  if(targetFolder.hasNext() == false){
    var targetFolderId = rootFolder.createFolder(cname);
  } else {
    var targetFolderId = DriveApp.getFolderById(targetFolder.next().getId());
  }
  for(var i = 0; i < files.length; ++i){
    if (files[i].external_type != 'gdrive' && files[i].size<50000000){
      var timestamp = files[i].timestamp;
      var d = new Date(timestamp*1000);
      var date =Utilities.formatDate( d, 'Asia/Tokyo', 'yyyy-MM-dd-hhmm');
      var headers = {
        "Authorization" : "Bearer " + slackAccessToken
      };
      var params2 = {
        "method":"GET",
        "headers":headers
      };
      var dlData = UrlFetchApp.fetch(files[i].url_private, params2).getBlob();
      dlData.setName(date+files[i].name);
      var driveFile = targetFolderId.createFile(dlData);
    }
  }
    Utilities.sleep(100);
}


