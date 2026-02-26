import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";

actor {
  type Username = Text;
  type Timestamp = Time.Time;
  type LoginEntry = {
    username : Username;
    timestamp : Timestamp;
  };

  // List of logins
  let loginsList = List.empty<LoginEntry>();

  public shared ({ caller }) func recordLogin(username : Username) : async () {
    if (username.isEmpty()) {
      Runtime.trap("Missing username");
    };
    let newEntry = {
      username;
      timestamp = Time.now();
    };
    loginsList.add(newEntry);
  };

  public query ({ caller }) func getAllLogins() : async [LoginEntry] {
    loginsList.toArray();
  };
};
