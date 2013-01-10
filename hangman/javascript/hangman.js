var word = '';
var category = '';
var completedLetters = 0;
var hanged = 0;
var wordLength = 0;
var wordInput = '';
var sw;
var timePlayed;
var date = new Date;
var timeOfLastGuessed = date.getTime();

var actionwords = ['bark','blend','blast','boast','bump','chase','chap','climb','crawl','cry','dream','faint','float','fly','frown','groan','hide','hike','hop','joke','jump','melt','paddle','pretend','pull','push','race','ride','roll','row','rub','sail','search','shake','shout','sing','smash','spoil','spread','spray','stalk','stamp','step','stroll','stuff','swim','tag','tickle','travel','trip','vote','wag','whirl','wish','bake','bang','beep','blink','boil','broil','buzz','cackle','caw','chatter','cheep','chime','clang','clap','click','clash','crush','cut','dash','follow','frighten','fry','giggle','growl','heat','hiss','hoot','hum','juggle','laugh','leap','mix','pass','poach','purr','rattle','ring','roar','roast','rush','scramble','scream','screech','shiver','sink','slide','snap','sob','speed','stumble','swing','thump','toast','toss','wail','wave','weep','whip','whisper','wrestle'];
var adjectives = ['ravishing','outstanding','mimic','famous','cheerful','livid','obstinate','exhausted','graceful','outrageous','radical','childish','snobbish','miserly','amiable','disgusting','awful','humorous','fanciful','pathetic','windy','dusty','bashful','freaky','chilly','stormy','humid','bountiful','jubilant','irritated','patient','dizzy','skeptical','puzzled','lighthearted','perplexed','overwhelmed','jovial','hyper','squirrely','jittery','sensational','elegant','gleeful','flabbergasted','dreary','impish','sneaky','horrid','monsterous'];
var animals = ['ant','antelope','ape',,'badger','bat','bear','beaver','bird','boar','camel','canary','cat','cheetah','chicken','chimpanzee','chipmunk','cow','crab','crocodile','deer','dog','dolphin','donkey','duck','eagle','elephant','ferret','fish','fox','frog','goat','hamster','hare','horse','kangaroo','leopard','lion','lizard','mole','monkey','mousedeer','mule','ostritch','otter','panda','parrot','pig','polecat','porcupine','rabbit','rat','rhinoceros','seal','sheep','snake','squirrel','tapir','toad','tiger','tortoise','walrus','whale','wolf','zebra'];    
var astrology = ['accretion','albedo','albedo feature','antipodal point','aphelion','arcuate','asteroid','asteroid number','astronomical unit','atmosphere','aurora','aurora borealis','bar','Barsoom','billion','bolide','caldera','carbonate','catena','cavus','chaos','chasma','canyon','chromosphere','colles','coma','comet','conjunction','Congress','convection','corona','corona','coronagraph','cosmicray','crater','density','disaster','disk','doppler effect','dinosaurs','direct','dorsum','eccentricity','effusive eruption','ellipse','explosive eruption','exponential notation','facula','farrum','filament','fireball','fissure','flare','flexus','fluctus','fossa','Gaia Hypothesis','Galilean Moons','geosynchronous orbit','granulation','green house effect','heliocentric','heliopause','heliosphere','ice','inclination','inferior planets','ionosphere','labes','labyrinthus','lacus','Lagrange points','lidar','limb','light year','linea','liter','lunar month','macula','magnetosphere','magnetotail','magnitude','mare','mensa','metal','meteor','meteorite','meteoroid','millibar','minor planets','mons','neutrino','nuclear fusion','oceanus','old','opposition','ovoid','palus','parsec','patera','penumbra','perihelion','perturb','photosphere','plage','planitia','planum','prominence','promontorium','redgiant','regio','resolution','resonance','reticulum','retrograde','rift valley','rima','rupes','scarp','scopulus','semimajor axis','shepherd satellite','sidereal','sidereal month','silicate','sinus','solar cycle','solar nebula','solar wind','speed of light','spicules','stellar classification','sublime','sulcus','sunspot','superior planets','synchronous orbit radius','synchronous rotation','tectonic','terminator','terra','tessera','tholus','tidal heating','Trojan','umbra','undae','vallis','vastitas','volatile','white dwarf','young','zodiacal light'];
var countries = ['Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Deps','Argentina','Armenia','Australia','Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina','Burundi','Cambodia','Cameroon','Canada','Cape Verde','Central African Republic','Chad','Chile','China','Colombia','Comoros','Congo','Costa Rica','Croatia','Cuba','Cyprus','Czech Republic','Denmark','Djibouti','Dominica','Dominican Republic','East Timor','Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Ethiopia','Fiji','Finland','France','Gabon','Gambia','Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea','Guinea Bissau','Guyana','Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Ivory Coast','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati','North Korea','South Korea','Kosovo','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg','Macedonia','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico','Micronesia','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar','Namibia','Nauru','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','Norway','Oman','Pakistan','Palau','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal','Qatar','Romania','Russian Federation','Rwanda','St Kitts and Nevis','St Lucia','Saint Vincent and the Grenadines','Samoa','San Marino','Sao Tome and Principe','Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia','Solomon Islands','Somalia','South Africa','South Sudan','Spain','Sri Lanka','Sudan','Suriname','Swaziland','Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania','Thailand','Togo','Tonga','Trinidad and Tobago','Tunisia','Turkey','Turkmenistan','Tuvalu','Uganda','Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan','Vanuatu','Vatican City','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe'];
var materials = ['acrylic','alloy','aluminium','aramid','bakelite','brass','brick','bronze','carbon','cardboard','cast iron','cement','ceramics','chlorofibre','copper','cotton','diamond','epoxy','fibre','fibreglass','fluoropolymer','glass','glue','gold','iron','leather','linen','kelvar','nylon','paper','polyamide','polymers','polyester','polyethylene','polypropylene','rubber','sand','silica','silver','skin','steel','stone','titanium','vinyls','viscose','wood','wool'];
var presidents = ['George Washington','John Adams','Thomas Jefferson','James Madison','James Monroe','John Quincy Adams','Andrew Jackson','Martin Van Buren','William Henry Harrison','John Tyler','James Knox Polk','Zachary Taylor','Millard Fillmore','Franklin Pierce','James Buchanan','Abraham Lincoln','Andrew Johnson','Ulysses Simpson Grant','Rutherford Birchard Hayes','James Abram Garfield','Chester Alan Arthur','Grover Cleveland','Benjamin Harrison','Grover Cleveland','William McKinley','Theodore Roosevelt','William Howard Taft','Woodrow Wilson','Warren Gamaliel Harding','Calvin Coolidge','Herbert Clark Hoover','Franklin Delano Roosevelt','Harry S Truman','Dwight David Eisenhower','John Fitzgerald Kennedy','Lyndon Baines Johnson','Richard Milhous Nixon','Gerald Rudolph Ford','Jimmy Carter','Ronald Wilson Reagan','George Herbert Walker Bush','William Jefferson Clinton','George Walker Bush','Barack Obama'];
var sports = ['aeromodelling','aikido','archery','arm wrestling','backgammon','badminton','baseball','basket ball','billiards','bingo','bird watching','blackjack','bobsledding','bowling','boxing','bull fighting','bungy jump','bridge','camping','canoeing','caravaning','carrom','charades','checkers','chess','chinese checkers','chinese chess','cock fighting','computer games','crickets','croquet','cycling','dancing','darts','decathlon','discus','scuba diving','springboard diving','dog racing','dominoes','exploring','fantan','fencing','fishing','flying','flying kites','football','frisbees','gambling','gin rummy','gliding','go','go carting','go skating','go skiing','golf','gymnastics','hang gliding','high jump','hockey','horse racing','horse riding','hot air balloon','hunting','hurdle','ice hockey','ice skating','jai alai','javelin','jogging','judo','jujitsu','karate','kendo','kung fu','lacrosse','long jump','lottery','mah jong','marathon','marbles','monopoly','motorbike racing','mountaineering','netball','onearm bandit','parachuting','pinball','poker','polo','reversi','rock climbing','rodeo','roller skating','roulette','rowing','rugby','running','sailing','scrabble','skateboarding','skating','skiing','skipping','sky diving','shooting','snake and ladder','snorkeling','soccer','softball','solitaire','spelunking','sprinting','squash','sumo wrestling','surfing','swimming','table tennis','tae kwon do','tai chi','tennis','tombola','trampoline','treasure hunt','trekking','tug of war','video games','volleyball','water polo','weight lifting','windsurfing','wrestling','yachting'];
var expressive = ['absolutely','amazing','approved','attractive','authentic','bargain','beautiful','better','big','colorful','colossal','complete','confidential','crammed','delivered','direct','discount','easily','endorsed','enormous','excellent','exciting','exclusive','expert','famous','fascinating','fortune','free','full','genuine','gift','gigantic','greatest','guaranteed','helpful','highest','huge','immediately','improved','informative','instructive','interesting','largest','latest','lavishly','liberal','lifetime','limited','lowest','magic','mammoth','miracle','noted','odd','outstanding','personalized','popular','powerful','practical','professional','profitable','profusely','proven','quality','quickly','rare','reduced','refundable','remarkable','reliable','revealing','revolutionary','scarce','secrets','security','selected','sensational','simplified','sizable','special','startling','strange','strong','sturdy','successful','superior','surprise','terrific','tested','tremendous','unconditional','unique','unlimited','unparalleled','unsurpassed','unusual','useful','valuable','wealth','weird','wonderful'];
var transports = ['aircraft','balloon','blimp','bus','bicycle','cable car','car','cart','conveyor belt','escalator','glider','hover craft','lift','motorbike','parachute','prime mover','roller skates','ship','ski','taxi','tractor','trailer','train','tram','trishaw','trolley','truck','van'];
var describe = ['angry','brave','bright','busy','clever','cold','cozy','deep','flat','foggy','free','fresh','frozen','gentle','giant','glad','grand','hollow','hungry','hurt','lucky','neat','new','old','polite','proud','rough','serious','shiny','short','shy','smooth','spotted','strong','tall','tough','weak','wide','wild','wise','bumpy','careful','cheeful','chilly','clean','cloudy','crisp','damp','enormous','fancy','flashy','flowery','frosty','fuzzy','huge','icy','kind','marvelous','merry','messy','mighty','misty','moldy','plaid','plain','quiet','scented','selfish','sharp','slim','slippery','sloppy','sly','soggy','spicy','stormy','striped','sweet','tasty','thiny','tiny','velvety','twinkling','weak','worn','young'];
var colors = ['amber','beige','black','blue','brown','crimson','cyan','gray','green','indigo','magenta','orange','pink','purple','red','violet','white','yellow'];

