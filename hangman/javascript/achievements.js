var stats = [];
var stat_names = [];
var achieve = [];
var achieve_stages = [];
var achieve_criteria = [];
var achieve_timeouts = [];

// Is loaded from DB loadRecords
/*
stats['gamesplayed'] = 0;
stats['gameswon'] = 0;
stats['gameslost'] = 0;
stats['totaltime'] = 0;
stats['shortestwinningtime'] = 10000000;
stats['longestwinningtime'] = 0;
stats['totalscore'] = 0;
stats['totalmistakes'] = 0;
stats['gameswithoutamistake'] = 0;

stats['mostwinsinarow'] = 0;
stats['mostlettersinarow'] = 0;
stats['winsinarow'] = 0;
*/

// Set to zero, see [totalwinsinarow] etc.
stats['lettersinarow'] = 0;
stats['timeplayed'] = '';
stats['score'] = 0;
stats['mistakes'] = 0;

//Total
stat_names['gameswon'] = 'Games won';
stat_names['gameslost'] = 'Games lost';
stat_names['gamesplayed'] = 'Games played';
stat_names['shortestwinningtime'] = 'Shortest winning time';
stat_names['longestwinningtime'] = 'Longest winning time';
stat_names['totaltime'] = 'Total time spent playing';
stat_names['highestscore'] = 'Highest score earned';
stat_names['totalscore'] = 'Total score earned';
stat_names['gameswithoutamistake'] = 'Games won without a mistake';
stat_names['totalmistakes'] = 'Total mistakes made';
stat_names['winsinarow'] = 'Wins in a row';
stat_names['mostwinsinarow'] = 'Most wins in a row';
stat_names['mostlettersinarow'] = 'Most letters guessed in a row';
//Last game
//stat_names['lettersinarow'] = 'Letters in a row last game';
stat_names['timeplayed'] = 'Time played last game';
stat_names['score'] = 'Score last game';
stat_names['mistakes'] = 'Mistakes last game';

// [id] = [points, stage, date];
// eg. achievs['gameswon'] = [10, 5, '02122012'];
// Loaded from DB
/*
achieve['gamesplayed'] = [10, 0, null];
achieve['gameswon'] = [10, 0, null];
achieve['winsinarow'] = [10, 0, null];
achieve['lettersinarow'] = [10, 0, null];
achieve['timeplayed'] = [10, 0, null];
achieve['score'] = [10, 0, null];
achieve['gameswithoutamistake'] = [10, 0, null];
*/

// Achievement stages
// achieve_stages[id] = [stage1, stage2, stage3,...]
achieve_stages['gamesplayed'] = ['', 'Your First Game', '5 Games', '10 Games', '25 Games', '50 Games', '100 Games', '250 Games', '500 Games', '1000 Games'];
achieve_stages['gameswon'] = ['', 'Your First Win', '5 Wins', '10 Wins', '25 Wins', '50 Wins', '100 Wins', '250 Wins', '500 Wins', '1000 Wins'];
achieve_stages['winsinarow'] = ['', 'Two Wins in a Row', 'Three Wins in a Row', 'Four Wins in a Row', 'Five Wins in a Row', 'Six Wins in a Row', 'Seven Wins in a Row', 'Eight Wins in a Row', 'Nine Wins in a Row', 'Ten Wins in a Row'];
achieve_stages['lettersinarow'] = ['', 'Two Letters in a Row', 'Three Letters in a Row', 'Four Letters in a Row', 'Five Letters in a Row', 'Six Letters in a Row', 'Seven Letters in a Row', 'Eight Letters in a Row', 'Nine Letters in a Row', 'Ten Letters in a Row', 'Eleven Letters in a Row', 'Twelve Letters in a Row', 'Thirteen Letters in a Row', 'Fourteen Letters in a Row', 'Fifteen Letters in a Row'];
achieve_stages['timeplayed'] = ['', 'Under 3 Minutes', 'Under 2 Minutes', 'Under a Minute', 'Under 45 Seconds', 'Under 30 Seconds', 'Under 20 Seconds', 'Under 15 Seconds', 'Under 10 Seconds'];
achieve_stages['score'] = ['', 'Over Three Thousand', 'Over Four Thousand', 'Over Five Thousand', 'Over Six Thousand', 'Over Seven Thousand', 'Over Eight Thousand', 'Over Nine Thousand!', 'Over Ten Thousand', 'Over Eleven Thousand', 'Over Twelve Thousand'];
achieve_stages['gameswithoutamistake'] = ['', 'No Mistake', '5 Without a Mistake', '10 Without a Mistake', '25 Without a Mistake', '50 Without a Mistake', '100 Without a Mistake'];

