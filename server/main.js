//import { Groups } from '../both/collections/chat.collections.ts';
import { Meteor } from 'meteor/meteor';
Meteor.startup(() => {

    if (Meteor.isServer) {

        var Tunnel = Meteor.npmRequire('tunnel-ssh');
        var moment = Meteor.npmRequire("moment");
        var momentTimezone = Meteor.npmRequire("moment-timezone");
        var jstz = Meteor.npmRequire("jstz");
        var mysql = Meteor.npmRequire('mysql');
        Future = Meteor.npmRequire('fibers/future');
        var sshConfig = require("./config/ssh.config.json");
        var dbConfig = require("./config/db.config.json");
        const Mutex = Meteor.npmRequire('mutex-js');
        const nGrpMtx = new Mutex();


        var config = {
            host: sshConfig.host,
            username: sshConfig.username,
            password: sshConfig.password,
            port: sshConfig.port,
            dstPort: sshConfig.dstPort,
            localPort: sshConfig.srcPort
        };

        Tunnel(config, function(err) {
            (err == null) ? console.log("Tunneled"): console.log(err)
        })

        var conn = mysql.createConnection({ // Connect to DB !move to an external file away from the users view
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password,
            database: dbConfig.database,
            port: dbConfig.port
        });

        var liveDb = new LiveMysql({ // Connect to DB !move to an external file away from the users view
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password,
            database: dbConfig.database,
            port: dbConfig.port
        });

        var closeAndExit = function() {
            liveDb.end();
            process.exit();
        };

        // Close connections on hot code push
        process.on('SIGTERM', closeAndExit);
        // Close connections on exit (ctrl + c)
        process.on('SIGINT', closeAndExit);

        Meteor.publish('channelMessages', function(num, chnnlid) { // Gets all the messages from the database
            num = num * 50;
            if (num > 18446744073709551615)
                num = 18446744073709551615;

            return liveDb.select('Select * From' +
                '(Select Messages.msgID, Messages.usrID, Messages.chnnlID, Messages.Text, Messages.Timestamp, Messages.Multimedia, Users.username ' +
                'From Users Join Messages on Users.usrID = Messages.usrID ' +
                'Where Messages.chnnlID = ' + chnnlid + ' ' +
                'Order by msgID DESC Limit ' + num + ') ' +
                'Sub Order By msgid ASC;', [{
                    table: 'Messages',
                    database: dbConfig.database
                }]);
        });


        Meteor.publish('getNotifications', function(username) { // Gets all the messages from the database
            return liveDb.select('SELECT * FROM Notifications  Where usrID = (SELECT usrID FROM Users WHERE username = "' + username + '")', [{
                table: 'Notifications',
                database: dbConfig.database
            }]);
        });





        Meteor.methods({ // All meteor methods go in here

            getChannels: function(grpid, username, token) { // Gets all the messages from the database
                var future = new Future;
                Meteor.call("authenticate", username, token, function(error, result) {
                    if (error) { throw error }
                    if (!result) { return; }
                    conn.query('SELECT * FROM Channels WHERE grpID = ' + grpid + ' ORDER by grpid ASC', function(err, rows, fields) {
                        if (err) throw err;
                        future["return"](rows)
                    })
                })
                return future.wait();
            },

            getGroups: function(username, token) { // Gets all the messages from the database
                var future = new Future;
                Meteor.call("authenticate", username, token, function(error, result) {
                    if (error) { throw error }
                    if (!result) { return; }
                    conn.query('SELECT Groups.Groupname, Groups.grpID FROM Groups INNER JOIN User_Groups ON Groups.grpID=User_Groups.grpID Where User_Groups.usrID  = (Select usrID from Users Where username = "' + username + '")', function(err, rows, fields) {
                        if (err) throw err;
                        future["return"](rows)
                    })
                })
                return future.wait();
            },


            sendMessage: function(username, chnnlID, Text, Multimedia) // sendMessage function !edit to take in SenderName, Timestamp and Channel
                {
                    conn.query('SELECT usrID From Users WHERE username="' + username + '"', function(err, rows, fields) {
                        var d = new Date();
                        liveDb.db.query('insert into Messages (`usrID`, `chnnlID`, `Text`, `Multimedia`,`Timestamp`) Values (' +
                            rows[0].usrID + ',' + chnnlID + ',"' + Text + '",' + Multimedia + ',"' + d.toISOString() + '")')
                    })
                },

            createGroup: function(groupname, username) {
                var future = new Future;
                nGrpMtx.lock(() => {
                    conn.query('Insert into Groups(`Groupname`) Values ("' + groupname + '")', function(err, rows, fields) {
                        if (err) throw err;
                        conn.query('SELECT * FROM Groups Where Groupname = "' + groupname + '" Order By grpID DESC Limit 1;', function(err, row, fields) {
                            if (err) throw err;
                            conn.query('Insert into User_Groups(`usrID`,`grpID`) Values ((SELECT usrID From Users WHERE username="' +
                                username + '")' + ',' + '(SELECT * FROM Groups Where Groupname = "' +
                                groupname + '" Order By grpID DESC Limit 1;)' + ')',
                                function(err, rows, fields) {
                                    if (err) throw err;
                                })
                        })
                    })
                })
            },

            renameGroup: function(grpID, groupname) {
                conn.query('UPDATE Groups SET `Groupname`="' + groupname + '" WHERE `grpID`="' + grpID + '"', function(err, rows, fields) {
                    if (err) throw err;
                })
            },

            inviteUserToGroup: function(group, username) {
                conn.query('INSERT INTO `Notifications` (`usrID`, `grpID`,`Groupname`) VALUES ((select usrID from Users where username = "' + username + '"),' + group.grpID + ',"' + group.Groupname + '")');
            },

            createChannel: function(grpID, channelName) {
                conn.query('INSERT INTO `Channels` (`Channelname`, `grpID`) VALUES ("' + channelName + '",' + grpID + ')');
            },

            /*
                updateMessage: function(_msgid, msgText) {
                    liveDb.db.query('UPDATE ' + dbConfig.table + ' SET messageText="' + msgText + '" WHERE msgid ="' + _msgid + '"')
                },
                
                deleteMessage: function(_msgid) {
                    liveDb.db.query('DELETE FROM ' + dbConfig.table + ' WHERE msgid = "' + _msgid + '"')
                },

                getNewTimestamp: function(msgTimestamp, tz) {
                    var tz = jstz.determine() || 'UTC';
                    var stamp = moment(msgTimestamp);
                    var momentTime = momentTimezone(msgTimestamp);
                    var tzTime = momentTime.tz("" + tz);
                    var formattedTz = tzTime.format("MMMM Do YYYY, h:mm:ss a");
                    console.log(formattedTz);
                    return formattedTz;
                },*/

            checkAvailability: function(username) {
                var future = new Future;
                username = username.trim();
                conn.query('SELECT username FROM  Users', function(err, rows, fields) {
                    if (err) throw err;
                    var found = false;
                    rows.some(function(row) {
                        if (row.username == username) {
                            future["return"](true);
                        }
                    });
                });
                var res = future.wait();
                return res;
            },

            createUser: function(username, password, email) {
                var crypto = require("crypto")
                var future = new Future;
                var hash = crypto.createHash("sha256");
                hash.update(password);
                var passhash = hash.digest('hex');
                conn.query('insert into Users (`username`,`password`,`email`) values ("' + username + '","' + passhash + '","' + email + '")', function(err, rows, fields) {
                    if (err) { future["return"]("error") } else { future["return"]("success") }
                });
                var result = future.wait();
                if (result == "error")
                    throw new Meteor.Error("Login", "Login Failed")
                else
                    return "success";
            },

            login: function(username, password) {
                var crypto = require("crypto")
                var hash = crypto.createHash("sha256");
                var future = new Future;
                hash.update(password);
                var passhash = hash.digest('hex');
                conn.query('select password from Users where username = "' + username + '"', function(err, rows, fields) {
                    if (err) throw err;
                    var rehash = crypto.createHash("sha256");
                    if (passhash == rows[0].password) {
                        rehash.update(rows[0].password);
                        future["return"](rehash.digest('hex'));
                    } else
                        future["return"]("error");
                });
                var result = future.wait();
                if (result == "error")
                    throw new Meteor.Error("Login", "Login Failed")
                else
                    return result;
            },

            authenticate: function(username, token) {
                var crypto = require("crypto")
                var future = new Future;
                conn.query('select password from Users where username = "' + username + '"', function(err, rows, fields) {
                    if (err) throw err;
                    var hash = crypto.createHash("sha256");
                    hash.update(rows[0].password);
                    var t = hash.digest('hex');
                    if (t == token)
                        future["return"](true);
                    else
                        future["return"]("error");
                });
                var result = future.wait();
                if (result == "error")
                    throw new Meteor.Error("Login", "Login Failed")
                else
                    return result;
            },

            acceptInvite: function(invite, username) {
                conn.query('INSERT INTO `User_Groups` (`usrID`, `grpID`) VALUES ((select usrID from Users where username = "' + username + '"),' + invite.grpID + ')', function(err, rows, fields) {
                    if (err) throw err;
                });
                conn.query('Delete from `Notifications` where noteID = ' + invite.noteID, function(err, rows, fields) {
                    if (err) throw err;
                });
            }

        }); // End of Meteor Methods 
    }
});