var wordlist = [];

wordlist['action words'] = actionwords;
wordlist['adjectives'] = adjectives;
wordlist['animals'] = animals;
wordlist['astrology terms'] = astrology;
wordlist['countries'] = countries;
wordlist['materials'] = materials;
wordlist['american presidents'] = presidents;
wordlist['sports'] = sports;
wordlist['expressive words'] = expressive;
wordlist['transport words'] = transports;
wordlist['words that describe'] = describe;
wordlist['colors'] = colors;

// Chooses random word from a given category
function chooseRandomWord(cat) {
    var random = Math.floor(Math.random()*wordlist[cat].length);
    return wordlist[cat][random];
}

// Starts the game
function startGame(cat, wrd) { 
    completedLetters = 0;
    hanged = 0;

    if(category=='') category = "custom";

    if(category!='custom') {
        stats['lettersinarow'] = 0;
        stats['score'] = 0;
        stats['mistakes'] = 0;  
    }     

    $("#letters").fadeIn('slow');
              
    if(!wrd) word = chooseRandomWord(cat);        
    else word = wrd;
    
    // console.log(word);
    
    // clear the input
    if(cat=='custom') {
        wordInput = '';
        $('#word_input').html('');
    }
    
    $('.letter').each(function() {$(this).removeClass('disabled')}); // makes sure none of the letters are smudged
    $('.hangman').each(function() {$(this).css('display', 'none');}); // hides the whole hang man
    $('#stopwatch').html('Time: 00:00');
    $('#score').html('Score: 0');
    
    wordLength = word.length;
    var a = wordLength
    var guessCss = '';
    $('#word').html('');
    
    if(wordLength>9 && wordLength<17) guessCss = 'guessLetterSmall';
    else if(wordLength>16 &&wordLength<23) guessCss = 'guessLetterSmaller';
    else if(wordLength>22) guessCss = 'guessLetterSmallest';
    else guessCss = 'guessLetter';
    
    for(var i in word) {
        a--;
        if(word[a]==' ') {
            $('#word').append('<div class="'+guessCss+'" style="border: none;" id="letter'+a+'"><font style="color: white; display: none;"> </font></div>');
            completedLetters++;
        } else $('#word').append('<div class="'+guessCss+'" id="letter'+a+'"><font style="color: white; display: none;"></font></div>');
    }
    $('#word').append('<div id="category">category: '+category+'</div>'); 
    if(category!='custom') {
        then = new Date();
        sw = setInterval('stopWatch()', 500);
    }  
}

