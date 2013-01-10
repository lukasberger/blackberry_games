$(document).ready(function() {
    
  $.fn.wait = function(time, type) {
      time = time || 1000;
      type = type || "fx";
      return this.queue(type, function() {
          var self = this;
          setTimeout(function() {
              $(self).dequeue();
          }, time);
      });
  };
    
  $('.letter').click(function() {
      //var src=$(this).attr('src');
      //var split = src.split("/");

      //if(split[1] == 'alphabet') tryLetter($(this).attr('id'));
      if(!$(this).hasClass('disabled')) tryLetter($(this).text());
      return false;         
  });

  $('.letter_input').click(function() {
      if(wordInput.length<29) {                    
          $('#word_input').append('<div class="inputLetter">'+$(this).attr('id').substr(0,1)+'</div>');
          wordInput += $(this).attr('id').substr(0,1);

          inputCss = 'inputLetter';

          $('.inputLetter').each(function(){$(this).addClass(inputCss)})
      }
      return false;      
  });

  $('#backspace').click(function() {                    
      $('#word_input > div').last().remove();
      wordInput = wordInput.substr(0, (wordInput.length-1)) 
      return false;         
  });

  $('#space').click(function() {                    
      $('#word_input').append('<div class="inputLetter" style="border: none;"> </div>');
      wordInput += ' ';  
      return false;         
  });

  $('#submit').click(function() { 
      category = 'custom';
      if(wordInput!='') {                   
          $('#wordinput').fadeOut('slow', function() {
          startGame(category, wordInput);
          $('#game').fadeIn('slow')});
      }
      return false;        
  });

  $('.menu').click(function() {
      var where = $(this).attr('href');
      if(where=='#achievementbrowser') {
        listAchievements();
        listStats();
      }
      if(where!='#exit') $('#menu').fadeOut('slow', function() {    
          $(where+', #returntomenu').fadeIn('slow');
      });
      return false;      
  });

  $('.msglink').click(function() {
      var selector;
      var where = $(this).attr('href');
      
      if(category=='custom' && where=='#game') where = '#wordinput';     
      if(where!='#game' && where!='#wordinput') selector = '#message, #topbar > *';
      else selector = '#message, #topbar > div';
    
      $(selector).fadeOut()
      $('#game').fadeOut('slow', function() {
          if(where=='#game') {
              startGame(category);
              $('#topbar > div').fadeIn('slow');
          }
          $(where).fadeIn('slow');
      });
      return false;      
  });

  $('.category').click(function() {
      category = $(this).html();
      
      $('#wordselect').fadeOut('slow', function() {
          startGame(category);
          $('#game, #topbar > div').fadeIn('slow');            
      });      
      return false;      
  });
  
  $('#returntomenu').click(function() {
      //if($('#game').css('display') == 'block') stats['gamesplayed']--;
      $('#content > div[id!=achievements], #topbar > div').fadeOut('slow');
      $('#returntomenu').fadeOut('slow', function() {
        $('#menu').fadeIn('slow');
        $('#message').css('display', 'none');
      });
      if(sw!='') clearInterval(sw);
      return false;      
  });
  
  $('.statlink').live('click', function() {
      var where = $(this).attr('href')+'browser';
      var current = (where=='#statsbrowser' ? '#achievementbrowser' : '#statsbrowser');
      // console.log(where+' '+current);      
      $(current).fadeOut('slow', function() {$(where).fadeIn('slow')});
      return false;
  });
  
  $('*').click(function() {
    // console.log($(this).attr('class')+'+'+$(this).attr('id'));
  });
  
  
  


   /*
checkAchievement('gamesplayed');
checkAchievement('gameswon');
checkAchievement('winsinarow');
checkAchievement('lettersinarow');

parseAchievement('gamesplayed');
parseAchievement('gameswon');
parseAchievement('winsinarow');
parseAchievement('lettersinarow');
 */
});

//blackberry.payment.developmentMode = true;
var goods = [
	  {"digitalGoodID":"17842563",
       "digitalGoodSKU":"EXTRAWORDS1",
       "digitalGoodName":"Extra words for 0.99",
       "metaData":null,
       "purchaseAppName":"Hangman",
       "purchaseAppIcon":null},
	   
	  {"digitalGoodID":"17842564",
	   "digitalGoodSKU":"EXTRAWORDS2",
	   "digitalGoodName":"Extra words for 1.99",
	   "metaData":null,
	   "purchaseAppName":"Hangman",
	   "purchaseAppIcon":null}];


function pay(goodType) {
    try{
      blackberry.payment.purchase(
		  goods[goodType],
      success,failure);
   }catch (e){
     alert ("Error" + e);
   }
 }

 function success(purchase) {
   var purchasedItem = JSON.parse(purchase);
   var name = purchasedItem.digitalGoodName;
   alert("Purchased Item: " + name);
 }

 function failure(errorText, errorId) {
   alert("Error occured: " + errorText);
 } 
 
 var hasPurchased = false;