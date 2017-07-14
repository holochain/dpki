# Dis_PKI
Distributed Public Key Infrastructure which runs on HoloChain
* The frame for the application is created.

## In Progress:
Focuses on the first part i.e. the Key Management
* Creating the User.
* assign the permanent and Public keys.

## About:
To understand this application better. We are doing this in two parts.
* Key Management
* Identity Services

### Key Management

**Entries:**
* Agents/Users (perm_dpki_id, initial_public_key, shared_ID
  * This is the initial user that is created.
  * At this stage their is no revocation method that is declared. So we would have a default can be revoked by adding a new Key Entry which if it specifies a revocation method, must be revoked .

* Key Registration Entries (perm_agent_id, pub_key, shared_id, **revocation_Method_ID**)
 * This is used when the user decides which revocation method he uses.  

### Identity Services

**Note:** Design in progress

**Entries:**
* Identity Servers (network_type, address (IP or domain), port)
