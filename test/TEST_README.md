# The Test Status and Errors in the dpki application
## Status :
* The Revocation Key method is not tested using the HC testing tool, but is debugged and tested in the code

## ERROR that you may find while running the test (07/24/2017)


### gen_users.json
* This file has the test checks all the methods that are called during genesis
  * So when you run these test see that the genesis doesn't run first

### users.json & keyRegistration.json
* This files will give an error now because i have called the revocation method by default for now. But if you still want to test them you can comment out the revocation method that is called during the genesis in the revocation.js

### revocation.json
* These test wont run now since the revocation is called by default in genesis
