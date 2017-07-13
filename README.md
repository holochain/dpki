# dpki
Distributed Public Key Infrastructure which runs on Holochain
* The frame for the application is created.

## In Progress:
Forcuse on the first part i.e. the Key Management
* Creating the User.
* assign the permanent and Public keys.

## About:
To understand this application better. We are doing this in two parts.
* Key Mannagenment
* Identity Services

### Key Management

**Entries:**
* Agents/Users (perm_dpki_id, initial_public_key, shared_identifiers (AgentID.txt?))
  * This is the initial user that is created.
  * At this stage their is no revocation methord that is declared. So we would have a default can be revoked by adding a new Key Entry which if it specifies a revocation method, must be revoked .

* Key Registration Entries (perm_agent_id, pub_key, shared_id, **revocation method**)
 * This is used when the user decides wheich revocation methord he uses.  

### Identity Services

**Note:** Design in progress

**Entries:**
* Identity Servers (network_type, address (IP or domain), port)
  


