var createStatement = [];
    createStatement['stats'] = "CREATE TABLE IF NOT EXISTS hangman_stats (name TEXT PRIMARY KEY, value INTEGER)";
    createStatement['achieves'] = "CREATE TABLE IF NOT EXISTS hangman_achieves (name TEXT PRIMARY KEY, points INTEGER, stage INTEGER, date INTEGER)";
var selectAllStatement = "SELECT * FROM hangman_";
var insertStatement = [];
    insertStatement['stats'] = "INSERT INTO hangman_stats (name, value) VALUES (?, ?)";
    insertStatement['achieves'] = "INSERT INTO hangman_achieves (name, points, stage, date) VALUES (?, ?, ?, ?)";
var updateStatement = [];
    updateStatement['stats'] = "UPDATE hangman_stats SET value = ? WHERE name = ?";
    updateStatement['achieves'] = "UPDATE hangman_achieves SET stage = ?, date = ? WHERE name = ?";
var deleteStatement = [];
    deleteStatement['stats'] = "DELETE FROM hangman_stats WHERE name = ?";
    deleteStatement['achieves'] = "DELETE FROM hangman_achieves WHERE name = ?";
var deleteAllStatement = "DELETE FROM hangman_";
var dropStatement = "DROP TABLE hangman_";
var errors = 0;

var db = openDatabase("Hangman", "1.0", "Hangman Database", 2*100);
var dataset;
var createStats = createTable('stats');
var createAchieves = createTable('achieves');
//createTable('words');

function onError(tx, error) {
    errors++;
    alert(error.message);
}

function loadRecords(type) {
    if(type=='stats' || type=='achieves') {
        db.transaction(function(tx) {
            tx.executeSql(selectAllStatement+type, [], function(tx, result) {
                dataset = result.rows;
                //// console.log('-----')
                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);
                    if(type=='stats') stats[item['name']] = item['value'];
                    else achieve[item['name']] = [item['points'], item['stage'], item['date']];
                    //// console.log(item['name'] + ' = ' + item['value']);
                }
            });
        });
    }

}

function showRecords(type) {
    if(type=='stats' || type=='achieves') {
        db.transaction(function(tx) {
            tx.executeSql(selectAllStatement+type, [], function(tx, result) {
                dataset = result.rows;
                // console.log('---');
                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);
                    //if(type=='stats') // console.log(item['name'] + ' = ' + item['value']);
                    //else // console.log(item['name'] + ' = ' + item['points'] + ', ' + item['stage'] + ', ' + item['date']);
                }
            });
        });
    }
}

function createTable(type) {
    errors = 0;
    if(type=='stats' || type=='achieves') {
        db.transaction(function(tx) {
            tx.executeSql(createStatement[type], [], created(type), onError);
        });
    }
    if(!errors) return true;
    else return false;
}

function created(type) {
    db.transaction(function(tx) {
        tx.executeSql(selectAllStatement+type, [], function(tx, result) {
            dataset = result.rows;
            /*var preserveData = [];
            for (var i = 0, item = null; i < dataset.length; i++) {
                item = dataset.item(i);
                preserveData[item['name']] = item['value'];
                deleteRecord('stats', [item['name']]);
            }
            
            toinsert = ['gamesplayed', 'gameswon', 'gameslost', 'totaltime', 'shortestwinningtime', 'longestwinningtime', 'totalscore', 'totalmistakes', 'gameswithoutamistake', 'mostwinsinarow', 'mostlettersinarow'];
            for (i in toinsert) {
                // console.log(preserveData[toinsert[i]]+', '+(preserveData[toinsert[i]]!==undefined ? preserveData[toinsert[i]] : 0));
                insertRecord('stats', [toinsert[i], (preserveData[toinsert[i]]!==undefined ? preserveData[toinsert[i]] : 0)]);
            }*/
            
            if(dataset.length==0) {           
                if(type=='stats') {
                    toinsert = ['gamesplayed', 'gameswon', 'gameslost', 'totaltime', 'shortestwinningtime', 'longestwinningtime', 'highestscore', 'totalscore', 'totalmistakes', 'gameswithoutamistake', 'mostwinsinarow', 'mostlettersinarow', 'winsinarow'];
                    for (i in toinsert) insertRecord(type, [toinsert[i], 0]);
                } else {
                    toinsert = [];
                    toinsert[0] = ['gamesplayed', 'gameswon', 'winsinarow', 'lettersinarow', 'timeplayed', 'score', 'gameswithoutamistake'];
                    toinsert[1] = [ 10,            10,         10,           10,              10,           10,      10];
                    for (i in toinsert[0]) insertRecord(type, [toinsert[0][i], toinsert[1][i], 0, null]);
                }
            }
            loadRecords(type);
        });
    });
}

function insertRecord(type, data) {
    if(type=='stats' || type=='achieves') {
        db.transaction(function(tx) {
            tx.executeSql(insertStatement[type], data, nothing, onError);
        });
    }
}

function loadRecord(i) {
    var item = dataset.item(i); 
    //firstName.value = item['firstName'];
    //lastName.value = item['lastName'];
}

function updateRecord(type, data) {
    db.transaction(function(tx) {
        tx.executeSql(updateStatement[type], data, showRecords(type), onError);
    }); 
}

function deleteRecord(type, data) {
    db.transaction(function(tx) {
        tx.executeSql(deleteStatement[type], data, nothing, onError);
    });
}

function dropTable(type) {
    if(type=='stats' || type=='achieves') {
        db.transaction(function(tx) {
            tx.executeSql(dropStatement+type, [], showRecords, onError);
        });
    }
}

function nothing() {
  //// console.log('success');
}