function tryLetter(letter) {
    var hang = 1;
    var alreadyEarned = 0;
  
    for(i in word) {
        if (letter == word[i].toLowerCase()) {  
            hang = 0; completedLetters++;
            if(category!='custom') {
                if(alreadyEarned==0) stats['lettersinarow']++;
                if(stats['mostlettersinarow'] < stats['lettersinarow']) updateStat('mostlettersinarow', stats['lettersinarow']);
                checkAchievement('lettersinarow');
                updateScore(timeOfLastGuessed, alreadyEarned);
                alreadyEarned++;
                date = new Date;
                timeOfLastGuessed = date.getTime();
            }
            $('#letter'+i+' > font').html(word[i]).fadeIn('slow', checkStatus());             
        }
    }
    
    alreadyEarned = 0;
  
    if(hang == 1) {
        hanged++;
        $('#hang'+hanged).fadeIn('normal', checkStatus());
        stats['lettersinarow'] = 0;
        stats['mistakes']++;
    }
  
    //$('#'+letter).attr('src', "images/alphabet_used/"+letter+".png");                 
    $('#'+letter).addClass('disabled');
}

function checkStatus() {
    if(hanged == 7) {
        for(i in word) if($('#letter'+i+' > font').html() == '') $('#letter'+i+' > font').html(word[i]).css('color', 'red').fadeIn('slow');
        message('gameover');
    }else if(completedLetters == wordLength) message('congrats');
}

