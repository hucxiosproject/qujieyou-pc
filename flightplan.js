var plan = require("flightplan");

plan.target("staging", {
  host: "mail.bengjiujie.com",
  username: "ubuntu",
  agent: process.env.SSH_AUTH_SOCK
});


plan.remote(function(remote) {
  remote.log("Pull application from gitlab");
  remote.exec("git pull");
  remote.with("cd /data/project/qujieyou-pc/", function() {
    remote.exec("git pull");
    remote.exec("./dockerrun.sh");
  });
});
