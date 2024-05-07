var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: null,
    database: "Regov"

});

connection.connect(function(err){
    if(err){
        console.log(err.code);
        console.log(err.fatal);
    }
})

$query = "SELECT * FROM user";
connection.query($query, function(err, rows, fields){
    if(err){
        console.log("An error occured with the query");
        return;
    }
    console.log("Query successfully executed", rows);

})

// Function to fetch user profile based on user ID
const fetchUserProfile = (userId, callback) => {
    // SQL query to select user profile based on user ID
    const query = `SELECT * FROM users WHERE id = ?`;
  
    // Execute the SQL query with the user ID as a parameter
    connection.query(query, [userId], (error, results) => {
      if (error) {
        // If an error occurs, invoke the callback with the error
        callback(error, null);
      } else {
        // If the query is successful, invoke the callback with the user profile data
        callback(null, results[0]); // Assuming there is only one user with the given ID
      }
    });
};
  
// Export the fetchUserProfile function
module.exports = fetchUserProfile;

connection.end(function(){
    console.log("Connection closed");
})