function message(msg) {

    clearInterval(sw);

    
    if(msg=='gameover') {
        $('#msg_content > p').delay(700).html('Game Over');
        if(category!='custom') {
            updateStat('gameslost', stats['gameslost']+1);
            updateStat('totalmistakes', stats['totalmistakes'] += stats['mistakes']);
            updateStat('totaltime', stats['totaltime']+timePlayed);
            updateStat('winsinarow', 0);
            updateStat('score', 0);
            updateStat('gamesplayed', stats['gamesplayed']+1);
            checkAchievement('gamesplayed');
        }
    }else if(msg=='congrats') {
        $('#msg_content > p').delay(700).html('You won!');
        if(category!='custom') {
            stats['timeplayed'] = timePlayed;
            updateStat('gameswon', stats['gameswon']+1);
            updateStat('winsinarow', stats['winsinarow']+1);
            updateStat('totalscore', stats['totalscore'] += stats['score']);
            updateStat('totalmistakes', stats['totalmistakes'] += stats['mistakes']);
            updateStat('totaltime', stats['totaltime']+timePlayed);
            if(timePlayed < stats['shortestwinningtime'] || stats['shortestwinningtime']==0) updateStat('shortestwinningtime', timePlayed);
            if(timePlayed > stats['longestwinningtime']) updateStat('longestwinningtime', timePlayed);
            if(stats['mostwinsinarow'] < stats['winsinarow']) updateStat('mostwinsinarow', stats['winsinarow']);
            if(stats['score'] > stats['highestscore']) updateStat('highestscore', stats['score']);
            checkAchievement('gameswon');
            checkAchievement('winsinarow');
            checkAchievement('timeplayed');
            checkAchievement('score');
            updateStat('gamesplayed', stats['gamesplayed']+1);
            checkAchievement('gamesplayed');

            if(stats['mistakes']==0) {
                updateStat('gameswithoutamistake', stats['gameswithoutamistake']+1);
                checkAchievement('gameswithoutamistake');
            }
        }
    }

    $('#letters').fadeOut('slow');
    $('#message').fadeIn('slow');
}

function stopWatch() {
    var now = new Date;
    timePlayed = now.getTime()-then.getTime();
    var time = new Date(timePlayed);  
    var minutes = time.getMinutes();
    var seconds = time.getSeconds();
  
    minutes = (minutes<10 ? '0'+minutes : minutes);
    seconds = (seconds<10 ? '0'+seconds : seconds);
  
    $('#stopwatch').html('Time: '+minutes+':'+seconds);
}

function updateScore(last, earned) {
    date = new Date;
    var sec = (date.getTime()-last)/1000;
    if(sec>30 || earned!=0) sec = 30;
    stats['score'] += 50 + stats['lettersinarow']*100 + (300 - (sec*10));
    //// console.log('50 + '+stats['lettersinarow']+'*100 + (150 - ('+sec+'*10)) = '+stats['score']+'  '+last);
    stats['score'] = Math.round(stats['score']);
  
    $('#score').html('Score: '+stats['score']);
}     