// Achievement criteria
// achieve_criteria[id] = [variable, value1, value2, value3,...]
achieve_criteria['gamesplayed'] = ['gamesplayed', 1, 5, 10, 25, 50, 100, 250, 500, 1000];
achieve_criteria['gameswon'] = ['gameswon', 1, 5, 10, 25, 50, 100, 250, 500, 1000];
achieve_criteria['winsinarow'] = ['winsinarow', 2, 3, 4, 5, 6, 7, 8, 9, 10];
achieve_criteria['lettersinarow'] = ['lettersinarow', 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
achieve_criteria['timeplayed'] = ['timeplayed', 180000, 120000, 60000, 45000, 30000, 20000, 15000, 10000];
achieve_criteria['score'] = ['score', 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000];
achieve_criteria['gameswithoutamistake'] = ['gameswithoutamistake', 1, 5, 10, 25, 50, 100];

function checkAchievement(name) {
    var i = 1;
    //console.log(name+': '+stats[name]);
    
    for(i in achieve_criteria[name]) {
        var requirement = false;
        var a = parseInt(i)+1;
        
        if(name=='timeplayed') {if(stats[achieve_criteria[name][0]] < achieve_criteria[name][i] && (stats[achieve_criteria[name][0]] < achieve_criteria[name][a]) == false) requirement = true;}
        else if(name=='score') {if(stats[achieve_criteria[name][0]] > achieve_criteria[name][i] && (stats[achieve_criteria[name][0]] > achieve_criteria[name][a]) == false) requirement = true;}
        else {if(stats[achieve_criteria[name][0]] == achieve_criteria[name][i]) requirement = true;}
    
        if(requirement == true && i > (achieve[name][1])) {
            var aname = achieve_stages[name][i];
            
            //console.log('Achievement earned: ' + aname);
            achieve[name][1] = parseInt(i);
            achieve[name][2] = date.getTime(); 
            //console.log(achieve[name]);
            
            date = new Date();
            var month = date.getMonth()+1;
            var datestring = date.getDate()+'. '+month+'. '+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes(); 
            
            pushAchievement(aname, achieve[name][0], datestring);
            updateRecord('achieves', [achieve[name][1], achieve[name][2], name]);
        }                       
    }
}

function parseAchievement(name) {
    var points = achieve[name][0];
    var stage = achieve[name][1];
    var timestamp = achieve[name][2];
    var name = achieve_stages[name][stage];
    var time = new Date(timestamp);
    var month = time.getMonth()+1;
    
    //// console.log(points+'pts    '+name+'      Earned: '+time.getDate()+'. '+month+'. '+time.getFullYear()+' '+time.getHours()+':'+time.getMinutes());
}

var aindex = 9999;
function pushAchievement(name, points) {
      var bcd = $('#achievements > div').length;            
      $('#achievements').append('<div id="achievement'+aindex+'" class="achievement" style="z-index:'+aindex+'"><div class="achiev_content"><p>Achievement earned: '+name+'</p></div></div>');
      $('#achievement'+aindex).wait(bcd*3500+700).animate({top: '0px'}, 400, 'linear').wait(2000).animate({top: '-90px'}, 400, 'linear', function(){$(this).remove()});
      //$('#achievement'+aindex).css('top', bcd*25+'px').wait(1000).fadeIn(500).wait(3000).fadeOut(500, function(){$(this).remove()});
     // achieve_timeouts[aindex] = setTimeout('pullAchievement('+aindex+')', 2500);
      aindex--;
}
/*
function pullAchievement(id) {
      var aid = $('#achievement'+id);                  
      if(aid.css('top')=='0px') {
          aid.animate({top: '-26px'}, 400, 'linear', function(){$(this).remove()});
          clearTimeout(achieve_timeouts[id]);
      }
} */

function testAchievements() {
    for(x in achieve) checkAchievement(x);
}

function listAchievements() {
    $('#achievementbrowser').html('<h1>Achievements:</h1><table></table>');
    for(x in achieve) {
          $('#achievementbrowser>table').append('<tr><td colspan="2"></td></tr>');
          var points = achieve[x][0];
          var stage = achieve[x][1];
          var name = achieve_stages[x][stage];
          var next = achieve_stages[x][stage+1];
          var datestring = '';
		
          if((stage+1) >= achieve_stages[x].length) next = 'highest rank obtained';
          if(stage==0) name = 'not yet earned';
		
          else {
            var earned = new Date(achieve[x][2]);
            var month = earned.getMonth()+1;
            var hours = earned.getHours();
			      var minutes = earned.getMinutes();
			      var ampm = (hours>12 ? ' pm' : ' am');
			      hours = (hours<10 ? '0'+hours : ((hours>12) ? hours-12 : hours));	
		        minutes = (minutes<10 ? '0'+minutes : minutes);			
				
            datestring = month+'/'+earned.getDate()+'/'+earned.getFullYear();
          }
          
          $('#achievementbrowser>table').append('<tr><td>&nbsp;&nbsp;<strong>'+name+'</strong></td><td>&nbsp;&nbsp;'+datestring+'</td></tr><tr><td colspan="2">&nbsp;&nbsp;next: '+next+(((stage+1) < achieve_stages[x].length) ? ' ('+stats[x]+' / '+achieve_criteria[x][stage+1]+')</td></tr>' : '</td></tr>'));
    }
    $('#achievementbrowser').append('<span href="#achievement" class="statlink">achievements</span>&nbsp;&nbsp;&nbsp; <span href="#stats" class="statlink">statistics</span>');  
}

function listStats() {
    var data = '<h1>Statistics:</h1><ul style="margin-left: 40px;">';
    var i = 0;
    for(x in stat_names) {
        i++;
        if(x.search('time')>=0) {
            if(stats[x]>3600000){
              hrs = Math.floor(stats[x]/3600000);
              min = Math.floor((stats[x]-(hrs*3600000))/60000);
              sec = Math.floor((stats[x]-(hrs*3600000)-(min*60000))/1000);
              val = hrs+' hrs '+min+' min '+sec+' sec';
            }else if(stats[x]>60000) {
              min = Math.floor(stats[x]/60000);
              sec = Math.floor((stats[x]-(min*60000))/1000);
              val = min+' min '+sec+' sec';
            }else {
              val = Math.floor(stats[x]/1000)+' sec';
            } 
        } else val = stats[x];
        data += '<li><strong>'+stat_names[x]+':</strong> '+val+'</li>';
    }
   data += '</ul><div style="width: 100%; clear:both;"><span href="#achievement" class="statlink">achievements</span>&nbsp;&nbsp;&nbsp;<span href="#stats" class="statlink">statistics</span></div>';
   $('#statsbrowser').html(data);
}

function listAllStats() {
    $('#statsbrowser').html('<h1>Statistics:</h1>');
    for(x in stats) {
        if(x.search('time')>=0) {
            if(stats[x]>3600000){
              hrs = Math.floor(stats[x]/3600000);
              min = Math.floor((stats[x]-(hrs*3600000))/60000);
              sec = Math.floor((stats[x]-(hrs*3600000)-(min*60000))/1000);
              val = hrs+' hrs '+min+' min '+sec+' sec';
            }else if(stats[x]>60000) {
              min = Math.floor(stats[x]/60000);
              sec = Math.floor((stats[x]-(min*60000))/1000);
              val = min+' min '+sec+' sec';
            }else {
              val = Math.floor(stats[x]/1000)+' sec';
            } 
        } else val = stats[x];
        $('#statsbrowser').append(stat_names[x]+': '+val+'<br>');
    }
    $('#statsbrowser').append('<span href="#achievement" class="statlink">achievements</span>  <span href="#stats" class="statlink">statistics</span>');
}

function updateStat(name, value) {
    //// console.log('stats['+name+'] = '+stats[name]+' new value: '+value);
    stats[name] = value;
    updateRecord('stats', [value, name]);
}

setTimeout('listAchievements()', 2000);
setTimeout('listStats()', 2000);